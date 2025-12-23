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
import { Camera, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import { useClassrooms, useClassSections, useCreateStudent, useUpdateStudent } from "@/api/hooks";

const StudentDetailForm = ({ mode = "new", studentData = null, onSuccess }) => {
  const { data: classroomsData } = useClassrooms({ page_size: 100 });
  const { data: sectionsData } = useClassSections({ page_size: 100 });
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();

  const classrooms = classroomsData?.results || [];
  const sections = sectionsData?.results || [];

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
      dob: "",
      gender: "",
      roll_no: "",
      student_class: "",
      section: "",
      admission_date: "",
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

  const onSubmit = async (data) => {
    const payload = {
      admission_number: data.admission_number || null,
      first_name: data.first_name,
      middle_name: data.middle_name || null,
      last_name: data.last_name,
      dob: data.dob,
      gender: data.gender,
      roll_no: data.roll_no ? parseInt(data.roll_no) : null,
      student_class: data.student_class,
      section: data.section,
      admission_date: data.admission_date,
      address: data.address || null,
      father_name: data.father_name || null,
      father_phone: data.father_phone || null,
      mother_name: data.mother_name || null,
      mother_phone: data.mother_phone || null,
      guardian_name: data.guardian_name || null,
      guardian_relation: data.guardian_relation || null,
      guardian_phone: data.guardian_phone || null,
      previous_school: data.previous_school || null,
      notes: data.notes || null,
    };

    const mutationConfig = {
      onSuccess: () => {
        toast.success(mode === "new" ? "Student enrolled successfully!" : "Student updated successfully!");
        reset();
        removeAvatar();
        onSuccess?.();
      },
      onError: (err) => {
        toast.error(err.message || "Failed to save student");
      },
    };

    if (mode === "new") {
      createStudent.mutate(payload, mutationConfig);
    } else {
      updateStudent.mutate({ id: studentData.id, data: payload }, mutationConfig);
    }
  };

  const isLoading = createStudent.isPending || updateStudent.isPending;

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
                  {classrooms.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      Class {c.name}
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
                  {sections.map((s) => (
                    <SelectItem key={s.id} value={s.name}>
                      {s.name}
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
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "new" ? "Enroll Student" : "Update Student"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StudentDetailForm;
