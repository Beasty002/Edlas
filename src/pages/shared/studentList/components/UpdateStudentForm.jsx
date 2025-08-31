import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import StudentDetailForm from "./StudentDetailForm";

const UpdateStudentForm = ({ student, triggerButton }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {triggerButton || (
          <div className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-sm w-full text-foreground">
            <Edit className="w-4 h-4 text-muted-foreground" />
            Edit
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="!w-[95vw] h-[95vh] !max-w-[95vw] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 sticky top-0 z-10 pb-4 border-b">
          <DialogTitle>Edit Student</DialogTitle>
          <DialogDescription>
            Update details for {student.firstName} {student.lastName}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-auto custom-scrollbar p-4">
          <StudentDetailForm mode="edit" defaultData={student} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStudentForm;
