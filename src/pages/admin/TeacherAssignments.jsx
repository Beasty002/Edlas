import { useState } from "react";
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
import {
  mockTeacherAssignments,
  mockClassSubjects,
  mockClassSections,
  mockStaff,
} from "@/data/mockData";
import { useClassrooms } from "@/context/ClassroomsContext";

const TeacherAssignments = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [assignments, setAssignments] = useState(mockTeacherAssignments);
  const [formData, setFormData] = useState({
    classSubjectId: "",
    section: "",
    teacherId: "",
  });

  const activeTeachers = mockStaff.filter(s => s.role === "Teacher" && s.status === "active");
  const { classOptions, getSectionsForClass } = useClassrooms();

  const handleOpenDialog = (assignment = null) => {
    if (assignment) {
      setEditingAssignment(assignment);
      setFormData({
        classSubjectId: assignment.class_subject?.toString() || "",
        section: assignment.section || "",
        teacherId: assignment.teacher?.toString() || "",
      });
    } else {
      setEditingAssignment(null);
      setFormData({ classSubjectId: "", section: "", teacherId: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.classSubjectId || !formData.section || !formData.teacherId) {
      toast.error("Please fill all required fields");
      return;
    }

    const selectedTeacher = activeTeachers.find(t => t.id.toString() === formData.teacherId);
    const selectedClassSubject = mockClassSubjects.find(cs => cs.id.toString() === formData.classSubjectId);

    if (editingAssignment) {
      setAssignments(prev =>
        prev.map(a =>
          a.id === editingAssignment.id
            ? {
              ...a,
              section: formData.section,
              teacher: parseInt(formData.teacherId),
              teacher_name: selectedTeacher?.full_name || "",
            }
            : a
        )
      );
      toast.success("Assignment updated");
    } else {
      const newId = Math.max(...assignments.map(a => a.id)) + 1;
      setAssignments(prev => [
        ...prev,
        {
          id: newId,
          class_subject: parseInt(formData.classSubjectId),
          class_subject_code: selectedClassSubject?.subject_code || "",
          classroom_name: selectedClassSubject?.classroom_name || "",
          section: formData.section,
          teacher: parseInt(formData.teacherId),
          teacher_name: selectedTeacher?.full_name || "",
        },
      ]);
      toast.success("Teacher assigned");
    }
    setIsDialogOpen(false);
  };

  const getFilteredSections = () => {
    if (!formData.classSubjectId) return [];
    const selectedClassSubject = mockClassSubjects.find(
      cs => cs.id?.toString() === formData.classSubjectId
    );
    if (!selectedClassSubject) return [];
    return getSectionsForClass(selectedClassSubject.classroom_name);
  };

  // DataGrid columns configuration
  const columns = [
    {
      field: "classroom_name",
      headerText: "Class",
      width: 100,
      template: (assignment) => (
        <Badge variant="outline" className="bg-primary/10 text-primary">
          Class {assignment.classroom_name}
        </Badge>
      ),
    },
    { field: "class_subject_code", headerText: "Subject Code", width: 120 },
    {
      field: "section",
      headerText: "Section",
      width: 80,
      textAlign: "Center",
      template: (assignment) => (
        <Badge variant="secondary">{assignment.section}</Badge>
      ),
    },
    { field: "teacher_name", headerText: "Teacher", width: 180 },
  ];

  // DataGrid actions configuration (icon mode)
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
            placeholder="Search assignments..."
            className="pl-10 w-full"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {[...new Set(mockClassSubjects.map(cs => cs.classroom_name))].map((cls) => (
                <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Teacher" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teachers</SelectItem>
              {activeTeachers.map((t) => (
                <SelectItem key={t.id} value={t.id.toString()}>{t.full_name}</SelectItem>
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
        data={assignments}
        actionConfig={actionConfig}
        emptyMessage="No teacher assignments found"
        keyField="id"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingAssignment ? "Edit Assignment" : "Assign Teacher to Subject"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Class Subject <span className="text-red-500">*</span></Label>
              <Select
                value={formData.classSubjectId}
                onValueChange={(v) => setFormData({ ...formData, classSubjectId: v, section: "" })}
                disabled={!!editingAssignment}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select class subject" />
                </SelectTrigger>
                <SelectContent>
                  {mockClassSubjects.map((cs) => (
                    <SelectItem key={cs.id} value={cs.id.toString()}>
                      Class {cs.classroom_name} - {cs.subject_name}
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
                disabled={!formData.classSubjectId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {getFilteredSections().map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      Section {s.label}
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
                  {activeTeachers.map((t) => (
                    <SelectItem key={t.id} value={t.id.toString()}>
                      {t.full_name}
                    </SelectItem>
                  ))}
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
