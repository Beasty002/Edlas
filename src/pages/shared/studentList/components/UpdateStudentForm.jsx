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
import { useState } from "react";

const UpdateStudentForm = ({ student, triggerButton }) => {
  const [open, setOpen] = useState(false);

  const mappedStudent = {
    ...student,
    admission_number: student.admission_number,
    first_name: student.first_name,
    middle_name: student.middle_name,
    last_name: student.last_name,
    dob: student.dob,
    gender: student.gender,
    roll_no: student.roll_no,
    student_class: student.student_class,
    section: student.section,
    admission_date: student.admission_date,
    father_name: student.father_name,
    father_phone: student.father_phone,
    mother_name: student.mother_name,
    mother_phone: student.mother_phone,
    guardian_name: student.guardian_name,
    guardian_relation: student.guardian_relation,
    guardian_phone: student.guardian_phone,
    address: student.address,
    notes: student.notes,
    previous_school: student.previous_school,
    avatar_url: student.avatar_url,
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            Update details for {student.first_name} {student.last_name}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-auto custom-scrollbar p-4">
          <StudentDetailForm 
            mode="edit" 
            studentData={mappedStudent} 
            onSuccess={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStudentForm;
