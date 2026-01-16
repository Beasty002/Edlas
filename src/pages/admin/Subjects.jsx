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
import { useSubjects, useClassrooms, useClassSubjects, useCreateClassSubject, useUpdateClassSubject, useDeleteClassSubject } from "@/api/hooks";
import { toast } from "sonner";

const Subjects = () => {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [selectedSubjectMaster, setSelectedSubjectMaster] = useState("");
  const [formData, setFormData] = useState({
    code: "",
    full_marks: 100,
    pass_marks: 40,
    theory_marks: 70,
    practical_marks: 30,
    is_optional: false,
  });

  // Fetch Subject Master (available subjects catalog)
  const { data: subjectMasterData, isLoading: isLoadingSubjectMaster } = useSubjects({ page_size: 100 });
  // Fetch Classrooms
  const { data: classroomsData, isLoading: isLoadingClassrooms } = useClassrooms({ page_size: 100 });
  // Fetch Class Subjects (subjects assigned to classes)
  const { data: classSubjectsData, isLoading, error } = useClassSubjects();

  const createClassSubject = useCreateClassSubject();
  const updateClassSubject = useUpdateClassSubject();
  const deleteClassSubject = useDeleteClassSubject();

  // Subject Master catalog (for dropdown)
  const subjectMasterList = subjectMasterData?.subjects || [];
  const classrooms = classroomsData?.results || [];

  // Class subjects grouped by class
  const classSubjects = classSubjectsData?.class_subjects || {};

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to fetch class subjects");
    }
  }, [error]);

  // Flatten class subjects for display
  const flattenedSubjects = Object.entries(classSubjects).flatMap(([className, subjects]) =>
    subjects.map((subject) => ({
      ...subject,
      className,
    }))
  );

  const filteredSubjects = flattenedSubjects.filter((s) => {
    const matchesSearch =
      s.code?.toLowerCase().includes(search.toLowerCase()) ||
      s.subject_name?.toLowerCase().includes(search.toLowerCase());
    const matchesClass = classFilter === "all" || s.class_name === classFilter;
    return matchesSearch && matchesClass;
  });

  // Group by class for display
  const groupedByClassroom = filteredSubjects.reduce((acc, subject) => {
    const classroomName = subject.class_name || "Unknown";
    if (!acc[classroomName]) acc[classroomName] = [];
    acc[classroomName].push(subject);
    return acc;
  }, {});

  const handleOpenDialog = (subject = null) => {
    if (subject) {
      setEditingSubject(subject);
      setSelectedClassroom(subject.class_name || "");
      setSelectedSubjectMaster(subject.subject_id?.toString() || "");
      setFormData({
        code: subject.code || "",
        full_marks: subject.full_marks || 100,
        pass_marks: subject.pass_marks || 40,
        theory_marks: subject.theory || 70,
        practical_marks: subject.practical || 30,
        is_optional: subject.optional || false,
      });
    } else {
      setEditingSubject(null);
      setSelectedClassroom(classrooms[0]?.name || "");
      setSelectedSubjectMaster("");
      setFormData({
        code: "",
        full_marks: 100,
        pass_marks: 40,
        theory_marks: 70,
        practical_marks: 30,
        is_optional: false,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubjectMasterChange = (subjectId) => {
    setSelectedSubjectMaster(subjectId);
    // Auto-generate code based on selected subject and class
    const selectedSubject = subjectMasterList.find(s => s.id.toString() === subjectId);
    if (selectedSubject && selectedClassroom) {
      const subjectCode = selectedSubject.name.substring(0, 3).toUpperCase();
      setFormData(prev => ({
        ...prev,
        code: `${subjectCode}-${selectedClassroom}`
      }));
    }
  };

  const handleClassroomChange = (className) => {
    setSelectedClassroom(className);
    // Update code if subject is already selected
    if (selectedSubjectMaster) {
      const selectedSubject = subjectMasterList.find(s => s.id.toString() === selectedSubjectMaster);
      if (selectedSubject) {
        const subjectCode = selectedSubject.name.substring(0, 3).toUpperCase();
        setFormData(prev => ({
          ...prev,
          code: `${subjectCode}-${className}`
        }));
      }
    }
  };

  const handleSave = () => {
    if (!selectedSubjectMaster || !selectedClassroom) {
      toast.error("Please select both a subject and a class");
      return;
    }

    const payload = {
      subject_id: parseInt(selectedSubjectMaster),
      class_name: selectedClassroom,
      code: formData.code,
      full_marks: parseInt(formData.full_marks),
      pass_marks: parseInt(formData.pass_marks),
      theory_marks: parseInt(formData.theory_marks),
      practical_marks: parseInt(formData.practical_marks),
      is_optional: formData.is_optional,
    };

    if (editingSubject) {
      updateClassSubject.mutate(
        { id: editingSubject.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Class subject updated");
            setIsDialogOpen(false);
          },
          onError: (err) => toast.error(err.message),
        }
      );
    } else {
      createClassSubject.mutate(payload, {
        onSuccess: () => {
          toast.success("Subject added to class");
          setIsDialogOpen(false);
        },
        onError: (err) => toast.error(err.message),
      });
    }
  };

  const handleDelete = (id) => {
    deleteClassSubject.mutate(id, {
      onSuccess: () => toast.success("Subject removed from class"),
      onError: (err) => toast.error(err.message),
    });
  };

  // Get unique class names for filter dropdown
  const availableClasses = [...new Set(Object.keys(classSubjects))].sort();

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Class Courses"
        description="Manage subjects assigned to each class with marking schemes"
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-sm">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by subject name or code..."
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
              {availableClasses.map((className) => (
                <SelectItem key={className} value={className}>
                  Class {className}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => handleOpenDialog()}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Subject
          </Button>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} columns={8} />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 dark:bg-gray-800">
                <TableHead className="w-20">Class</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="w-28">Code</TableHead>
                <TableHead className="w-20 text-center">Full</TableHead>
                <TableHead className="w-20 text-center">Pass</TableHead>
                <TableHead className="w-20 text-center">Theory</TableHead>
                <TableHead className="w-20 text-center">Practical</TableHead>
                <TableHead className="w-20 text-center">Optional</TableHead>
                <TableHead className="w-24 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(groupedByClassroom).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9}>
                    <DataNotFound item="subjects" />
                  </TableCell>
                </TableRow>
              ) : (
                Object.entries(groupedByClassroom).map(([cls, subjectsList]) =>
                  subjectsList.map((subject, index) => (
                    <TableRow key={subject.id}>
                      <TableCell>
                        {index === 0 && (
                          <Badge variant="outline" className="bg-primary/10 text-primary">
                            Class {cls}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{subject.subject_name}</TableCell>
                      <TableCell className="font-mono text-sm">{subject.code}</TableCell>
                      <TableCell className="text-center">{subject.full_marks}</TableCell>
                      <TableCell className="text-center">{subject.pass_marks}</TableCell>
                      <TableCell className="text-center">{subject.theory}</TableCell>
                      <TableCell className="text-center">{subject.practical}</TableCell>
                      <TableCell className="text-center">
                        {subject.optional ? "Yes" : "No"}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(subject)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(subject.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingSubject ? "Edit Class Subject" : "Add Subject to Class"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Class <span className="text-red-500">*</span></Label>
                <Select
                  value={selectedClassroom}
                  onValueChange={handleClassroomChange}
                  disabled={!!editingSubject}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classrooms.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        Class {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Subject <span className="text-red-500">*</span></Label>
                <Select
                  value={selectedSubjectMaster}
                  onValueChange={handleSubjectMasterChange}
                  disabled={!!editingSubject}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectMasterList.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Subject Code</Label>
              <Input
                className="w-full"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g., MATH-10"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Full Marks</Label>
                <Input
                  type="number"
                  value={formData.full_marks}
                  onChange={(e) => setFormData({ ...formData, full_marks: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Pass Marks</Label>
                <Input
                  type="number"
                  value={formData.pass_marks}
                  onChange={(e) => setFormData({ ...formData, pass_marks: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Theory Marks</Label>
                <Input
                  type="number"
                  value={formData.theory_marks}
                  onChange={(e) => setFormData({ ...formData, theory_marks: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Practical Marks</Label>
                <Input
                  type="number"
                  value={formData.practical_marks}
                  onChange={(e) => setFormData({ ...formData, practical_marks: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="optional"
                checked={formData.is_optional}
                onChange={(e) => setFormData({ ...formData, is_optional: e.target.checked })}
              />
              <Label htmlFor="optional">Optional Subject</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={createClassSubject.isPending || updateClassSubject.isPending}>
              {(createClassSubject.isPending || updateClassSubject.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingSubject ? "Save Changes" : "Add Subject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Subjects;
