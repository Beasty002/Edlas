import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import StudentDetailForm from "./StudentDetailForm";
import { baseRequest } from "@/api/api";
import { Loader2 } from "lucide-react";

const fetchStudentDetails = async (studentId) => {
  const res = await baseRequest({
    url: `/system/students/${studentId}/`,
    method: "GET",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch student details");
  }
  return res.data;
};

const UpdateStudentForm = ({ student, onClose }) => {
  const queryClient = useQueryClient();
  const { data: fullStudentData, isLoading, isError, error } = useQuery({
    queryKey: ["student", student?.id],
    queryFn: () => fetchStudentDetails(student.id),
    enabled: !!student?.id,
    staleTime: 0,
  });

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["student", student?.id] });
    onClose?.();
  };

  return (
    <Dialog open={!!student} onOpenChange={(open) => !open && onClose?.()}>
      <DialogContent className="!w-[95vw] h-[95vh] !max-w-[95vw] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 sticky top-0 z-10 pb-4 border-b">
          <DialogTitle>Edit Student</DialogTitle>
          <DialogDescription>
            Update details for {student?.first_name} {student?.last_name}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-auto custom-scrollbar p-4">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading student details...</span>
            </div>
          )}
          {isError && (
            <div className="flex items-center justify-center h-full text-red-500">
              Failed to load student details: {error?.message}
            </div>
          )}
          {fullStudentData && (
            <StudentDetailForm
              mode="edit"
              studentData={fullStudentData}
              onSuccess={handleSuccess}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStudentForm;
