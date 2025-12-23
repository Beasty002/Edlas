import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import UpdateStudentForm from "./UpdateStudentForm";
import TableActionButton from "@/components/reusable/TableActionButton";
import { useNavigate } from "react-router-dom";
import { useStudents, useUpdateStudentStatus } from "@/api/hooks";
import { View, Loader2 } from "lucide-react";
import { toast } from "sonner";

const StudentListTable = () => {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useStudents({ page: 1, page_size: 50 });
  const updateStatus = useUpdateStudentStatus();

  const students = data?.results || [];

  const handleAction = async (studentId, action) => {
    if (action === "view") {
      navigate(`/students/${studentId}`);
    } else if (["active", "graduated", "transferred", "expelled"].includes(action)) {
      updateStatus.mutate(
        { id: studentId, status: action },
        {
          onSuccess: () => toast.success("Status updated successfully"),
          onError: (err) => toast.error(err.message),
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-red-500">
        <p>{error.message}</p>
        <button 
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-sm border border-gray-200 dark:border-gray-700 shadow-sm">
      <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <TableHeader>
          <TableRow className="bg-gray-100 dark:bg-gray-800">
            <TableHead>ID</TableHead>
            <TableHead>Avatar</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Roll No</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Parent Contact</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Admission Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        {students.length === 0 ? (
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={10}
                className="p-6 text-center text-gray-500 dark:text-gray-400"
              >
                No students found
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id} className="group">
                <TableCell>#{student.id}</TableCell>
                <TableCell>
                  <Avatar className="h-8 w-8">
                    {student.avatar_url ? (
                      <AvatarImage src={student.avatar_url} alt={student.full_name} />
                    ) : (
                      <AvatarFallback>
                        {student.first_name?.[0] || "S"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </TableCell>
                <TableCell>{student.full_name}</TableCell>
                <TableCell>{student.roll_no || "-"}</TableCell>
                <TableCell>
                  {student.student_class} {student.section}
                </TableCell>
                <TableCell>{student.parent_contact || "-"}</TableCell>
                <TableCell>{student.email || "-"}</TableCell>
                <TableCell>{student.admission_date}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    student.status === "active" 
                      ? "bg-green-100 text-green-800" 
                      : student.status === "graduated"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {student.status}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <TableActionButton />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <UpdateStudentForm student={student} />
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAction(student.id, "view")}
                      >
                        <View className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </div>
  );
};

export default StudentListTable;
