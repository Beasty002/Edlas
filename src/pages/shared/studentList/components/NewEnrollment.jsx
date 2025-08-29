import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";

export default function EnrollmentPage() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      admissionNumber: "",
      firstName: "",
      middleName: "",
      lastName: "",
      dob: "",
      gender: "",
      rollNo: "",
      studentClass: "",
      section: "",
      admissionDate: "",
      fatherName: "",
      fatherPhone: "",
      motherName: "",
      motherPhone: "",
      guardianChoice: "",
      guardianName: "",
      guardianRelation: "",
      guardianPhone: "",
      address: "",
      notes: "",
      previousSchool: "",
      avatar: null,
    },
  });

  const defaultAvatar = "/images/default-avatar.png";
  const [avatarPreview, setAvatarPreview] = useState(defaultAvatar);
  const avatarInputRef = useRef(null);

  const handleAvatarClick = () => avatarInputRef.current?.click();

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      if (avatarPreview && avatarPreview !== defaultAvatar) {
        URL.revokeObjectURL(avatarPreview);
      }
      setAvatarPreview(previewURL);
      setValue("avatar", file);
    }
  };

  const removeAvatar = () => {
    if (avatarPreview && avatarPreview !== defaultAvatar) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarPreview(defaultAvatar);
    setValue("avatar", null);
    if (avatarInputRef.current) avatarInputRef.current.value = null;
  };

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview !== defaultAvatar) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const guardianChoice = watch("guardianChoice");
  const fatherName = watch("fatherName");
  const fatherPhone = watch("fatherPhone");
  const motherName = watch("motherName");
  const motherPhone = watch("motherPhone");

  useEffect(() => {
    if (guardianChoice === "father") {
      setValue("guardianName", fatherName);
      setValue("guardianPhone", fatherPhone);
      setValue("guardianRelation", "Father");
    } else if (guardianChoice === "mother") {
      setValue("guardianName", motherName);
      setValue("guardianPhone", motherPhone);
      setValue("guardianRelation", "Mother");
    } else if (guardianChoice === "other") {
      setValue("guardianName", "");
      setValue("guardianPhone", "");
      setValue("guardianRelation", "");
    }
  }, [
    guardianChoice,
    fatherName,
    fatherPhone,
    motherName,
    motherPhone,
    setValue,
  ]);

  const onSubmit = (data) => {
    console.log("Enrollment Data:", data);
    reset();
    removeAvatar();
    toast.success("Student enrolled successfully!");
  };

  const RequiredLabel = ({ children }) => (
    <Label className="mb-2">
      {children} <span className="text-red-500">*</span>
    </Label>
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">New Student Enrollment</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col items-center space-y-3">
          <div className="relative group">
            <Avatar
              className="h-24 w-24 cursor-pointer border border-gray-300"
              onClick={handleAvatarClick}
            >
              <AvatarImage
                src={avatarPreview || defaultAvatar}
                alt="Student Avatar"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-full">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </Avatar>

            {avatarPreview && avatarPreview !== defaultAvatar && (
              <button
                type="button"
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow"
                onClick={removeAvatar}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={avatarInputRef}
            className="hidden"
            onChange={handleAvatarChange}
          />
          <p className="text-xs text-gray-500">Click to upload (max 5MB)</p>
        </div>

        <div>
          <Label className="mb-2">Admission Number</Label>
          <Input {...register("admissionNumber")} className="w-full" />
        </div>

        <section>
          <h2 className="text-lg font-medium mb-4">Student Information</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <RequiredLabel>First Name</RequiredLabel>
              <Input
                {...register("firstName", {
                  required: "First name is required",
                })}
                className="w-full"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <Label className="mb-2">Middle Name</Label>
              <Input {...register("middleName")} className="w-full" />
            </div>
            <div>
              <RequiredLabel>Last Name</RequiredLabel>
              <Input
                {...register("lastName", { required: "Last name is required" })}
                className="w-full"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mt-5">
            <div>
              <RequiredLabel>Date of Birth</RequiredLabel>
              <Input
                type="date"
                {...register("dob", { required: "DOB is required" })}
                className="w-full"
              />
              {errors.dob && (
                <p className="text-red-500 text-sm">{errors.dob.message}</p>
              )}
            </div>
            <div>
              <RequiredLabel>Gender</RequiredLabel>
              <Select
                onValueChange={(v) =>
                  setValue("gender", v, { shouldValidate: true })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-red-500 text-sm">Gender is required</p>
              )}
            </div>
            <div>
              <RequiredLabel>Roll No</RequiredLabel>
              <Input
                {...register("rollNo", { required: "Roll number required" })}
                className="w-full"
              />
            </div>
            <div>
              <RequiredLabel>Admission Date</RequiredLabel>
              <Input
                type="date"
                {...register("admissionDate", {
                  required: "Admission date required",
                })}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-5">
            <div>
              <RequiredLabel>Class</RequiredLabel>
              <Select
                onValueChange={(v) =>
                  setValue("studentClass", v, { shouldValidate: true })
                }
              >
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
            <div>
              <RequiredLabel>Section</RequiredLabel>
              <Select
                onValueChange={(v) =>
                  setValue("section", v, { shouldValidate: true })
                }
              >
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
          </div>
        </section>

        <section>
          <hr className="mb-5" />
          <h2 className="text-lg font-medium mb-4">Guardian Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-2">Father's Name</Label>
              <Input {...register("fatherName")} className="w-full" />
            </div>
            <div>
              <Label className="mb-2">Father's Phone</Label>
              <Input {...register("fatherPhone")} className="w-full" />
            </div>
            <div>
              <Label className="mb-2">Mother's Name</Label>
              <Input {...register("motherName")} className="w-full" />
            </div>
            <div>
              <Label className="mb-2">Mother's Phone</Label>
              <Input {...register("motherPhone")} className="w-full" />
            </div>
          </div>

          <div className="mt-5">
            <Label className="mb-2">Who is the guardian?</Label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="father"
                  {...register("guardianChoice")}
                />{" "}
                Father
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="mother"
                  {...register("guardianChoice")}
                />{" "}
                Mother
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="other"
                  {...register("guardianChoice")}
                />{" "}
                Other
              </label>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-5">
            <div>
              <Label className="mb-2">Guardian Name</Label>
              <Input {...register("guardianName")} className="w-full" />
            </div>
            <div>
              <Label className="mb-2">Relation</Label>
              <Input {...register("guardianRelation")} className="w-full" />
            </div>
            <div>
              <Label className="mb-2">Guardian Phone</Label>
              <Input {...register("guardianPhone")} className="w-full" />
            </div>
          </div>
          <div className="mt-5">
            <Label className="mb-2">Address</Label>
            <Textarea
              {...register("address", { required: "Address required" })}
              className="w-full"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>
        </section>

        <hr className="mb-5" />
        <section>
          <h2 className="text-lg font-medium mb-2">
            Previous School Details (Optional)
          </h2>
          <Textarea
            {...register("previousSchool")}
            placeholder="Enter previous school details"
            className="w-full"
          />
        </section>

        <section>
          <h2 className="text-lg font-medium mb-2">Additional Notes</h2>
          <Textarea
            {...register("notes")}
            placeholder="Optional"
            className="w-full"
          />
        </section>

        <div className="pt-4">
          <Button type="submit" className="bg-blue-600 text-white">
            Enroll Student
          </Button>
        </div>
      </form>
    </div>
  );
}
