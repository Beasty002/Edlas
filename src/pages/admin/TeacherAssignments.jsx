import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, PlusCircle, Edit, Trash2, Loader2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import DataNotFound from "@/components/reusable/DataNotFound";
import { TableSkeleton } from "@/components/reusable/TableSkeleton";
import { toast } from "sonner";
import {
  useTeacherAssignments,
  useClassSubjects,
  useClassSections,
  useActiveTeachers,
  useAssignTeacher,
} from "@/api/hooks";

const TeacherAssignments = () => {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    classSubjectId: "",
    sectionId: "",
    teacherId: "",
  });

  // Fetch data from APIs
  const { data: assignmentsData, isLoading, error } = useTeacherAssignments();
  const { data: classSubjectsData, isLoading: isLoadingClassSubjects } = useClassSubjects();
  const { data: sectionsData, isLoading: isLoadingSections } = useClassSections();
  const { data: teachersData, isLoading: isLoadingTeachers } = useActiveTeachers();
  const assignTeacher = useAssignTeacher();

  const assignments = assignmentsData?.assignments || [];
  const classSubjects = classSubjectsData?.class_subjects || {};
  const sections = sectionsData?.results || [];
  const activeTeachers = teachersData?.teachers || [];

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to fetch assignments");
    }
  }, [error]);

  // Flatten class subjects for dropdown
  const flattenedClassSubjects = Object.entries(classSubjects).flatMap(([className, subjects]) =>
    subjects.map((subject) => ({
      ...subject,
      className,
      displayName: `${className} - ${subject.subject_name}`,
    }))
  );

  // Get unique class names for filter
  const availableClasses = [...new Set(Object.keys(classSubjects))].sort();

  const filteredAssignments = assignments.filter((a) => {
    const matchesSearch =
      a.subject_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.teacher_name?.toLowerCase().includes(search.toLowerCase());
    const matchesClass = classFilter === "all" || a.class_name === classFilter;
    return matchesSearch && matchesClass;
  });

  // Group assignments by class and subject
  const groupedAssignments = filteredAssignments.reduce((acc, a) => {
    const key = `${a.class_name}-${a.subject_id}`;
    if (!acc[key]) {
      acc[key] = { className: a.class_name, subjectId: a.subject_id, subjectName: a.subject_name, sections: [] };
    }
    acc[key].sections.push(a);
    return acc;
  }, {});

  const handleOpenDialog = (assignment = null) => {
    if (assignment) {
      setEditingAssignment(assignment);
      // Find the class subject that matches
      const classSubject = flattenedClassSubjects.find(
        cs => cs.subject_name === assignment.subject_name && cs.className === assignment.class_name
      );
      const section = sections.find(s => s.name === assignment.section_name);
      setFormData({
        classSubjectId: classSubject?.id?.toString() || "",
        sectionId: section?.id?.toString() || "",
        teacherId: assignment.teacher_id?.toString() || "",
      });
    } else {
      setEditingAssignment(null);
      setFormData({ classSubjectId: "", sectionId: "", teacherId: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.classSubjectId || !formData.sectionId || !formData.teacherId) {
      toast.error("Please fill all required fields");
      return;
    }

    assignTeacher.mutate(
      {
        classSubjectId: parseInt(formData.classSubjectId),
        assignmentData: {
          section_id: parseInt(formData.sectionId),
          teacher_id: parseInt(formData.teacherId),
        },
      },
      {
        onSuccess: () => {
          toast.success(editingAssignment ? "Assignment updated" : "Teacher assigned");
          setIsDialogOpen(false);
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  // Get sections for selected class subject
  const getFilteredSections = () => {
    if (!formData.classSubjectId) return [];
    const selectedClassSubject = flattenedClassSubjects.find(
      cs => cs.id?.toString() === formData.classSubjectId
    );
    if (!selectedClassSubject) return [];
    // Filter sections by classroom
    return sections.filter(s => s.classroom_name === selectedClassSubject.className);
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
            placeholder="Search by subject or teacher..."
            className="pl-10 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {availableClasses.map((c) => (
                <SelectItem key={c} value={c}>
                  Class {c}
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

      {isLoading ? (
        <TableSkeleton rows={6} columns={5} />
      ) : (
        <div className="rounded-md border w-full">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 dark:bg-gray-800">
                <TableHead className="w-24">Class</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="w-24 text-center">Section</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead className="w-24 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            {filteredAssignments.length === 0 ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5}>
                    <DataNotFound item="assignments" />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {Object.values(groupedAssignments).map((group) =>
                  group.sections.map((assignment, idx) => (
                    <TableRow key={assignment.id}>
                      <TableCell>
                        {idx === 0 && (
                          <Badge variant="outline" className="bg-primary/10 text-primary">
                            Class {group.className}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {idx === 0 ? group.subjectName : ""}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{assignment.section_name}</Badge>
                      </TableCell>
                      <TableCell>{assignment.teacher_name}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(assignment)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            )}
          </Table>
        </div>
      )}

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
                onValueChange={(v) => setFormData({ ...formData, classSubjectId: v, sectionId: "" })}
                disabled={!!editingAssignment}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select class subject" />
                </SelectTrigger>
                <SelectContent>
                  {flattenedClassSubjects.map((cs) => (
                    <SelectItem key={cs.id} value={cs.id.toString()}>
                      Class {cs.className} - {cs.subject_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Section <span className="text-red-500">*</span></Label>
              <Select
                value={formData.sectionId}
                onValueChange={(v) => setFormData({ ...formData, sectionId: v })}
                disabled={!formData.classSubjectId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {getFilteredSections().map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      Section {s.name}
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
                      {t.name}
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
            <Button onClick={handleSave} disabled={assignTeacher.isPending}>
              {assignTeacher.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingAssignment ? "Save Changes" : "Assign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherAssignments;
