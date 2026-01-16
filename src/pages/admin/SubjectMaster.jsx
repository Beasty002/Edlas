import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash2, PlusCircle } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import DataNotFound from "@/components/reusable/DataNotFound";
import { mockSubjects } from "@/data/mockData";
import { toast } from "sonner";

const SubjectMaster = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({ name: "", code: "", description: "" });
  const [subjects, setSubjects] = useState(mockSubjects);

  const handleOpenDialog = (subject = null) => {
    if (subject) {
      setEditingSubject(subject);
      setFormData({ name: subject.name, code: subject.code || "", description: subject.description || "" });
    } else {
      setEditingSubject(null);
      setFormData({ name: "", code: "", description: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("Subject name is required");
      return;
    }

    if (editingSubject) {
      setSubjects(prev =>
        prev.map(s =>
          s.id === editingSubject.id ? { ...s, ...formData } : s
        )
      );
      toast.success("Subject updated");
    } else {
      const newId = Math.max(...subjects.map(s => s.id)) + 1;
      setSubjects(prev => [...prev, { id: newId, ...formData }]);
      toast.success("Subject created");
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    toast.success("Subject deleted");
  };

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Subjects"
        description="Manage the master list of all subjects available in the school"
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-sm">
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Subject
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-gray-800">
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Subject Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-24 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          {subjects.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={5}>
                  <DataNotFound item="subjects" />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell className="text-muted-foreground">
                    #{subject.id}
                  </TableCell>
                  <TableCell className="font-medium">{subject.name}</TableCell>
                  <TableCell>{subject.code}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {subject.description}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
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
              ))}
            </TableBody>
          )}
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingSubject ? "Edit Subject" : "Add New Subject"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Subject Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                className="w-full"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Mathematics"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="code">Subject Code</Label>
              <Input
                id="code"
                className="w-full"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="e.g., MATH"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of the subject"
              />
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

export default SubjectMaster;
