import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { PlusCircle } from "lucide-react";

const AddSubjectDialog = ({ onAdd, allClasses }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    class: "",
    name: "",
    description: "",
    fullMarks: "",
    passMarks: "",
    theory: "",
    practical: "",
    optional: "false",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" })); // clear error when typing
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
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newSubject = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      fullMarks: parseInt(formData.fullMarks) || 0,
      passMarks: parseInt(formData.passMarks) || 0,
      theory: parseInt(formData.theory) || 0,
      practical: parseInt(formData.practical) || 0,
      optional: formData.optional === "true",
    };

    onAdd(formData.class, newSubject);
    setFormData({
      class: "",
      name: "",
      description: "",
      fullMarks: "",
      passMarks: "",
      theory: "",
      practical: "",
      optional: "false",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={"w-full md:w-40 bg-blue-600 hover:bg-blue-800 text-white"}
        >
          <PlusCircle /> Add New Subject
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-3">
          <div>
            <Label className="mb-2">Class</Label>
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
            <Label className="mb-2">Subject Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div>
            <Label className="mb-2">Description</Label>
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
              <Label className="mb-2">Full Marks</Label>
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
              <Label className="mb-2">Pass Marks</Label>
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
              <Label className="mb-2">Theory</Label>
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
              <Label className="mb-2">Practical</Label>
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
            <Label className="mb-2">Optional</Label>
            <Select
              value={formData.optional}
              onValueChange={(val) => handleChange("optional", val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
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

          <Button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-800 text-white"
          >
            Save Subject
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubjectDialog;
