import { useEffect } from "react";
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
import DataNotFound from "@/components/reusable/DataNotFound";
import { TableSkeleton } from "@/components/reusable/TableSkeleton";
import { useNavigate } from "react-router-dom";
import { useStudents, useUpdateStudentStatus } from "@/api/hooks";
import { View } from "lucide-react";
import { toast } from "sonner";

const StudentListTable = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useStudents({ page: 1, page_size: 50 });
  const updateStatus = useUpdateStudentStatus();

  const students = data?.results || [];

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to fetch students");
    }
  }, [error]);

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
    return <TableSkeleton rows={8} columns={10} />;
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

        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="p-6">
                <DataNotFound item="students" />
              </TableCell>
            </TableRow>
          ) : (
            students.map((student) => (
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentListTable;
