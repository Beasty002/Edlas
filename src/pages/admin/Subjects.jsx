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
import { PlusCircle, Edit, Trash2, Search } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import DataNotFound from "@/components/reusable/DataNotFound";
import { mockSubjects, mockClassrooms, mockClassSubjects } from "@/data/mockData";
import { toast } from "sonner";

const Subjects = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [selectedSubjectMaster, setSelectedSubjectMaster] = useState("");
  const [classSubjects, setClassSubjects] = useState(mockClassSubjects);
  const [formData, setFormData] = useState({
    code: "",
    full_marks: 100,
    pass_marks: 40,
    theory_marks: 70,
    practical_marks: 30,
    is_optional: false,
  });

  // Group by class for display
  const groupedByClassroom = classSubjects.reduce((acc, subject) => {
    const classroomName = subject.classroom_name || "Unknown";
    if (!acc[classroomName]) acc[classroomName] = [];
    acc[classroomName].push(subject);
    return acc;
  }, {});

  const handleOpenDialog = (subject = null) => {
    if (subject) {
      setEditingSubject(subject);
      setSelectedClassroom(subject.classroom_name || "");
      setSelectedSubjectMaster(subject.subject?.toString() || "");
      setFormData({
        code: subject.subject_code || "",
        full_marks: subject.full_marks || 100,
        pass_marks: subject.pass_marks || 40,
        theory_marks: subject.theory_marks || 70,
        practical_marks: subject.practical_marks || 30,
        is_optional: subject.is_optional || false,
      });
    } else {
      setEditingSubject(null);
      setSelectedClassroom(mockClassrooms[0]?.name || "");
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
    const selectedSubject = mockSubjects.find(s => s.id.toString() === subjectId);
    if (selectedSubject && selectedClassroom) {
      setFormData(prev => ({
        ...prev,
        code: `${selectedSubject.code}-${selectedClassroom}`
      }));
    }
  };

  const handleClassroomChange = (className) => {
    setSelectedClassroom(className);
    if (selectedSubjectMaster) {
      const selectedSubject = mockSubjects.find(s => s.id.toString() === selectedSubjectMaster);
      if (selectedSubject) {
        setFormData(prev => ({
          ...prev,
          code: `${selectedSubject.code}-${className}`
        }));
      }
    }
  };

  const handleSave = () => {
    if (!selectedSubjectMaster || !selectedClassroom) {
      toast.error("Please select both a subject and a class");
      return;
    }

    const selectedSubject = mockSubjects.find(s => s.id.toString() === selectedSubjectMaster);
    const classroomObj = mockClassrooms.find(c => c.name === selectedClassroom);

    if (editingSubject) {
      setClassSubjects(prev =>
        prev.map(s =>
          s.id === editingSubject.id
            ? {
              ...s,
              subject_code: formData.code,
              full_marks: parseInt(formData.full_marks),
              pass_marks: parseInt(formData.pass_marks),
              theory_marks: parseInt(formData.theory_marks),
              practical_marks: parseInt(formData.practical_marks),
              is_optional: formData.is_optional,
            }
            : s
        )
      );
      toast.success("Class subject updated");
    } else {
      const newId = Math.max(...classSubjects.map(s => s.id)) + 1;
      setClassSubjects(prev => [
        ...prev,
        {
          id: newId,
          classroom: classroomObj?.id || 1,
          classroom_name: selectedClassroom,
          subject: parseInt(selectedSubjectMaster),
          subject_name: selectedSubject?.name || "",
          subject_code: formData.code,
          full_marks: parseInt(formData.full_marks),
          pass_marks: parseInt(formData.pass_marks),
          theory_marks: parseInt(formData.theory_marks),
          practical_marks: parseInt(formData.practical_marks),
          is_optional: formData.is_optional,
        },
      ]);
      toast.success("Subject added to class");
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id) => {
    setClassSubjects(prev => prev.filter(s => s.id !== id));
    toast.success("Subject removed from class");
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
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {mockClassrooms.map((c) => (
                <SelectItem key={c.id} value={c.name}>Class {c.name}</SelectItem>
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
                    <TableCell className="font-mono text-sm">{subject.subject_code}</TableCell>
                    <TableCell className="text-center">{subject.full_marks}</TableCell>
                    <TableCell className="text-center">{subject.pass_marks}</TableCell>
                    <TableCell className="text-center">{subject.theory_marks}</TableCell>
                    <TableCell className="text-center">{subject.practical_marks}</TableCell>
                    <TableCell className="text-center">
                      {subject.is_optional ? "Yes" : "No"}
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
                    {mockClassrooms.map((c) => (
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
                    {mockSubjects.map((subject) => (
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
            <Button onClick={handleSave}>
              {editingSubject ? "Save Changes" : "Add Subject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Subjects;
