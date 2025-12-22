import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Edit, View } from "lucide-react";
import { Button } from "@/components/ui/button";
import UpdateStudentForm from "./UpdateStudentForm";
import { Navigate, useNavigate } from "react-router-dom";

const dummyStudents = [
  {
    id: "#stu-001",
    name: "John Doe",
    rollNo: "12",
    studentClass: "10",
    section: "A",
    dob: "2010-05-12",
    parentContact: "9841XXXXXX",
    email: "john@example.com",
    status: "active",
    avatar: "",
  },
  {
    id: "#stu-002",
    name: "Jane Smith",
    rollNo: "7",
    studentClass: "9",
    section: "B",
    dob: "2011-08-22",
    parentContact: "9841YYYYYY",
    email: "jane@example.com",
    status: "graduated",
    avatar: "",
  },
];

const StudentListView = () => {
  const [students] = useState(dummyStudents);
  const navigate = useNavigate();

  const handleAction = (studentId, action) => {
    console.log(`${action} clicked for ${studentId}`);
    navigate("/students/StudentDetail");
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {students.map((student) => (
        <Card
          key={student.id}
          className="flex flex-col items-center text-center rounded-md p-3 shadow-none transition-transform transform hover:scale-101 hover:shadow-sm gap-3"
        >
          <Avatar className="h-16 w-16 mb-2">
            {student.avatar ? (
              <AvatarImage src={student.avatar} alt={student.name} />
            ) : (
              <AvatarFallback>{student.name[0]}</AvatarFallback>
            )}
          </Avatar>

          <div className="flex items-center justify-center gap-2 mb-1">
            <CardTitle className="text-base font-semibold">
              {student.name}
            </CardTitle>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {student.id}
            </span>
          </div>

          <div className="flex items-center justify-center gap-4 mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Roll #{student.rollNo}</span>
            <span>
              Class {student.studentClass}
              {student.section}
            </span>
            <span>DOB: {student.dob}</span>
          </div>

          <CardContent className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <p>Parent: {student.parentContact}</p>
            <p>Email: {student.email}</p>
            <p>Status: {student.status}</p>
          </CardContent>

          <div className="flex gap-2 mt-3">
            <UpdateStudentForm
              student={student}
              triggerButton={
                <Button
                  variant="outline"
                  size="icon"
                  className="text-blue-500 border-blue-500 hover:bg-blue-100"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              }
            />
            <Button
              variant="outline"
              size="icon"
              className="text-green-500 border-green-500 hover:bg-green-100"
              onClick={() => handleAction(student.id, "view")}
            >
              <View className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StudentListView;
