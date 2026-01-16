import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Edit,
  PlusCircle,
  Download,
  View,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { DataGrid } from "@/components/reusable/DataGrid";
import AddOrEditMarksDialog from "./AddOrEditMarksDialog";

const dummyStudents = [
  {
    id: "stu-1",
    roll: 1,
    name: "John Doe",
    class: "10",
    section: "A",
    marks: {
      Math: "B+",
      English: "A",
      Science: "B",
      Health: "B+",
      Social: "A",
      Nepali: "B",
    },
    totalGrade: "B+",
  },
  {
    id: "stu-2",
    roll: 2,
    name: "Jane Smith",
    class: "10",
    section: "A",
    marks: {},
    totalGrade: "N/A",
  },
  {
    id: "stu-3",
    roll: 3,
    name: "Michael Johnson",
    class: "10",
    section: "A",
    marks: {
      Math: "C+",
      English: "B",
      Science: "C",
      Health: "C",
      Social: "C+",
      Nepali: "C",
    },
    totalGrade: "C+",
  },
  {
    id: "stu-4",
    roll: 4,
    name: "Emily Davis",
    class: "10",
    section: "A",
    marks: {
      Math: "A",
      English: "A",
      Science: "B+",
      Health: "A",
      Social: "A",
      Nepali: "A",
    },
    totalGrade: "A",
  },
  {
    id: "stu-5",
    roll: 5,
    name: "David Wilson",
    class: "10",
    section: "A",
    marks: {
      Math: "C",
      English: "C+",
      Science: "C",
      Health: "C",
      Social: "C",
      Nepali: "C",
    },
    totalGrade: "C",
  },
  {
    id: "stu-6",
    roll: 6,
    name: "Sophia Brown",
    class: "10",
    section: "A",
    marks: {
      Math: "B",
      English: "B+",
      Science: "B",
      Health: "B",
      Social: "B+",
      Nepali: "B",
    },
    totalGrade: "B",
  },
  {
    id: "stu-7",
    roll: 7,
    name: "Daniel Lee",
    class: "10",
    section: "A",
    marks: {
      Math: "F",
      English: "C",
      Science: "C",
      Health: "C+",
      Social: "C",
      Nepali: "C",
    },
    totalGrade: "C",
  },
];

const classSubjects = {
  10: ["Math", "English", "Science"],
  9: ["Math", "English", "Social"],
};

