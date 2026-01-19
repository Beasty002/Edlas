import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useSubjectMaster } from "@/hooks/useSubjectMaster";

const StaffDetailForm = ({ mode = "new", staffData = null, onSuccess }) => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: staffData || {
            first_name: "",
            middle_name: "",
            last_name: "",
            email: "",
            phone: "",
            dob: "",
            gender: "",
            address: "",
            role: "Teacher",
            qualification: "",
            experience: "",
            specialization: "",
            previous_school: "",
            subjects: [],
            grades: [],
            is_active: true,
        },
    });

    const { classOptions } = useClassrooms();
    const { subjects } = useSubjectMaster();
    const queryClient = useQueryClient();

    const defaultAvatar = "/images/default-avatar.png";
    const [avatarPreview, setAvatarPreview] = useState(
        staffData?.avatar_url || defaultAvatar
    );
    const avatarInputRef = useRef(null);
    const [selectedSubjects, setSelectedSubjects] = useState(staffData?.subjects || []);
    const [selectedGrades, setSelectedGrades] = useState(staffData?.grades || []);

    useEffect(() => {
        if (staffData) {
            setSelectedSubjects(staffData.subjects || []);
            setSelectedGrades(staffData.grades || []);
        }
    }, [staffData]);

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

    const staffApiCall = async (data) => {
        const payload = {
            first_name: data.first_name,
            middle_name: data.middle_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            dob: data.dob,
            gender: data.gender,
            address: data.address,
            role: data.role,
            qualification: data.qualification,
            experience: data.experience,
            specialization: data.specialization,
            previous_school: data.previous_school,
            subjects: selectedSubjects,
            grades: selectedGrades,
            is_active: data.is_active,
        };

        const res = await baseRequest({
            url: mode === "new" ? "/system/staff/" : `/system/staff/${staffData?.id}/`,
            method: mode === "new" ? "POST" : "PATCH",
            body: payload,
        });

        if (!res.ok) {
            throw { response: { data: res.data, status: res.status } };
        }

        return res.data;
    };

    const staffMutation = useMutation({
        mutationFn: staffApiCall,
        onMutate: () => {
            toast.loading(mode === "new" ? "Adding staff..." : "Updating staff...", { id: "staff" });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["staff"] });
            toast.success(mode === "new" ? "Staff added successfully!" : "Staff updated successfully!", { id: "staff" });
            reset();
            removeAvatar();
            setSelectedSubjects([]);
            setSelectedGrades([]);
            onSuccess?.();
        },
        onError: (error) => {
            toast.error(getErrorMessage(error, "Failed to save staff. Please try again."), { id: "staff" });
        },
    });

    const onSubmit = (data) => {
        staffMutation.mutate(data);
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
                    title="Add New Staff"
                    description="Register a new staff member to the system."
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
                    <p className="text-xs text-gray-500">Click to upload (max 5MB)</p>
                </div>

                <section>
                    <h2 className="text-lg font-medium mb-4">Personal Information</h2>
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
                                defaultValue={staffData?.gender}
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
                            <RequiredLabel>Email</RequiredLabel>
                            <Input
                                type="email"
                                {...register("email", { required: "Email is required" })}
                                className="w-full"
                                placeholder="staff@example.com"
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

                <hr className="mb-5" />

                <section>
                    <h2 className="text-lg font-medium mb-4">Professional Information</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <RequiredLabel>Role</RequiredLabel>
                            <Select
                                onValueChange={(v) => setValue("role", v)}
                                defaultValue={staffData?.role || "Teacher"}
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
                            {...register("previous_school")}
                            placeholder="Previous work experience details"
                            className="w-full"
                        />
                    </div>
                </section>

                <hr className="mb-5" />

                <section>
                    <h2 className="text-lg font-medium mb-4">Teaching Preferences</h2>

                    <div className="mb-6">
                        <Label className="mb-3 block">Subjects Can Teach</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {subjects.map((subject) => (
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
                    </div>

                    <div>
                        <Label className="mb-3 block">Grades Can Teach</Label>
                        <div className="flex flex-wrap gap-4">
                            {classOptions.map((opt) => (
                                <div key={opt.value} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`grade-${opt.value}`}
                                        checked={selectedGrades.includes(opt.value)}
                                        onCheckedChange={() => handleGradeToggle(opt.value)}
                                    />
                                    <label
                                        htmlFor={`grade-${opt.value}`}
                                        className="text-sm font-medium leading-none"
                                    >
                                        Class {opt.value}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <hr className="mb-5" />

                <section>
                    <h2 className="text-lg font-medium mb-4">Status</h2>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="is_active"
                            checked={watch("is_active")}
                            onCheckedChange={(checked) => setValue("is_active", checked)}
                        />
                        <label htmlFor="is_active" className="text-sm font-medium">
                            Active
                        </label>
                    </div>
                </section>

                <div className="pt-4 flex justify-end">
                    <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={staffMutation.isPending}
                    >
                        {staffMutation.isPending
                            ? "Saving..."
                            : mode === "new"
                                ? "Add Staff"
                                : "Update Staff"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default StaffDetailForm;
