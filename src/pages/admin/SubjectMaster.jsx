import { useState, useEffect } from "react";
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
import { Search, Edit, Trash2, PlusCircle, Loader2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import DataNotFound from "@/components/reusable/DataNotFound";
import { TableSkeleton } from "@/components/reusable/TableSkeleton";
import { useSubjects, useCreateSubject, useUpdateSubject, useDeleteSubject } from "@/api/hooks";
import { toast } from "sonner";

const SubjectMaster = () => {
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const { data: subjectsData, isLoading, error } = useSubjects();
  const createSubject = useCreateSubject();
  const updateSubject = useUpdateSubject();
  const deleteSubject = useDeleteSubject();

  const subjects = subjectsData?.subjects || [];

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to fetch subjects");
    }
  }, [error]);

  const filtered = subjects.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDialog = (subject = null) => {
    if (subject) {
      setEditingSubject(subject);
      setFormData({ name: subject.name, description: subject.description || "" });
    } else {
      setEditingSubject(null);
      setFormData({ name: "", description: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("Subject name is required");
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
    };

    if (editingSubject) {
      updateSubject.mutate(
        { id: editingSubject.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Subject updated");
            setIsDialogOpen(false);
          },
          onError: (err) => toast.error(err.message),
        }
      );
    } else {
      createSubject.mutate(payload, {
        onSuccess: () => {
          toast.success("Subject created");
          setIsDialogOpen(false);
        },
        onError: (err) => toast.error(err.message),
      });
    }
  };

  const handleDelete = (id) => {
    deleteSubject.mutate(id, {
      onSuccess: () => toast.success("Subject deleted"),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Subjects"
        description="Manage the master list of all subjects available in the school"
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
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Subject
        </Button>
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} columns={4} />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 dark:bg-gray-800">
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Subject Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-24 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            {filtered.length === 0 ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4}>
                    <DataNotFound item="subjects" />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {filtered.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell className="text-muted-foreground">
                      #{subject.id}
                    </TableCell>
                    <TableCell className="font-medium">{subject.name}</TableCell>
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
      )}

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
            <Button onClick={handleSave} disabled={createSubject.isPending || updateSubject.isPending}>
              {(createSubject.isPending || updateSubject.isPending) && (
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

export default SubjectMaster;
