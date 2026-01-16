import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Eye, UserX, PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageHeader from "@/components/PageHeader";
import DataNotFound from "@/components/reusable/DataNotFound";
import TableActionButton from "@/components/reusable/TableActionButton";
import { Badge } from "@/components/ui/badge";
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

  // Group by class for display
  const groupedClasses = classes.reduce((acc, cls) => {
    const className = cls.classroom_name || "Unknown";
    if (!acc[className]) acc[className] = [];
    acc[className].push(cls);
    return acc;
  }, {});

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

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-gray-800">
              <TableHead>Class</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Class Teacher</TableHead>
              <TableHead className="text-center">Total Students</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="w-16 text-center"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {classes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="p-6">
                  <DataNotFound item="classes" />
                </TableCell>
              </TableRow>
            ) : (
              Object.keys(groupedClasses).map((className) => {
                const classSections = groupedClasses[className];
                return classSections.map((cls, idx) => (
                  <TableRow key={cls.id} className="group">
                    <TableCell>
                      {idx === 0 && (
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          Class {cls.classroom_name}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-left">{cls.section}</TableCell>
                    <TableCell>{cls.class_teacher || "--"}</TableCell>
                    <TableCell className="text-center">
                      {cls.total_students || 0}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={cls.status === "active" ? "default" : "destructive"}>
                        {cls.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <TableActionButton />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleAction("View", cls)}>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction("toggle", cls)}>
                            <UserX className="mr-2 h-4 w-4" />
                            {cls.status === "active" ? "Set Inactive" : "Set Active"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAssignTeacher(cls)}>
                            {cls.class_teacher ? (
                              <>
                                <Edit className="mr-2 h-4 w-4" /> Reassign Teacher
                              </>
                            ) : (
                              <>
                                <PlusCircle className="mr-2 h-4 w-4" /> Assign Teacher
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ));
              })
            )}
          </TableBody>
        </Table>
      </div>

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
