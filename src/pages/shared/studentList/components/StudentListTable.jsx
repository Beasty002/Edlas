import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Edit, MoreVertical, View } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import UpdateStudentForm from "./UpdateStudentForm";
import TableActionButton from "@/components/reusable/TableActionButton";
import { useNavigate } from "react-router-dom";

const initialStudents = [
  {
    id: "#stu-1",
    name: "John Doe",
    rollNo: "12A",
    studentClass: "10",
    section: "A",
    parentContact: "9841XXXXXX",
    email: "john@example.com",
    admissionDate: "2021-04-12",
    status: "active",
    avatar: "",
  },
  {
    id: "#stu-2",
    name: "Jane Smith",
    rollNo: "7B",
    studentClass: "9",
    section: "B",
    parentContact: "9841YYYYYY",
    email: "jane@example.com",
    admissionDate: "2020-03-18",
    status: "graduated",
    avatar: "",
  },
];

const StudentListTable = () => {
  const [students, setStudents] = useState(initialStudents);

  const navigate = useNavigate();

  const handleAction = (studentId, action) => {
    if (action === "edit") console.log("Edit", studentId);
    else if (action === "view") navigate("/students/StudentDetail");
    else {
      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? { ...s, status: action } : s))
      );
      console.log("Status changed for", studentId, "to", action);
    }
  };

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
                <TableCell>{student.id}</TableCell>
                <TableCell>
                  <Avatar className="h-8 w-8">
                    {student.avatar ? (
                      <AvatarImage src={student.avatar} alt={student.name} />
                    ) : (
                      <AvatarFallback>{student.name[0]}</AvatarFallback>
                    )}
                  </Avatar>
                </TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.rollNo}</TableCell>
                <TableCell>
                  {student.studentClass}
                  {student.section}
                </TableCell>
                <TableCell>{student.parentContact}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.admissionDate}</TableCell>
                <TableCell>{student.status}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <TableActionButton />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      {/* <DropdownMenuItem
                        onClick={() => handleAction(student.id, "edit")}
                      >
                        <Edit /> Edit
                      </DropdownMenuItem> */}
                      <DropdownMenuItem asChild>
                        <UpdateStudentForm student={student} />
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAction(student.id, "view")}
                      >
                        <View /> View Details
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
