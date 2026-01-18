import { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Search } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { DataGrid } from "@/components/reusable/DataGrid";
import { toast } from "sonner";
import { useClassrooms } from "@/context/ClassroomsContext";
import { useSubjectMaster } from "@/hooks/useSubjectMaster";
import { useClassSubjects } from "@/hooks/useClassSubjects";
import { useDebounce, getPaginationConfig } from "@/utils/helper";

const Subjects = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [selectedSubjectMaster, setSelectedSubjectMaster] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [classFilter, setClassFilter] = useState("all");
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20 });
  const [formData, setFormData] = useState({
    code: "",
    full_marks: 100,
    pass_marks: 40,
    theory_marks: 70,
    practical_marks: 30,
    is_optional: false,
  });

  const { classOptions } = useClassrooms();
  const { subjects } = useSubjectMaster();
  const {
    classSubjects,
    count,
    isLoading,
    createClassSubject,
    updateClassSubject,
    deleteClassSubject,
    isCreating,
    isUpdating
  } = useClassSubjects({ search: debouncedSearch, classFilter, pagination });

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
      setSelectedClassroom(classOptions[0]?.value || "");
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
    const selectedSubject = subjects.find(s => s.id.toString() === subjectId);
    if (selectedSubject && selectedClassroom) {
      setFormData(prev => ({
        ...prev,
        code: `${selectedSubject.name.substring(0, 3).toUpperCase()}-${selectedClassroom}`
      }));
    }
  };

  const handleClassroomChange = (className) => {
    setSelectedClassroom(className);
    if (selectedSubjectMaster) {
      const selectedSubject = subjects.find(s => s.id.toString() === selectedSubjectMaster);
      if (selectedSubject) {
        setFormData(prev => ({
          ...prev,
          code: `${selectedSubject.name.substring(0, 3).toUpperCase()}-${className}`
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
      class_name: selectedClassroom,
      subject_id: parseInt(selectedSubjectMaster),
      code: formData.code,
      full_marks: parseInt(formData.full_marks),
      pass_marks: parseInt(formData.pass_marks),
      theory_marks: parseInt(formData.theory_marks),
      practical_marks: parseInt(formData.practical_marks),
      is_optional: formData.is_optional,
    };

    if (editingSubject) {
      updateClassSubject(
        { id: editingSubject.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Class subject updated");
            setIsDialogOpen(false);
          },
          onError: () => {
            toast.error("Failed to update class subject");
          },
        }
      );
    } else {
      createClassSubject(payload, {
        onSuccess: () => {
          toast.success("Subject added to class");
          setIsDialogOpen(false);
        },
        onError: () => {
          toast.error("Failed to add subject to class");
        },
      });
    }
  };

  const handleDelete = (subject) => {
    deleteClassSubject(subject.id, {
      onSuccess: () => {
        toast.success("Subject removed from class");
      },
      onError: () => {
        toast.error("Failed to remove subject");
      },
    });
  };

  const columns = [
    {
      field: "class_name",
      headerText: "Class",
      width: 80,
      template: (subject) => (
        <Badge variant="outline" className="bg-primary/10 text-primary">
          Class {subject.class_name}
        </Badge>
      ),
    },
    { field: "subject_name", headerText: "Subject", width: 150 },
    {
      field: "code",
      headerText: "Code",
      width: 100,
      template: (subject) => (
        <span className="font-mono text-sm">{subject.code}</span>
      ),
    },
    { field: "full_marks", headerText: "Full", width: 70, textAlign: "Center" },
    { field: "pass_marks", headerText: "Pass", width: 70, textAlign: "Center" },
    { field: "theory", headerText: "Theory", width: 70, textAlign: "Center" },
    { field: "practical", headerText: "Practical", width: 80, textAlign: "Center" },
    {
      field: "optional",
      headerText: "Optional",
      width: 80,
      textAlign: "Center",
      type: "boolean",
    },
  ];

  const actionConfig = {
    mode: "icons",
    width: 100,
    actions: [
      {
        label: "Edit",
        icon: <Edit className="h-4 w-4" />,
        onClick: handleOpenDialog,
      },
      {
        label: "Delete",
        icon: <Trash2 className="h-4 w-4" />,
        variant: "destructive",
        onClick: handleDelete,
      },
    ],
  };

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
            placeholder="Search subjects..."
            className="pl-10 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classOptions.map((c) => (
                <SelectItem key={c.id} value={c.value}>{c.label}</SelectItem>
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

      <DataGrid
        columns={columns}
        data={classSubjects}
        isLoading={isLoading}
        actionConfig={actionConfig}
        emptyMessage="No class subjects found"
        keyField="id"
      />

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
                    {classOptions.map((c) => (
                      <SelectItem key={c.id} value={c.value}>
                        {c.label}
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
                    {subjects.map((subject) => (
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
            <Button onClick={handleSave} disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? "Saving..." : editingSubject ? "Save Changes" : "Add Subject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Subjects;
