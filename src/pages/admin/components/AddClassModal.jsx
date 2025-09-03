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
import { Plus, Minus, PlusCircle } from "lucide-react";
import { Label } from "@/components/ui/Label";

const AddClassModal = ({ classesData = [], onSave }) => {
  const [mode, setMode] = useState("new"); // "new" | "section"
  const [className, setClassName] = useState("");
  const [sections, setSections] = useState([]);
  const [existingSections, setExistingSections] = useState([]);
  const [status] = useState("active");

  useEffect(() => {
    if (mode === "section" && className) {
      const existingClass = classesData.find((c) => c.className === className);
      if (existingClass) {
        setExistingSections(existingClass.sections || []);
        setSections(existingClass.sections || []);
      }
    } else {
      setExistingSections([]);
      setSections(["A"]);
    }
  }, [className, mode, classesData]);

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
    if (!isOpen) {
      setMode("new");
      setClassName("");
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
    const newClass = {
      id: Date.now().toString(),
      className,
      sections,
      status,
      totalStudents: 0,
    };
    onSave(newClass);
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
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
              <Select value={className} onValueChange={setClassName}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Existing Class" />
                </SelectTrigger>
                <SelectContent>
                  {classesData.map((c) => (
                    <SelectItem key={c.className} value={c.className}>
                      Class {c.className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {className && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Sections</Label>

              <div className="flex items-center gap-2 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (sections.length > 1) {
                      removeSection(sections[sections.length - 1]);
                    }
                  }}
                  disabled={sections.length <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <div className="flex flex-wrap gap-2 flex-1">
                  {sections.map((sec, idx) => (
                    <Badge
                      key={sec + idx}
                      className={`px-3 w-[30px] h-[30px] py-1 rounded-full text-sm flex items-center justify-center ${
                        existingSections.includes(sec)
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
            disabled={!className || sections.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddClassModal;
