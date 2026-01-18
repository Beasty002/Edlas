import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import PageHeader from "@/components/PageHeader";
import { baseRequest } from "@/api/api";
import { getErrorMessage } from "@/utils/helper";
import { useClassrooms } from "@/context/ClassroomsContext";

const StudentDetailForm = ({ mode = "new", studentData = null, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: studentData || {
      admission_number: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
      dob: "",
      gender: "",
      roll_no: "",
      student_class: "",
      section: "",
      admission_date: "",
      status: "active",
      father_name: "",
      father_phone: "",
      mother_name: "",
      mother_phone: "",
      guardianChoice: "",
      guardian_name: "",
      guardian_relation: "",
      guardian_phone: "",
      address: "",
      notes: "",
      previous_school: "",
      avatar: null,
    },
  });

  const { classOptions, getSectionsForClass } = useClassrooms();
  const selectedClass = watch("student_class");

  const queryClient = useQueryClient();

  const studentApiCall = async (data) => {
    const payload = {
      admission_number: data.admission_number,
      first_name: data.first_name,
      middle_name: data.middle_name,
      last_name: data.last_name,
      email: data.email,
      roll_no: data.roll_no ? parseInt(data.roll_no, 10) : null,
      student_class: data.student_class,
      section: data.section,
      dob: data.dob,
      gender: data.gender,
      address: data.address,
      admission_date: data.admission_date,
      status: data.status || "active",
      father_name: data.father_name,
      father_phone: data.father_phone,
      mother_name: data.mother_name,
      mother_phone: data.mother_phone,
      guardian_name: data.guardian_name,
      guardian_relation: data.guardian_relation,
      guardian_phone: data.guardian_phone,
      previous_school: data.previous_school,
      notes: data.notes,
    };

    const res = await baseRequest({
      url: mode === "new" ? "/system/students/" : `/system/students/${studentData?.id}/`,
      method: mode === "new" ? "POST" : "PATCH",
      body: payload,
    });

    if (!res.ok) {
      throw { response: { data: res.data, status: res.status } };
    }

    return res.data;
  };

  const enrollStudentMutation = useMutation({
    mutationFn: studentApiCall,
    onMutate: () => {
      toast.loading(mode === "new" ? "Enrolling student..." : "Updating student...", { id: "student" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success(mode === "new" ? "Student enrolled successfully!" : "Student updated successfully!", { id: "student" });
      reset();
      removeAvatar();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to save student. Please try again."), { id: "student" });
    },
  });

  const defaultAvatar = "/images/default-avatar.png";
  const [avatarPreview, setAvatarPreview] = useState(
    studentData?.avatar_url || defaultAvatar
  );
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
  const fatherName = watch("father_name");
  const fatherPhone = watch("father_phone");
  const motherName = watch("mother_name");
  const motherPhone = watch("mother_phone");

  useEffect(() => {
    if (guardianChoice === "father") {
      setValue("guardian_name", fatherName);
      setValue("guardian_phone", fatherPhone);
      setValue("guardian_relation", "Father");
    } else if (guardianChoice === "mother") {
      setValue("guardian_name", motherName);
      setValue("guardian_phone", motherPhone);
      setValue("guardian_relation", "Mother");
    } else if (guardianChoice === "other") {
      setValue("guardian_name", "");
      setValue("guardian_phone", "");
      setValue("guardian_relation", "");
    }
  }, [guardianChoice, fatherName, fatherPhone, motherName, motherPhone, setValue]);

  const onSubmit = (data) => {
    enrollStudentMutation.mutate(data);
  };

  const RequiredLabel = ({ children }) => (
    <Label className="mb-2">
      {children} <span className="text-red-500">*</span>
    </Label>
  );

  return (
    <div>
      {mode === "new" && (
        <PageHeader
          title="New Enrollment"
          description="Register a new student and assign them to a class and section."
        />
      )}

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
          <Input
            disabled={mode === "edit"}
            {...register("admission_number")}
            className="w-full"
          />
        </div>

        <section>
          <h2 className="text-lg font-medium mb-4">Student Information</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <RequiredLabel>First Name</RequiredLabel>
              <Input
                {...register("first_name", { required: "First name is required" })}
                className="w-full"
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm">{errors.first_name.message}</p>
              )}
            </div>
            <div>
              <Label className="mb-2">Middle Name</Label>
              <Input {...register("middle_name")} className="w-full" />
            </div>
            <div>
              <RequiredLabel>Last Name</RequiredLabel>
              <Input
                {...register("last_name", { required: "Last name is required" })}
                className="w-full"
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm">{errors.last_name.message}</p>
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
              {errors.dob && <p className="text-red-500 text-sm">{errors.dob.message}</p>}
            </div>
            <div>
              <RequiredLabel>Gender</RequiredLabel>
              <Select
                onValueChange={(v) => setValue("gender", v, { shouldValidate: true })}
                defaultValue={studentData?.gender}
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
            </div>
            <div>
              <Label className="mb-2">Roll No</Label>
              <Input type="number" {...register("roll_no")} className="w-full" />
            </div>
            <div>
              <RequiredLabel>Admission Date</RequiredLabel>
              <Input
                type="date"
                {...register("admission_date", { required: "Admission date required" })}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-5">
            <div>
              <Label className="mb-2">Email</Label>
              <Input
                type="email"
                {...register("email")}
                className="w-full"
                placeholder="student@example.com"
              />
            </div>
            <div>
              <Label className="mb-2">Status</Label>
              <Select
                onValueChange={(v) => setValue("status", v)}
                defaultValue={studentData?.status || "active"}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="graduated">Graduated</SelectItem>
                  <SelectItem value="transferred">Transferred</SelectItem>
                  <SelectItem value="dropped">Dropped Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-5">
            <div>
              <RequiredLabel>Class</RequiredLabel>
              <Select
                onValueChange={(v) => setValue("student_class", v, { shouldValidate: true })}
                defaultValue={studentData?.student_class}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classOptions.map((c) => (
                    <SelectItem key={c.id} value={c.value}>
                      Class {c.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <RequiredLabel>Section</RequiredLabel>
              <Select
                onValueChange={(v) => setValue("section", v, { shouldValidate: true })}
                defaultValue={studentData?.section}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {getSectionsForClass(selectedClass).map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
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
              <Input {...register("father_name")} className="w-full" />
            </div>
            <div>
              <Label className="mb-2">Father's Phone</Label>
              <Input {...register("father_phone")} className="w-full" />
            </div>
            <div>
              <Label className="mb-2">Mother's Name</Label>
              <Input {...register("mother_name")} className="w-full" />
            </div>
            <div>
              <Label className="mb-2">Mother's Phone</Label>
              <Input {...register("mother_phone")} className="w-full" />
            </div>
          </div>

          <div className="mt-5">
            <Label className="mb-2">Who is the guardian?</Label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input type="radio" value="father" {...register("guardianChoice")} /> Father
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" value="mother" {...register("guardianChoice")} /> Mother
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" value="other" {...register("guardianChoice")} /> Other
              </label>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-5">
            <div>
              <Label className="mb-2">Guardian Name</Label>
              <Input {...register("guardian_name")} className="w-full" />
            </div>
            <div>
              <Label className="mb-2">Relation</Label>
              <Input {...register("guardian_relation")} className="w-full" />
            </div>
            <div>
              <Label className="mb-2">Guardian Phone</Label>
              <Input {...register("guardian_phone")} className="w-full" />
            </div>
          </div>
          <div className="mt-5">
            <Label className="mb-2">Address</Label>
            <Textarea {...register("address")} className="w-full" />
          </div>
        </section>

        <hr className="mb-5" />
        <section>
          <h2 className="text-lg font-medium mb-2">Previous School Details (Optional)</h2>
          <Textarea
            {...register("previous_school")}
            placeholder="Enter previous school details"
            className="w-full"
          />
        </section>

        <section>
          <h2 className="text-lg font-medium mb-2">Additional Notes</h2>
          <Textarea {...register("notes")} placeholder="Optional" className="w-full" />
        </section>

        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={enrollStudentMutation.isPending}
          >
            {enrollStudentMutation.isPending
              ? "Saving..."
              : mode === "new"
                ? "Enroll Student"
                : "Update Student"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StudentDetailForm;
