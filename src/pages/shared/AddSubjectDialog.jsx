import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddSubjectDialog = ({
  open,
  onOpenChange,
  onAdd,
  onEdit,
  allClasses,
  subject,
}) => {
  const teachers = [
    "Mr. Sharma",
    "Ms. Karki",
    "Mr. Thapa",
    "Dr. Rana",
    "Dr. Shrestha",
    "Mr. Bhandari",
    "Ms. Gurung",
  ];

  const [formData, setFormData] = useState({
    class: "",
    name: "",
    description: "",
    fullMarks: "",
    passMarks: "",
    theory: "",
    practical: "",
    optional: "false",
    teacher: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (subject) {
      setFormData({
        class: subject.class?.toString() || "",
        name: subject.name || "",
        description: subject.description || "",
        fullMarks: subject.fullMarks?.toString() || "",
        passMarks: subject.passMarks?.toString() || "",
        theory: subject.theory?.toString() || "",
        practical: subject.practical?.toString() || "",
        optional: subject.optional ? "true" : "false",
        teacher: subject.teacher || "",
      });
    } else {
      setFormData({
        class: "",
        name: "",
        description: "",
        fullMarks: "",
        passMarks: "",
        theory: "",
        practical: "",
        optional: "false",
        teacher: "",
      });
    }
  }, [subject, open]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.class) newErrors.class = "Class is required";
    if (!formData.name) newErrors.name = "Subject name is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.fullMarks) newErrors.fullMarks = "Full marks are required";
    if (!formData.passMarks) newErrors.passMarks = "Pass marks are required";
    if (!formData.theory) newErrors.theory = "Theory marks are required";
    if (!formData.practical)
      newErrors.practical = "Practical marks are required";
    if (!formData.optional)
      newErrors.optional = "Please select optional status";
    if (!formData.teacher) newErrors.teacher = "Teacher is required";
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const subjectData = {
      id: subject ? subject.id : Date.now(),
      name: formData.name,
      description: formData.description,
      fullMarks: parseInt(formData.fullMarks) || 0,
      passMarks: parseInt(formData.passMarks) || 0,
      theory: parseInt(formData.theory) || 0,
      practical: parseInt(formData.practical) || 0,
      optional: formData.optional === "true",
      teacher: formData.teacher,
      class: formData.class,
    };

    if (subject) {
      onEdit(formData.class, subjectData);
    } else {
      onAdd(formData.class, subjectData);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {subject ? "Edit Subject" : "Add New Subject"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-3">
          <div>
            <Label className="mb-3">Class</Label>
            <Select
              value={formData.class}
              onValueChange={(val) => handleChange("class", val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {allClasses.map((c) => (
                  <SelectItem key={c} value={c}>
                    Class {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.class && (
              <p className="text-red-500 text-sm">{errors.class}</p>
            )}
          </div>

          <div>
            <Label className="mb-3">Subject Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div>
            <Label className="mb-3">Description</Label>
            <Input
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="mb-3">Full Marks</Label>
              <Input
                type="number"
                value={formData.fullMarks}
                onChange={(e) => handleChange("fullMarks", e.target.value)}
              />
              {errors.fullMarks && (
                <p className="text-red-500 text-sm">{errors.fullMarks}</p>
              )}
            </div>
            <div>
              <Label className="mb-3">Pass Marks</Label>
              <Input
                type="number"
                value={formData.passMarks}
                onChange={(e) => handleChange("passMarks", e.target.value)}
              />
              {errors.passMarks && (
                <p className="text-red-500 text-sm">{errors.passMarks}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="mb-3">Theory</Label>
              <Input
                type="number"
                value={formData.theory}
                onChange={(e) => handleChange("theory", e.target.value)}
              />
              {errors.theory && (
                <p className="text-red-500 text-sm">{errors.theory}</p>
              )}
            </div>
            <div>
              <Label className="mb-3">Practical</Label>
              <Input
                type="number"
                value={formData.practical}
                onChange={(e) => handleChange("practical", e.target.value)}
              />
              {errors.practical && (
                <p className="text-red-500 text-sm">{errors.practical}</p>
              )}
            </div>
          </div>

          <div>
            <Label className="mb-3">Optional</Label>
            <Select
              value={formData.optional}
              onValueChange={(val) => handleChange("optional", val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">No</SelectItem>
                <SelectItem value="true">Yes</SelectItem>
              </SelectContent>
            </Select>
            {errors.optional && (
              <p className="text-red-500 text-sm">{errors.optional}</p>
            )}
          </div>

          <div>
            <Label className="mb-3">Teacher</Label>
            <Select
              value={formData.teacher}
              onValueChange={(val) => handleChange("teacher", val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.teacher && (
              <p className="text-red-500 text-sm">{errors.teacher}</p>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-800 text-white"
          >
            {subject ? "Update Subject" : "Save Subject"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubjectDialog;
