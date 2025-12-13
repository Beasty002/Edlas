import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, PlusCircle, Edit, Trash2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import DataNotFound from "@/components/reusable/DataNotFound";
import {
  teacherAssignments as initialAssignments,
  subjectMaster,
  staffList,
  allClasses,
  allSections,
  getSubjectName,
  getTeacherName,
} from "@/data/staticData";

const TeacherAssignments = () => {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    subjectId: "",
    className: "",
    section: "",
    teacherId: "",
  });

  const activeTeachers = staffList.filter((s) => s.role === "Teacher" && s.status === "active");

  const filteredAssignments = assignments.filter((a) => {
    const subjectName = getSubjectName(a.subjectId || 1);
    const teacherName = getTeacherName(a.teacherId);
    const matchesSearch =
      subjectName.toLowerCase().includes(search.toLowerCase()) ||
      teacherName.toLowerCase().includes(search.toLowerCase());
    const matchesClass = classFilter === "all" || a.className === classFilter;
    return matchesSearch && matchesClass;
  });

  const groupedAssignments = filteredAssignments.reduce((acc, a) => {
    const key = `${a.className}-${a.subjectId}`;
    const subjectName = getSubjectName(a.subjectId || 1);
    if (!acc[key]) {
      acc[key] = { className: a.className, subjectId: a.subjectId, subjectName, sections: [] };
    }
    acc[key].sections.push({ ...a, teacherName: getTeacherName(a.teacherId) });
    return acc;
  }, {});

  const handleOpenDialog = (assignment = null) => {
    if (assignment) {
      setEditingAssignment(assignment);
      setFormData({
        subjectId: (assignment.subjectId || 1).toString(),
        className: assignment.className || "9",
        section: assignment.section,
        teacherId: assignment.teacherId.toString(),
      });
    } else {
      setEditingAssignment(null);
      setFormData({ subjectId: "", className: "", section: "", teacherId: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.subjectId || !formData.className || !formData.section || !formData.teacherId) return;

    const newAssignment = {
      subjectId: parseInt(formData.subjectId),
      className: formData.className,
      section: formData.section,
      teacherId: parseInt(formData.teacherId),
    };

    if (editingAssignment) {
      setAssignments((prev) =>
        prev.map((a) => (a.id === editingAssignment.id ? { ...a, ...newAssignment } : a))
      );
    } else {
      const newId = Math.max(...assignments.map((a) => a.id), 0) + 1;
      setAssignments((prev) => [...prev, { id: newId, ...newAssignment }]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Teacher Assignments"
        description="Assign teachers to subjects for each class and section"
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-sm">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by subject or teacher..."
            className="pl-10 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Class" />
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
          <Button
            onClick={() => handleOpenDialog()}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Assign Teacher
          </Button>
        </div>
      </div>

      <div className="rounded-md border w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-gray-800">
              <TableHead className="w-24">Class</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="w-24 text-center">Section</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead className="w-24 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          {filteredAssignments.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={5}>
                  <DataNotFound item="assignments" />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {Object.values(groupedAssignments).map((group) =>
                group.sections.map((assignment, idx) => (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      {idx === 0 && (
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          Class {group.className}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {idx === 0 ? group.subjectName : ""}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{assignment.section}</Badge>
                    </TableCell>
                    <TableCell>{assignment.teacherName}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(assignment)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(assignment.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          )}
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingAssignment ? "Edit Assignment" : "Assign Teacher to Subject"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Subject <span className="text-red-500">*</span></Label>
              <Select
                value={formData.subjectId}
                onValueChange={(v) => setFormData({ ...formData, subjectId: v })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjectMaster.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Class <span className="text-red-500">*</span></Label>
              <Select
                value={formData.className}
                onValueChange={(v) => setFormData({ ...formData, className: v })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {allClasses.map((c) => (
                    <SelectItem key={c} value={c}>
                      Class {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Section <span className="text-red-500">*</span></Label>
              <Select
                value={formData.section}
                onValueChange={(v) => setFormData({ ...formData, section: v })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {allSections.map((s) => (
                    <SelectItem key={s} value={s}>
                      Section {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Teacher <span className="text-red-500">*</span></Label>
              <Select
                value={formData.teacherId}
                onValueChange={(v) => setFormData({ ...formData, teacherId: v })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {activeTeachers.map((t) => (
                    <SelectItem key={t.id} value={t.id.toString()}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingAssignment ? "Save Changes" : "Assign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherAssignments;
