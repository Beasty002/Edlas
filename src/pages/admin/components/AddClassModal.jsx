import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, PlusCircle, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useCreateClassroomWithSections, useCreateClassSection, useClassrooms } from "@/api/hooks";
import { toast } from "sonner";

const AddClassModal = ({ classesData = [], onSave }) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("new"); // "new" | "section"
  const [className, setClassName] = useState("");
  const [selectedClassroomId, setSelectedClassroomId] = useState("");
  const [sections, setSections] = useState(["A"]);
  const [existingSections, setExistingSections] = useState([]);

  const { data: classroomsData } = useClassrooms({ page_size: 100 });
  const classrooms = classroomsData?.results || [];

  const createClassroomWithSections = useCreateClassroomWithSections();
  const createSection = useCreateClassSection();

  useEffect(() => {
    if (mode === "section" && selectedClassroomId) {
      const selectedClassroom = classrooms.find((c) => c.id.toString() === selectedClassroomId);
      if (selectedClassroom && selectedClassroom.sections) {
        const existing = selectedClassroom.sections.map(s => s.name);
        setExistingSections(existing);
        setSections(existing);
      }
    } else {
      setExistingSections([]);
      setSections(["A"]);
    }
  }, [selectedClassroomId, mode, classrooms]);

  const addSection = () => {
    const allSections = [...sections];
    let nextChar = "A";
    if (allSections.length > 0) {
      const lastChar = allSections[allSections.length - 1];
      nextChar = String.fromCharCode(lastChar.charCodeAt(0) + 1);
    }
    setSections([...allSections, nextChar]);
  };

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) {
      setMode("new");
      setClassName("");
      setSelectedClassroomId("");
      setSections(["A"]);
      setExistingSections([]);
    }
  };

  const removeSection = () => {
    if (sections.length > existingSections.length) {
      setSections(sections.slice(0, -1));
    }
  };

  const handleSubmit = () => {
    if (mode === "new") {
      // Create new classroom with sections
      const payload = {
        classroom_name: className,
        section_names: sections,
      };
      createClassroomWithSections.mutate(payload, {
        onSuccess: () => {
          toast.success("Class created successfully");
          setOpen(false);
        },
        onError: (err) => toast.error(err.message),
      });
    } else {
      // Add new sections to existing classroom
      const newSections = sections.filter(s => !existingSections.includes(s));
      if (newSections.length === 0) {
        toast.info("No new sections to add");
        return;
      }

      // Create each new section
      const promises = newSections.map(sectionName =>
        createSection.mutateAsync({
          name: sectionName,
          classroom: parseInt(selectedClassroomId),
          is_active: true,
        })
      );

      Promise.all(promises)
        .then(() => {
          toast.success("Sections added successfully");
          setOpen(false);
        })
        .catch((err) => toast.error(err.message));
    }
  };

  const isSubmitting = createClassroomWithSections.isPending || createSection.isPending;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg space-y-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {mode === "new" ? "Add New Class" : "Update Class Sections"}
          </DialogTitle>
          <DialogDescription>
            {mode === "new"
              ? "Create a new class and add sections."
              : "Add new sections to an existing class. Existing sections cannot be removed."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Choose Action</Label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Add New Class</SelectItem>
                <SelectItem value="section">Update Existing Class</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Class</Label>
            {mode === "new" ? (
              <Input
                placeholder="Enter Class Name (e.g., 9, 10, 11)"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className={"mt-2"}
              />
            ) : (
              <Select value={selectedClassroomId} onValueChange={setSelectedClassroomId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Existing Class" />
                </SelectTrigger>
                <SelectContent>
                  {classrooms.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      Class {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {(className || selectedClassroomId) && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Sections</Label>

              <div className="flex items-center gap-2 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (sections.length > 1) {
                      removeSection();
                    }
                  }}
                  disabled={sections.length <= Math.max(1, existingSections.length)}
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <div className="flex flex-wrap gap-2 flex-1">
                  {sections.map((sec, idx) => (
                    <Badge
                      key={sec + idx}
                      className={`px-3 w-[30px] h-[30px] py-1 rounded-full text-sm flex items-center justify-center ${existingSections.includes(sec)
                          ? "bg-gray-300 dark:bg-gray-600"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200"
                        }`}
                    >
                      {sec}
                    </Badge>
                  ))}
                </div>

                {/* Add button */}
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addSection}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={(!className && !selectedClassroomId) || sections.length === 0 || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddClassModal;
