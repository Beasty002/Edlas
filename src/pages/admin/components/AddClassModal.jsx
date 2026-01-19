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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { baseRequest } from "@/api/api";
import { getErrorMessage } from "@/utils/helper";

const fetchClassrooms = async () => {
  const res = await baseRequest({
    url: "/academics/classrooms/",
    method: "GET",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch classrooms");
  }
  return res.data;
};

const AddClassModal = ({ onSave }) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("new");
  const [className, setClassName] = useState("");
  const [selectedClassroomId, setSelectedClassroomId] = useState("");
  const [sections, setSections] = useState(["A"]);
  const [existingSections, setExistingSections] = useState([]);

  const { data: classroomsData } = useQuery({
    queryKey: ["classrooms"],
    queryFn: fetchClassrooms,
    enabled: open,
  });

  const classrooms = classroomsData?.results || [];

  useEffect(() => {
    if (mode === "section" && selectedClassroomId) {
      const selectedClassroom = classrooms.find((c) => c.id.toString() === selectedClassroomId);
      if (selectedClassroom && selectedClassroom.sections) {
        const existing = selectedClassroom.sections.map((s) => s.name);
        setExistingSections(existing);
        setSections([...existing]);
      } else {
        setExistingSections([]);
        setSections(["A"]);
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

  const createClassMutation = useMutation({
    mutationFn: async ({ classroomName, sectionsList }) => {
      const res = await baseRequest({
        url: "/academics/classrooms/create_with_sections/",
        method: "POST",
        body: {
          classroom_name: classroomName,
          section_names: sectionsList,
        },
      });
      if (!res.ok) {
        throw { response: { data: res.data, status: res.status } };
      }
      return res.data;
    },
    onMutate: () => {
      toast.loading("Creating class...", { id: "addClass" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
      queryClient.invalidateQueries({ queryKey: ["classSections"] });
      toast.success("Class created successfully", { id: "addClass" });
      setOpen(false);
      onSave?.();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create class"), { id: "addClass" });
    },
  });

  const addSectionsMutation = useMutation({
    mutationFn: async ({ classroomId, sectionsList }) => {
      const res = await baseRequest({
        url: `/academics/classrooms/${classroomId}/add-sections/`,
        method: "POST",
        body: {
          sections: sectionsList,
        },
      });
      if (!res.ok) {
        throw { response: { data: res.data, status: res.status } };
      }
      return res.data;
    },
    onMutate: () => {
      toast.loading("Adding sections...", { id: "addSections" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
      queryClient.invalidateQueries({ queryKey: ["classSections"] });
      toast.success("Sections added successfully", { id: "addSections" });
      setOpen(false);
      onSave?.();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to add sections"), { id: "addSections" });
    },
  });

  const handleSubmit = () => {
    if (mode === "new") {
      createClassMutation.mutate({
        classroomName: className,
        sectionsList: sections,
      });
    } else {
      const newSections = sections.filter((s) => !existingSections.includes(s));
      if (newSections.length > 0) {
        addSectionsMutation.mutate({
          classroomId: selectedClassroomId,
          sectionsList: newSections,
        });
      } else {
        toast.info("No new sections to add");
      }
    }
  };

  const isPending = createClassMutation.isPending || addSectionsMutation.isPending;

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
            disabled={(!className && !selectedClassroomId) || sections.length === 0 || isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddClassModal;
