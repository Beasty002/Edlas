import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation } from "@tanstack/react-query";
import { baseRequest } from "@/api/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const fetchTeachers = async () => {
  const res = await baseRequest({
    url: "/system/staff/?role=Teacher&is_active=true",
    method: "GET",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch teachers");
  }
  return res.data;
};

const AssignTeacherModal = ({
  cls,
  open,
  onOpenChange,
  onSave,
}) => {
  const [selectedTeacher, setSelectedTeacher] = useState("");

  const { data: teachersData, isLoading: isLoadingTeachers } = useQuery({
    queryKey: ["teachers", "active"],
    queryFn: fetchTeachers,
    enabled: open,
  });

  const teachers = teachersData?.results || [];

  useEffect(() => {
    if (open && cls) {
      setSelectedTeacher(cls.teacher || "");
    }
  }, [open, cls]);

  const assignTeacherMutation = useMutation({
    mutationFn: async ({ classId, teacherId }) => {
      const res = await baseRequest({
        url: `/academics/class-sections/${classId}/teacher`,
        method: "PATCH",
        body: { teacher_id: teacherId },
      });
      if (!res.ok) {
        throw new Error("Failed to assign teacher");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Teacher assigned successfully");
      onSave();
    },
    onError: () => {
      toast.error("Failed to assign teacher");
    },
  });

  const handleSave = () => {
    if (!selectedTeacher) return;
    console.log(cls);
    assignTeacherMutation.mutate({
      classId: cls.id,
      teacherId: selectedTeacher,
    });
  };

  if (!cls) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md space-y-4">
        <DialogHeader>
          <DialogTitle>
            {cls.teacher ? "Reassign Teacher" : "Assign Teacher"} - Class{" "}
            {cls.classroom_name} ({cls.name})
          </DialogTitle>
          <DialogDescription>
            Select a teacher to {cls.teacher ? "reassign" : "assign"} for this
            class section.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label>Teacher</Label>
          {isLoadingTeachers ? (
            <div className="flex items-center gap-2 py-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading teachers...</span>
            </div>
          ) : (
            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((t) => (
                  <SelectItem key={t.id} value={t.id.toString()}>
                    {t.first_name} {t.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!selectedTeacher || assignTeacherMutation.isPending}
          >
            {assignTeacherMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignTeacherModal;
