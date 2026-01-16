import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Eye, UserX, PlusCircle, Search } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { DataGrid } from "@/components/reusable/DataGrid";
import AddClassModal from "./components/AddClassModal";
import AssignTeacherModal from "./components/AssignTeacherModal";
import { mockClassSections, mockStaff } from "@/data/mockData";
import { toast } from "sonner";

const Classes = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [classes, setClasses] = useState(mockClassSections);

  const activeTeachers = mockStaff.filter(s => s.role === "Teacher" && s.status === "active");

  const handleAssignTeacher = (cls) => {
    setSelectedClass(cls);
    setIsTeacherModalOpen(true);
  };

  const handleAction = (action, cls) => {
    if (action === "toggle") {
      setClasses(prev =>
        prev.map(c =>
          c.id === cls.id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c
        )
      );
      toast.success("Status updated");
    }
  };

  const handleSaveNewClass = (newClass) => {
    const newId = Math.max(...classes.map(c => c.id)) + 1;
    setClasses(prev => [...prev, { ...newClass, id: newId }]);
    toast.success("Class created");
  };

  const handleSaveTeacher = (updatedClass) => {
    setClasses(prev =>
      prev.map(c =>
        c.id === updatedClass.id ? { ...c, class_teacher: updatedClass.teacher, class_teacher_id: updatedClass.teacherId } : c
      )
    );
    toast.success("Teacher assigned");
    setIsTeacherModalOpen(false);
  };

  // DataGrid columns configuration
  const columns = [
    {
      field: "classroom_name",
      headerText: "Class",
      width: 100,
      template: (cls) => (
        <Badge className="bg-primary/10 text-primary border-primary/20">
          Class {cls.classroom_name}
        </Badge>
      ),
    },
    { field: "section", headerText: "Section", width: 80 },
    {
      field: "class_teacher",
      headerText: "Class Teacher",
      width: 150,
      template: (cls) => cls.class_teacher || "--",
    },
    {
      field: "total_students",
      headerText: "Total Students",
      width: 120,
      textAlign: "Center",
      template: (cls) => cls.total_students || 0,
    },
    {
      field: "status",
      headerText: "Status",
      width: 100,
      textAlign: "Center",
      template: (cls) => (
        <Badge variant={cls.status === "active" ? "default" : "destructive"}>
          {cls.status === "active" ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

  // DataGrid actions configuration
  const actionConfig = {
    mode: "dropdown",
    showOnHover: false,
    width: 60,
    actions: [
      {
        label: "View",
        icon: <Eye className="h-4 w-4" />,
        onClick: (cls) => handleAction("View", cls),
      },
      {
        label: "Toggle Status",
        icon: <UserX className="h-4 w-4" />,
        onClick: (cls) => handleAction("toggle", cls),
      },
      {
        label: "Assign Teacher",
        icon: <PlusCircle className="h-4 w-4" />,
        onClick: handleAssignTeacher,
      },
    ],
  };

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Class Management"
        description="Manage classes, sections, and assign class teachers efficiently."
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-sm">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search classes..."
            className="pl-10 w-full"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <AddClassModal
              classesData={classes}
              onSave={handleSaveNewClass}
            />
          </Button>
        </div>
      </div>

      <DataGrid
        columns={columns}
        data={classes}
        actionConfig={actionConfig}
        emptyMessage="No classes found"
        keyField="id"
      />

      <AssignTeacherModal
        cls={selectedClass}
        open={isTeacherModalOpen}
        onOpenChange={setIsTeacherModalOpen}
        teachers={activeTeachers}
        onSave={handleSaveTeacher}
      />
    </div>
  );
};

export default Classes;
