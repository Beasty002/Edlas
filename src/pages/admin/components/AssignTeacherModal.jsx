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

const AssignTeacherModal = ({
  cls,
  teachers = [],
  open,
  onOpenChange,
  onSave,
}) => {
  const [selectedTeacher, setSelectedTeacher] = useState("");

  useEffect(() => {
    if (open && cls) {
      console.log("the teacher is", cls.teacher);

      setSelectedTeacher(cls.teacher || "");
    }
  }, [open, cls]);

  const handleSave = () => {
    if (!selectedTeacher) return;
    onSave({ ...cls, teacher: selectedTeacher });
    onOpenChange(false);
  };

  if (!cls) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md space-y-4">
        <DialogHeader>
          <DialogTitle>
            {cls.teacher ? "Reassign Teacher" : "Assign Teacher"} - Class{" "}
            {cls.className} ({cls.section})
          </DialogTitle>
          <DialogDescription>
            Select a teacher to {cls.teacher ? "reassign" : "assign"} for this
            class section.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label>Teacher</Label>
          <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a teacher" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!selectedTeacher}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignTeacherModal;
