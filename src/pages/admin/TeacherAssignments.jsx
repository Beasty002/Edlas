import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PlusCircle, Edit, Search } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { DataGrid } from "@/components/reusable/DataGrid";
import { toast } from "sonner";
import { mockTeacherAssignments } from "@/data/mockData";
import { useClassrooms } from "@/context/ClassroomsContext";
import { useClassSubjects } from "@/hooks/useClassSubjects";
import { baseRequest } from "@/api/api";
import { useDebounce, buildQueryParams } from "@/utils/helper";

const TeacherAssignments = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [assignments, setAssignments] = useState(mockTeacherAssignments);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [classFilter, setClassFilter] = useState("all");
  const [formData, setFormData] = useState({
    selectedClass: "",
    classSubjectId: "",
    section: "",
    teacherId: "",
  });
  const [teacherSearch, setTeacherSearch] = useState("");

  const { classOptions, getSectionsForClass } = useClassrooms();

  const { classSubjects, isLoading: isLoadingSubjects } = useClassSubjects({
    classFilter: formData.selectedClass,
    pagination: { page: 1, pageSize: 100 },
  });

  const queryParams = buildQueryParams({
    pagination: { page: 1, pageSize: 100 },
    search: "",
    ordering: "",
    filters: {
      role: "Teacher",
      status: "active",
    },
  });

  const { data: teachersData } = useQuery({
    queryKey: ["teachers", queryParams.toString()],
    queryFn: async () => {
      const res = await baseRequest({
        url: `/system/staff/?${queryParams.toString()}`,
        method: "GET",
      });
      return res.data;
    },
  });

  const teachers = teachersData?.results || [];

  const filteredTeachers = useMemo(() => {
    if (!teacherSearch) return teachers;
    return teachers.filter((t) =>
      t.name?.toLowerCase().includes(teacherSearch.toLowerCase())
    );
  }, [teachers, teacherSearch]);


  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const matchesSearch =
        !debouncedSearch ||
        a.teacher_name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        a.subject_name?.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesClass =
        classFilter === "all" || a.classroom_name === classFilter;
      return matchesSearch && matchesClass;
    });
  }, [assignments, debouncedSearch, classFilter]);

  const handleOpenDialog = (assignment = null) => {
    if (assignment) {
      setEditingAssignment(assignment);
      setFormData({
        selectedClass: assignment.classroom_name || "",
        classSubjectId: assignment.class_subject?.toString() || "",
        section: assignment.section || "",
        teacherId: assignment.teacher?.toString() || "",
      });
    } else {
      setEditingAssignment(null);
      setFormData({
        selectedClass: classOptions[0]?.value || "",
        classSubjectId: "",
        section: "",
        teacherId: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.classSubjectId || !formData.section || !formData.teacherId) {
      toast.error("Please fill all required fields");
      return;
    }

    const selectedTeacher = teachers.find((t) => t.id.toString() === formData.teacherId);
    const selectedClassSubject = classSubjects.find(
      (cs) => cs.id.toString() === formData.classSubjectId
    );

    if (editingAssignment) {
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === editingAssignment.id
            ? {
              ...a,
              section: formData.section,
              teacher: parseInt(formData.teacherId),
              teacher_name: selectedTeacher?.name || "",
            }
            : a
        )
      );
      toast.success("Assignment updated");
    } else {
      const newId = Math.max(...assignments.map((a) => a.id), 0) + 1;
      setAssignments((prev) => [
        ...prev,
        {
          id: newId,
          class_subject: parseInt(formData.classSubjectId),
          class_subject_code: selectedClassSubject?.code || "",
          subject_name: selectedClassSubject?.subject_name || "",
          classroom_name: formData.selectedClass,
          section: formData.section,
          teacher: parseInt(formData.teacherId),
          teacher_name: selectedTeacher?.name || "",
        },
      ]);
      toast.success("Teacher assigned");
    }
    setIsDialogOpen(false);
  };

  const handleClassChange = (value) => {
    setFormData({
      ...formData,
      selectedClass: value,
      classSubjectId: "",
      section: "",
    });
  };



  const sections = formData.selectedClass
    ? getSectionsForClass(formData.selectedClass)
    : [];

  const columns = [
    {
      field: "classroom_name",
      headerText: "Class",
      width: 80,
      template: (assignment) => (
        <Badge variant="outline" className="bg-primary/10 text-primary">
          Class {assignment.classroom_name}
        </Badge>
      ),
    },
    { field: "subject_name", headerText: "Subject", width: 150 },
    {
      field: "class_subject_code",
      headerText: "Code",
      width: 100,
      template: (assignment) => (
        <span className="font-mono text-sm">{assignment.class_subject_code}</span>
      ),
    },
    {
      field: "section",
      headerText: "Section",
      width: 80,
      textAlign: "Center",
      template: (assignment) => (
        <Badge variant="secondary">{assignment.section}</Badge>
      ),
    },
    {
      field: "teacher_name",
      headerText: "Teacher",
      width: 200,
    },
  ];

  const actionConfig = {
    mode: "icons",
    width: 60,
    actions: [
      {
        label: "Edit",
        icon: <Edit className="h-4 w-4" />,
        onClick: handleOpenDialog,
      },
    ],
  };

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Teacher Assignments"
        description="Assign teachers to subjects for each class and section"
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-sm">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by teacher or subject..."
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
              <SelectItem value="all">All Classes</SelectItem>
              {classOptions.map((cls) => (
                <SelectItem key={cls.id} value={cls.value}>
                  {cls.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={() => handleOpenDialog()}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Assign Teacher
          </Button>
        </div>
      </div>

      <DataGrid
        columns={columns}
        data={filteredAssignments}
        actionConfig={actionConfig}
        emptyMessage="No teacher assignments found"
        keyField="id"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {editingAssignment ? "Edit Assignment" : "Assign Teacher to Subject"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Class <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.selectedClass}
                  onValueChange={handleClassChange}
                  disabled={!!editingAssignment}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classOptions.map((c) => (
                      <SelectItem key={c.id} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Section <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.section}
                  onValueChange={(v) => setFormData({ ...formData, section: v })}
                  disabled={!formData.selectedClass}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Subject <span className="text-red-500">*</span></Label>
              <Select
                value={formData.classSubjectId}
                onValueChange={(v) => setFormData({ ...formData, classSubjectId: v })}
                disabled={!formData.selectedClass || !!editingAssignment}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={isLoadingSubjects ? "Loading..." : "Select subject"} />
                </SelectTrigger>
                <SelectContent>
                  {classSubjects.map((cs) => (
                    <SelectItem key={cs.id} value={cs.id.toString()}>
                      {cs.subject_name} {cs.code && `(${cs.code})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Teacher <span className="text-red-500">*</span></Label>
              <Select
                value={formData.teacherId}
                onValueChange={(v) => setFormData({ ...formData, teacherId: v })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2 sticky top-0 bg-background">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search teachers..."
                        value={teacherSearch}
                        onChange={(e) => setTeacherSearch(e.target.value)}
                        className="pl-8 h-8"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  {filteredTeachers.length === 0 ? (
                    <div className="p-3 text-sm text-muted-foreground text-center">
                      No teachers found
                    </div>
                  ) : (
                    filteredTeachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id.toString()}>
                        {teacher.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingAssignment ? "Save Changes" : "Assign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherAssignments;