const MarksPage = () => {
  const [students, setStudents] = useState(dummyStudents);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("10");
  const [sectionFilter, setSectionFilter] = useState("A");
  const [examTerm, setExamTerm] = useState("1st");

  const filtered = students.filter(
    (s) =>
      s.class === classFilter &&
      s.section === sectionFilter &&
      (s.name.toLowerCase().includes(search.toLowerCase()) ||
        String(s.roll).includes(search))
  );

  // Get all unique subjects from filtered students
  const allSubjects = useMemo(() => {
    return [...new Set(filtered.flatMap((student) => Object.keys(student.marks)))];
  }, [filtered]);

  const handleAction = (action, student) => {
    setSelectedStudent(student);

    if (action === "Add" || action === "Edit") {
      setDialogOpen(true);
    } else if (action === "View") {
      alert(`Viewing marksheet for ${student.name}`);
    } else if (action === "Download") {
      alert(`Downloading marksheet for ${student.name}`);
    }
  };

  const handleSaveMarks = (newMarks) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === selectedStudent.id
          ? {
            ...s,
            marks: newMarks.reduce((acc, m) => {
              acc[m.subjectName] =
                Number(m.theory || 0) + Number(m.practical || 0);
              return acc;
            }, {}),
          }
          : s
      )
    );
  };

  // Build dynamic columns based on subjects
  const columns = useMemo(() => {
    const baseColumns = [
      { field: "roll", headerText: "Roll", width: 60, textAlign: "Center" },
      {
        field: "avatar",
        headerText: "Avatar",
        width: 60,
        allowSorting: false,
        template: (student) => (
          <Avatar>
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`}
            />
            <AvatarFallback>{student.name[0]}</AvatarFallback>
          </Avatar>
        ),
      },
      { field: "name", headerText: "Student", width: 150 },
    ];

    // Add dynamic subject columns
    const subjectColumns = allSubjects.map((subject) => ({
      field: subject,
      headerText: subject,
      width: 80,
      textAlign: "Center",
      template: (student) => (
        <span className="text-muted-foreground">
          {student.marks[subject] ?? "-"}
        </span>
      ),
    }));

    const gradeColumn = {
      field: "totalGrade",
      headerText: "Total Grade",
      width: 100,
      textAlign: "Center",
      template: (student) => (
        <span className="font-semibold">{student.totalGrade ?? "-"}</span>
      ),
    };

    return [...baseColumns, ...subjectColumns, gradeColumn];
  }, [allSubjects]);

  // Dynamic actions based on whether student has marks
  const getActionsForStudent = (student) => {
    if (Object.keys(student.marks).length > 0) {
      return [
        {
          label: "Edit Marks",
          icon: <Edit className="h-4 w-4" />,
          onClick: () => handleAction("Edit", student),
        },
        {
          label: "View Marksheet",
          icon: <View className="h-4 w-4" />,
          onClick: () => handleAction("View", student),
        },
        {
          label: "Download Marksheet",
          icon: <Download className="h-4 w-4" />,
          onClick: () => handleAction("Download", student),
        },
      ];
    } else {
      return [
        {
          label: "Assign Marks",
          icon: <PlusCircle className="h-4 w-4" />,
          onClick: () => handleAction("Add", student),
        },
      ];
    }
  };

  // We need to use a custom action config that changes per row
  const actionConfig = {
    mode: "dropdown",
    showOnHover: false,
    width: 60,
    actions: [
      {
        label: "Edit Marks",
        icon: <Edit className="h-4 w-4" />,
        onClick: (student) => handleAction("Edit", student),
        hidden: (student) => Object.keys(student.marks).length === 0,
      },
      {
        label: "View Marksheet",
        icon: <View className="h-4 w-4" />,
        onClick: (student) => handleAction("View", student),
        hidden: (student) => Object.keys(student.marks).length === 0,
      },
      {
        label: "Download Marksheet",
        icon: <Download className="h-4 w-4" />,
        onClick: (student) => handleAction("Download", student),
        hidden: (student) => Object.keys(student.marks).length === 0,
      },
      {
        label: "Assign Marks",
        icon: <PlusCircle className="h-4 w-4" />,
        onClick: (student) => handleAction("Add", student),
        hidden: (student) => Object.keys(student.marks).length > 0,
      },
    ],
  };

  return (
    <div className="space-y-6 max-w-8xl mx-auto">
      <PageHeader
        title="Marks Management"
        description="View, add, and edit student marks for each term."
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-sm">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name or roll"
            className="pl-10 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              {["9", "10"].map((c) => (
                <SelectItem key={c} value={c}>
                  Class {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sectionFilter} onValueChange={setSectionFilter}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Section" />
            </SelectTrigger>
            <SelectContent>
              {["A", "B", "C"].map((s) => (
                <SelectItem key={s} value={s}>
                  Section {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={examTerm} onValueChange={setExamTerm}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Exam Term" />
            </SelectTrigger>
            <SelectContent>
              {["1st", "2nd", "3rd", "Final"].map((t) => (
                <SelectItem key={t} value={t}>
                  {t} Term
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataGrid
        columns={columns}
        data={filtered}
        actionConfig={actionConfig}
        emptyMessage="No students found"
        keyField="id"
      />

      {selectedStudent && (
        <AddOrEditMarksDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          studentName={selectedStudent.name}
          studentRoll={selectedStudent.roll}
          subjects={classSubjects[classFilter].map((name, idx) => ({
            id: idx,
            name,
          }))}
          initialMarks={
            Object.keys(selectedStudent.marks).length > 0
              ? Object.entries(selectedStudent.marks).map(
                ([subjectName, full]) => ({
                  subjectId: subjectName,
                  subjectName,
                  theory: full,
                  practical: 0,
                })
              )
              : []
          }
          onSave={handleSaveMarks}
        />
      )}
    </div>
  );
};

export default MarksPage;
