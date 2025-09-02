import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Edit,
  PlusCircle,
  MoreVertical,
  Download,
  View,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import DataNotFound from "@/components/reusable/DataNotFound";
import TableActionButton from "@/components/reusable/TableActionButton";
import AddOrEditMarksDialog from "./AddOrEditMarksDialog";

const dummyStudents = [
  {
    id: "stu-1",
    roll: 1,
    name: "John Doe",
    class: "10",
    section: "A",
    marks: {
      Math: 78,
      English: 85,
      Science: 69,
    },
  },
  {
    id: "stu-2",
    roll: 2,
    name: "Jane Smith",
    class: "10",
    section: "A",
    marks: {},
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
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

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-gray-800">
              <TableHead className="w-20 text-center">Roll</TableHead>
              <TableHead>Avatar</TableHead>

              <TableHead>Student</TableHead>
              {classSubjects[classFilter]?.map((sub) => (
                <TableHead key={sub} className="text-center">
                  {sub}
                </TableHead>
              ))}
              <TableHead className="w-16 text-center"></TableHead>
            </TableRow>
          </TableHeader>
          {filtered.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={10} className="p-6 text-center">
                  <DataNotFound item="students" />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {filtered.map((student) => (
                <TableRow key={student.id} className="group">
                  <TableCell className="text-center">{student.roll}</TableCell>
                  <TableCell>
                    <Avatar>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`}
                      />
                      <AvatarFallback>{student.name[0]}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{student.name}</span>
                    </div>
                  </TableCell>
                  {classSubjects[classFilter]?.map((sub) => (
                    <TableCell
                      key={sub}
                      className="text-center text-muted-foreground"
                    >
                      {student.marks[sub] ?? "-"}
                    </TableCell>
                  ))}
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <TableActionButton />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {Object.keys(student.marks).length > 0 ? (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleAction("Edit", student)}
                            >
                              <Edit className="mr-2 h-4 w-4" /> Edit Marks
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction("View", student)}
                            >
                              <View className="mr-2 h-4 w-4" /> View Marksheet
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction("Download", student)}
                            >
                              <Download className="mr-2 h-4 w-4" /> Download
                              Marksheet
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleAction("Add", student)}
                          >
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Marks
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>
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
