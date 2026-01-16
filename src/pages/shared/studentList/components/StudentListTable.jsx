import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import UpdateStudentForm from "./UpdateStudentForm";
import { DataGrid } from "@/components/reusable/DataGrid";
import { useNavigate } from "react-router-dom";
import { mockStudents } from "@/data/mockData";
import { View, Edit } from "lucide-react";
import { toast } from "sonner";

const StudentListTable = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState(mockStudents);
  const [editingStudent, setEditingStudent] = useState(null);

  const handleAction = (studentId, action) => {
    if (action === "view") {
      navigate(`/students/StudentDetail`);
    } else if (["active", "graduated", "transferred", "expelled"].includes(action)) {
      setStudents(prev =>
        prev.map(s => (s.id === studentId ? { ...s, status: action } : s))
      );
      toast.success("Status updated successfully");
    }
  };

  // DataGrid columns configuration
  const columns = [
    {
      field: "id",
      headerText: "ID",
      width: 60,
      template: (student) => <span>#{student.id}</span>,
    },
    {
      field: "avatar_url",
      headerText: "Avatar",
      width: 60,
      allowSorting: false,
      template: (student) => (
        <Avatar className="h-8 w-8">
          {student.avatar_url ? (
            <AvatarImage src={student.avatar_url} alt={student.full_name} />
          ) : (
            <AvatarFallback>
              {student.first_name?.[0] || "S"}
            </AvatarFallback>
          )}
        </Avatar>
      ),
    },
    { field: "full_name", headerText: "Name", width: 150 },
    {
      field: "roll_no",
      headerText: "Roll No",
      width: 80,
      template: (student) => student.roll_no || "-",
    },
    {
      field: "student_class",
      headerText: "Class",
      width: 100,
      template: (student) => `${student.student_class} ${student.section}`,
    },
    {
      field: "parent_contact",
      headerText: "Parent Contact",
      width: 130,
      template: (student) => student.parent_contact || "-",
    },
    {
      field: "email",
      headerText: "Email",
      width: 180,
      template: (student) => student.email || "-",
    },
    { field: "admission_date", headerText: "Admission Date", width: 120 },
    {
      field: "status",
      headerText: "Status",
      width: 100,
      template: (student) => {
        const statusColors = {
          active: "bg-green-100 text-green-800",
          graduated: "bg-blue-100 text-blue-800",
          transferred: "bg-yellow-100 text-yellow-800",
          expelled: "bg-gray-100 text-gray-800",
        };
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[student.status] || statusColors.active}`}>
            {student.status}
          </span>
        );
      },
    },
  ];

  // DataGrid actions configuration
  const actionConfig = {
    mode: "dropdown",
    showOnHover: false,
    width: 60,
    headerText: "",
    actions: [
      {
        label: "Edit",
        icon: <Edit className="h-4 w-4" />,
        onClick: (student) => setEditingStudent(student),
      },
      {
        label: "View Details",
        icon: <View className="h-4 w-4" />,
        onClick: (student) => handleAction(student.id, "view"),
      },
    ],
  };

  return (
    <>
      <DataGrid
        columns={columns}
        data={students}
        actionConfig={actionConfig}
        emptyMessage="No students found"
        keyField="id"
      />

      {editingStudent && (
        <UpdateStudentForm
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
        />
      )}
    </>
  );
};

export default StudentListTable;
