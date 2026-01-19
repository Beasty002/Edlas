import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash2, PlusCircle, Search } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { DataGrid } from "@/components/reusable/DataGrid";
import { toast } from "sonner";
import { useSubjectMaster } from "@/hooks/useSubjectMaster";
import { getSortConfig, useDebounce } from "@/utils/helper";

const SubjectMaster = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [ordering, setOrdering] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const { subjects, isLoading, createSubject, updateSubject, isCreating, isUpdating } = useSubjectMaster({
    search: debouncedSearch,
    ordering
  });

  const sortConfig = getSortConfig(ordering);

  const handleSort = (newOrdering) => {
    setOrdering(newOrdering);
  };

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
      is_active: true,
    };

    if (editingSubject) {
      updateSubject(
        { id: editingSubject.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Subject updated");
            setIsDialogOpen(false);
          },
          onError: () => {
            toast.error("Failed to update subject");
          },
        }
      );
    } else {
      createSubject(payload, {
        onSuccess: () => {
          toast.success("Subject created");
          setIsDialogOpen(false);
        },
        onError: () => {
          toast.error("Failed to create subject");
        },
      });
    }
  };

  const handleDelete = (subject) => {
    toast.info("Delete functionality not yet implemented");
  };

  const columns = [
    {
      field: "id",
      headerText: "ID",
      width: 60,
      template: (subject) => <span className="text-muted-foreground">#{subject.id}</span>,
    },
    { field: "name", headerText: "Subject Name", width: 180 },
    {
      field: "description",
      headerText: "Description",
      template: (subject) => (
        <span className="text-muted-foreground">{subject.description}</span>
      ),
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

      <DataGrid
        columns={columns}
        data={subjects}
        isLoading={isLoading}
        actionConfig={actionConfig}
        emptyMessage="No subjects found"
        keyField="id"
        sortConfig={sortConfig}
        onSort={handleSort}
      />

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
            <Button onClick={handleSave} disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? "Saving..." : editingSubject ? "Save Changes" : "Add Subject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubjectMaster;
