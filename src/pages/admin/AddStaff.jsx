import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Camera, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import { useSubjects, useClassrooms, useCreateStaff } from "@/api/hooks";

const AddStaff = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phone: "",
      dob: "",
      gender: "",
      address: "",
      role: "Teacher",
      qualification: "",
      experience: "",
      specialization: "",
      previousSchool: "",
      subjects: [],
      grades: [],
      status: "active",
    },
  });

  // Fetch subjects and classrooms from API
  const { data: subjectsData, isLoading: isLoadingSubjects } = useSubjects();
  const { data: classroomsData, isLoading: isLoadingClassrooms } = useClassrooms({ page_size: 100 });
  const createStaff = useCreateStaff();

  const subjectMaster = subjectsData?.subjects || [];
  const classrooms = classroomsData?.results || [];
  const allClasses = [...new Set(classrooms.map(c => c.name))].sort();

  const defaultAvatar = "/images/default-avatar.png";
  const [avatarPreview, setAvatarPreview] = useState(defaultAvatar);
  const avatarInputRef = useRef(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState([]);

  const handleAvatarClick = () => avatarInputRef.current?.click();

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setAvatarPreview(previewURL);
      setValue("avatar", file);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(defaultAvatar);
    setValue("avatar", null);
    if (avatarInputRef.current) avatarInputRef.current.value = null;
  };

  const handleSubjectToggle = (subjectId) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleGradeToggle = (grade) => {
    setSelectedGrades((prev) =>
      prev.includes(grade)
        ? prev.filter((g) => g !== grade)
        : [...prev, grade]
    );
  };

  const onSubmit = (data) => {
    const staffData = {
      first_name: data.firstName,
      middle_name: data.middleName,
      last_name: data.lastName,
      email: data.email,
      phone_number: data.phone,
      date_of_birth: data.dob,
      gender: data.gender,
      address: data.address,
      role: data.role,
      qualification: data.qualification,
      experience: data.experience,
      specialization: data.specialization,
      previous_school: data.previousSchool,
      subjects: selectedSubjects,
      grades: selectedGrades,
      is_active: data.status === "active",
      is_teacher: data.role === "Teacher",
    };

    createStaff.mutate(staffData, {
      onSuccess: () => {
        toast.success(`Staff added successfully!`);
        navigate("/staffs");
      },
      onError: (err) => {
        toast.error(err.message || "Failed to add staff");
      },
    });
  };

  const RequiredLabel = ({ children }) => (
    <Label className="mb-2">
      {children} <span className="text-red-500">*</span>
    </Label>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Add New Staff"
        description="Register a new staff member to the system"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col items-center space-y-3">
          <div className="relative group">
            <Avatar
              className="h-24 w-24 cursor-pointer border border-gray-300"
              onClick={handleAvatarClick}
            >
              <AvatarImage
                src={avatarPreview || defaultAvatar}
                alt="Staff Avatar"
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
          <p className="text-xs text-gray-500">Click to upload photo</p>
        </div>

        <section>
          <h2 className="text-lg font-medium mb-4">Personal Information</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <RequiredLabel>First Name</RequiredLabel>
              <Input
                {...register("firstName", { required: "First name is required" })}
                className="w-full"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">{errors.firstName.message}</p>
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
                <p className="text-red-500 text-sm">{errors.lastName.message}</p>
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
            </div>
            <div>
              <RequiredLabel>Gender</RequiredLabel>
              <Select onValueChange={(v) => setValue("gender", v)}>
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
              <RequiredLabel>Email</RequiredLabel>
              <Input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="w-full"
              />
            </div>
            <div>
              <RequiredLabel>Phone</RequiredLabel>
              <Input
                {...register("phone", { required: "Phone is required" })}
                className="w-full"
              />
            </div>
          </div>

          <div className="mt-5">
            <Label className="mb-2">Address</Label>
            <Textarea {...register("address")} className="w-full" />
          </div>
        </section>

        <hr />

        <section>
          <h2 className="text-lg font-medium mb-4">Professional Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <RequiredLabel>Role</RequiredLabel>
              <Select
                defaultValue="Teacher"
                onValueChange={(v) => setValue("role", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Teacher">Teacher</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Accountant">Accountant</SelectItem>
                  <SelectItem value="Librarian">Librarian</SelectItem>
                  <SelectItem value="Coordinator">Coordinator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <RequiredLabel>Highest Qualification</RequiredLabel>
              <Input
                {...register("qualification", { required: "Qualification is required" })}
                placeholder="e.g., M.Sc. Mathematics"
                className="w-full"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-5">
            <div>
              <Label className="mb-2">Years of Experience</Label>
              <Input
                {...register("experience")}
                placeholder="e.g., 5 years"
                className="w-full"
              />
            </div>
            <div>
              <Label className="mb-2">Specialization / Research Area</Label>
              <Input
                {...register("specialization")}
                placeholder="e.g., Applied Mathematics, Organic Chemistry"
                className="w-full"
              />
            </div>
          </div>

          <div className="mt-5">
            <Label className="mb-2">Previous School / Institution</Label>
            <Textarea
              {...register("previousSchool")}
              placeholder="Previous work experience details"
              className="w-full"
            />
          </div>
        </section>

        <hr />

        <section>
          <h2 className="text-lg font-medium mb-4">Teaching Preferences</h2>

          <div className="mb-6">
            <Label className="mb-3 block">Subjects Can Teach</Label>
            {isLoadingSubjects ? (
              <p className="text-sm text-muted-foreground">Loading subjects...</p>
            ) : subjectMaster.length === 0 ? (
              <p className="text-sm text-muted-foreground">No subjects available. Add subjects in Subject Master first.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {subjectMaster.map((subject) => (
                  <div key={subject.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`subject-${subject.id}`}
                      checked={selectedSubjects.includes(subject.id)}
                      onCheckedChange={() => handleSubjectToggle(subject.id)}
                    />
                    <label
                      htmlFor={`subject-${subject.id}`}
                      className="text-sm font-medium leading-none"
                    >
                      {subject.name}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label className="mb-3 block">Grades Can Teach</Label>
            {isLoadingClassrooms ? (
              <p className="text-sm text-muted-foreground">Loading grades...</p>
            ) : allClasses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No classes available. Add classrooms first.</p>
            ) : (
              <div className="flex flex-wrap gap-4">
                {allClasses.map((grade) => (
                  <div key={grade} className="flex items-center space-x-2">
                    <Checkbox
                      id={`grade-${grade}`}
                      checked={selectedGrades.includes(grade)}
                      onCheckedChange={() => handleGradeToggle(grade)}
                    />
                    <label
                      htmlFor={`grade-${grade}`}
                      className="text-sm font-medium leading-none"
                    >
                      Class {grade}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <hr />

        <section>
          <h2 className="text-lg font-medium mb-4">Status</h2>
          <Select
            defaultValue="active"
            onValueChange={(v) => setValue("status", v)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </section>

        <div className="pt-4 flex gap-3">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={createStaff.isPending}
          >
            {createStaff.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Staff
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/staffs")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddStaff;
