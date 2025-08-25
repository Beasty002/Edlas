import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Camera, X } from "lucide-react";

export default function NewEnrollment({ open, onOpenChange }) {
  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      rollNo: "",
      studentClass: "",
      section: "",
      admissionDate: "",
      fatherName: "",
      motherName: "",
      guardianName: "",
      phonePrimary: "",
      phoneSecondary: "",
      address: "",
      notes: "",
      avatar: null,
    },
  });

  const defaultAvatar = "/images/default-avatar.png";
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(defaultAvatar);

  const handleAvatarClick = () => {
    document.getElementById("avatarInput")?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (avatarPreview && avatarPreview !== defaultAvatar) {
        URL.revokeObjectURL(avatarPreview);
      }
      const previewURL = URL.createObjectURL(file);
      setAvatarPreview(previewURL);
      setAvatarFile(file);
      setValue("avatar", file);
    }
  };

  const removeAvatar = () => {
    if (avatarPreview && avatarPreview !== defaultAvatar) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarPreview(defaultAvatar);
    setAvatarFile(null);
    setValue("avatar", null);
    document.getElementById("avatarInput").value = null;
  };

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview !== defaultAvatar) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const onSubmit = (data) => {
    console.log("Enrollment Data:", data);
    reset();
    removeAvatar();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90dvh] flex flex-col p-0">
        {/* Fixed Header */}
        <DialogHeader className="p-6 border-b">
          <DialogTitle>New Student Enrollment</DialogTitle>
        </DialogHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-auto p-6 space-y-6 custom-scrollbar">
          <form
            id="enrollmentForm"
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-6"
          >
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-3 relative">
              <div className="relative">
                <div className="relative group">
                  <Avatar
                    className="h-24 w-24 cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
                    onClick={handleAvatarClick}
                  >
                    <AvatarImage
                      src={avatarPreview || defaultAvatar}
                      alt="Student Avatar"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center pointer-events-none">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </Avatar>
                </div>

                {avatarPreview && avatarPreview !== defaultAvatar && (
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors z-10"
                    onClick={removeAvatar}
                    aria-label="Remove avatar"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <input
                type="file"
                id="avatarInput"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {avatarPreview && avatarPreview !== defaultAvatar
                    ? "Click to change photo"
                    : "Click to add photo"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: Square image, max 5MB
                </p>
              </div>
            </div>

            {/* Student Info */}
            <div className="grid gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">
                  Student Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                  <div className="flex flex-col">
                    <Label className="mb-3">First Name *</Label>
                    <Input {...register("firstName", { required: true })} />
                  </div>
                  <div className="flex flex-col">
                    <Label className="mb-3">Middle Name</Label>
                    <Input {...register("middleName")} placeholder="Optional" />
                  </div>
                  <div className="flex flex-col">
                    <Label className="mb-3">Last Name *</Label>
                    <Input {...register("lastName", { required: true })} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">
                  <div className="flex flex-col">
                    <Label className="mb-3">Roll Number *</Label>
                    <Input {...register("rollNo", { required: true })} />
                  </div>
                  <div className="flex flex-col">
                    <Label className="mb-3">Class *</Label>
                    <Select {...register("studentClass", { required: true })}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(12)].map((_, i) => (
                          <SelectItem key={i} value={`class-${i + 1}`}>
                            Class {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col">
                    <Label className="mb-3">Section *</Label>
                    <Select {...register("section", { required: true })}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                      <SelectContent>
                        {["A", "B", "C"].map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col">
                    <Label className="mb-3">Admission Date *</Label>
                    <Input
                      type="date"
                      {...register("admissionDate", { required: true })}
                    />
                  </div>
                </div>
              </div>

              <hr />

              {/* Guardian Info */}
              <div>
                <h3 className="text-lg font-medium mb-2">
                  Guardian Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                  <div className="flex flex-col">
                    <Label className="mb-3">Father's Name</Label>
                    <Input {...register("fatherName")} placeholder="Optional" />
                  </div>
                  <div className="flex flex-col">
                    <Label className="mb-3">Mother's Name</Label>
                    <Input {...register("motherName")} placeholder="Optional" />
                  </div>
                  <div className="flex flex-col">
                    <Label className="mb-3">Guardian Name</Label>
                    <Input
                      {...register("guardianName")}
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                  <div className="flex flex-col">
                    <Label className="mb-3">Primary Phone *</Label>
                    <Input {...register("phonePrimary", { required: true })} />
                  </div>
                  <div className="flex flex-col">
                    <Label className="mb-3">Secondary Phone</Label>
                    <Input
                      {...register("phoneSecondary")}
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 mt-5">
                  <div className="flex flex-col">
                    <Label className="mb-3">Address *</Label>
                    <Textarea {...register("address", { required: true })} />
                  </div>
                  <div className="flex flex-col">
                    <Label className="mb-3">Additional Notes</Label>
                    <Textarea {...register("notes")} placeholder="Optional" />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Fixed Footer */}
        <DialogFooter className="p-6 border-t">
          <Button
            type="submit"
            form="enrollmentForm"
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Enroll Student
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
