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
  classSubjects as initialClassSubjects,
  subjectMaster,
  allClasses,
  getSubjectName,
} from "@/data/staticData";

const Subjects = () => {
  const [classSubjects, setClassSubjects] = useState(initialClassSubjects);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [formData, setFormData] = useState({
    subjectId: "",
    code: "",
    fullMarks: 100,
    passMarks: 40,
    theory: 70,
    practical: 30,
    optional: false,
  });

  const filteredSubjects = Object.entries(classSubjects).reduce(
    (acc, [cls, subs]) => {
      const filtered = subs.filter((s) => {
        const subjectName = getSubjectName(s.subjectId);
        return (
          subjectName.toLowerCase().includes(search.toLowerCase()) ||
          s.code.toLowerCase().includes(search.toLowerCase())
        );
      });
      if (filtered.length > 0 && (classFilter === "all" || classFilter === cls)) {
        acc[cls] = filtered;
      }
      return acc;
    },
    {}
  );

  const handleOpenDialog = (cls = null, subject = null) => {
    if (subject) {
      setEditingSubject({ ...subject, class: cls });
      setSelectedClass(cls);
      setFormData({
        subjectId: subject.subjectId.toString(),
        code: subject.code,
        fullMarks: subject.fullMarks,
        passMarks: subject.passMarks,
        theory: subject.theory,
        practical: subject.practical,
        optional: subject.optional,
      });
    } else {
      setEditingSubject(null);
      setSelectedClass(cls || "9");
      setFormData({
        subjectId: "",
        code: "",
        fullMarks: 100,
        passMarks: 40,
        theory: 70,
        practical: 30,
        optional: false,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.subjectId || !formData.code || !selectedClass) return;

    const newSubject = {
      subjectId: parseInt(formData.subjectId),
      code: formData.code,
      fullMarks: parseInt(formData.fullMarks),
      passMarks: parseInt(formData.passMarks),
      theory: parseInt(formData.theory),
      practical: parseInt(formData.practical),
      optional: formData.optional,
    };

    if (editingSubject) {
      setClassSubjects((prev) => ({
        ...prev,
        [selectedClass]: prev[selectedClass].map((s) =>
          s.id === editingSubject.id ? { ...s, ...newSubject } : s
        ),
      }));
    } else {
      const allIds = Object.values(classSubjects).flat().map((s) => s.id);
      const newId = Math.max(...allIds, 0) + 1;
      setClassSubjects((prev) => ({
        ...prev,
        [selectedClass]: [...(prev[selectedClass] || []), { id: newId, ...newSubject }],
      }));
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (cls, id) => {
    setClassSubjects((prev) => ({
      ...prev,
      [cls]: prev[cls].filter((s) => s.id !== id),
    }));
  };

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Class Courses"
        description="Manage subjects assigned to each class with marking schemes"
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-sm">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by subject or code..."
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
            Add Subject
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-gray-800">
              <TableHead className="w-20">Class</TableHead>
              <TableHead className="w-28">Code</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="w-20 text-center">Full</TableHead>
              <TableHead className="w-20 text-center">Pass</TableHead>
              <TableHead className="w-20 text-center">Theory</TableHead>
              <TableHead className="w-20 text-center">Practical</TableHead>
              <TableHead className="w-20 text-center">Optional</TableHead>
              <TableHead className="w-24 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          {Object.entries(filteredSubjects).length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={9}>
                  <DataNotFound item="subjects" />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {Object.entries(filteredSubjects).map(([cls, subjects]) =>
                subjects.map((subject, index) => (
                  <TableRow key={subject.id}>
                    <TableCell>
                      {index === 0 && (
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          Class {cls}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{subject.code}</TableCell>
                    <TableCell className="font-medium">
                      {getSubjectName(subject.subjectId)}
                    </TableCell>
                    <TableCell className="text-center">{subject.fullMarks}</TableCell>
                    <TableCell className="text-center">{subject.passMarks}</TableCell>
                    <TableCell className="text-center">{subject.theory}</TableCell>
                    <TableCell className="text-center">{subject.practical}</TableCell>
                    <TableCell className="text-center">
                      {subject.optional ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(cls, subject)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(cls, subject.id)}
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
              {editingSubject ? "Edit Class Subject" : "Add Subject to Class"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Class <span className="text-red-500">*</span></Label>
                <Select
                  value={selectedClass}
                  onValueChange={setSelectedClass}
                  disabled={!!editingSubject}
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
            </div>
            <div className="grid gap-2">
              <Label>Subject Code <span className="text-red-500">*</span></Label>
              <Input
                className="w-full"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g., MATH-10"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Full Marks</Label>
                <Input
                  type="number"
                  value={formData.fullMarks}
                  onChange={(e) => setFormData({ ...formData, fullMarks: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Pass Marks</Label>
                <Input
                  type="number"
                  value={formData.passMarks}
                  onChange={(e) => setFormData({ ...formData, passMarks: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Theory Marks</Label>
                <Input
                  type="number"
                  value={formData.theory}
                  onChange={(e) => setFormData({ ...formData, theory: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Practical Marks</Label>
                <Input
                  type="number"
                  value={formData.practical}
                  onChange={(e) => setFormData({ ...formData, practical: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="optional"
                checked={formData.optional}
                onChange={(e) => setFormData({ ...formData, optional: e.target.checked })}
              />
              <Label htmlFor="optional">Optional Subject</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingSubject ? "Save Changes" : "Add Subject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Subjects;
