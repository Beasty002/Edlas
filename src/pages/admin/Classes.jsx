import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Edit, Eye, UserX, PlusCircle } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import DataNotFound from "@/components/reusable/DataNotFound";
import TableActionButton from "@/components/reusable/TableActionButton";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/reusable/TableSkeleton";
import AddClassModal from "./components/AddClassModal";
import AssignTeacherModal from "./components/AssignTeacherModal";
import { useClassSections, useClassrooms, useUpdateClassSection, useCreateClassSection } from "@/api/hooks";
import { toast } from "sonner";

const Classes = () => {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [selectedClass, setSelectedClass] = useState(null);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);

  const { data: sectionsData, isLoading, error } = useClassSections({ page_size: 100 });
  const { data: classroomsData } = useClassrooms({ page_size: 100 });
  const updateSection = useUpdateClassSection();
  const createSection = useCreateClassSection();

  const classes = sectionsData?.results || [];
  const classrooms = classroomsData?.results || [];

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to fetch classes");
    }
  }, [error]);

  const handleAssignTeacher = (cls) => {
    setSelectedClass(cls);
    setIsTeacherModalOpen(true);
  };

  const allClasses = [...new Set(classrooms.map((c) => c.name))];
  const allSections = [...new Set(classes.map((c) => c.name))];

  const filtered = classes.filter((cls) => {
    const matchesSearch =
      cls.name?.toLowerCase().includes(search.toLowerCase()) ||
      cls.classroom_name?.toLowerCase().includes(search.toLowerCase());
    const matchesClass =
      classFilter === "all" || cls.classroom_name === classFilter;
    const matchesSection = sectionFilter === "all" || cls.name === sectionFilter;
    return matchesSearch && matchesClass && matchesSection;
  });

  const groupedClasses = filtered.reduce((acc, cls) => {
    const className = cls.classroom_name || "Unknown";
    if (!acc[className]) acc[className] = [];
    acc[className].push(cls);
    return acc;
  }, {});

  const handleAction = async (action, cls) => {
    if (action === "toggle") {
      updateSection.mutate(
        { id: cls.id, data: { is_active: !cls.is_active } },
        {
          onSuccess: () => toast.success("Status updated"),
          onError: (err) => toast.error(err.message),
        }
      );
    }
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
            placeholder="Search by class or section"
            className="pl-10 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-auto min-w-[150px]">
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {allClasses.map((c) => (
                <SelectItem key={c} value={c}>
                  Class {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sectionFilter} onValueChange={setSectionFilter}>
            <SelectTrigger className="w-auto min-w-[150px]">
              <SelectValue placeholder="Section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sections</SelectItem>
              {allSections.map((s) => (
                <SelectItem key={s} value={s}>
                  Section {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <AddClassModal
              classesData={classes}
              onSave={(newClass) => {
                createSection.mutate(newClass, {
                  onSuccess: () => toast.success("Class created"),
                  onError: (err) => toast.error(err.message),
                });
              }}
            />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} columns={6} />
      ) : (
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
              {filtered.length === 0 ? (
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
                      <TableCell className="text-left">{cls.name}</TableCell>
                      <TableCell>{cls.teacher || "--"}</TableCell>
                      <TableCell className="text-center">
                        {cls.total_students || 0}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={cls.is_active ? "default" : "destructive"}>
                          {cls.is_active ? "Active" : "Inactive"}
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
                              {cls.is_active ? "Set Inactive" : "Set Active"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAssignTeacher(cls)}>
                              {cls.teacher ? (
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
      )}

      <AssignTeacherModal
        cls={selectedClass}
        open={isTeacherModalOpen}
        onOpenChange={setIsTeacherModalOpen}
        teachers={[]}
        onSave={(updatedClass) => {
          updateSection.mutate(
            { id: updatedClass.id, data: { teacher: updatedClass.teacher } },
            {
              onSuccess: () => toast.success("Teacher assigned"),
              onError: (err) => toast.error(err.message),
            }
          );
        }}
      />
    </div>
  );
};

export default Classes;
