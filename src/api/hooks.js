import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  studentsAPI,
  usersAPI,
  classSectionsAPI,
  classroomsAPI,
  subjectsAPI,
  authAPI,
  staffAPI,
  classSubjectsAPI,
} from "./api";

export const useStudents = (params = {}) => {
  return useQuery({
    queryKey: ["students", params],
    queryFn: async () => {
      const response = await studentsAPI.list(params);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to fetch students");
      return response.data;
    },
  });
};

export const useStudent = (id) => {
  return useQuery({
    queryKey: ["student", id],
    queryFn: async () => {
      const response = await studentsAPI.getById(id);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to fetch student");
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (studentData) => {
      const response = await studentsAPI.create(studentData);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to create student");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await studentsAPI.update(id, data);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to update student");
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student", variables.id] });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await studentsAPI.delete(id);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to delete student");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

export const useUpdateStudentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await studentsAPI.updateStatus(id, status);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to update status");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

export const useBulkPlacement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ studentIds, action, targetClass, targetSection }) => {
      const response = await studentsAPI.bulkPlacement(studentIds, action, targetClass, targetSection);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to update placement");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: async () => {
      const response = await usersAPI.list(params);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to fetch users");
      return response.data;
    },
  });
};

export const useUser = (id) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await usersAPI.getById(id);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to fetch user");
      return response.data;
    },
    enabled: !!id,
  });
};

export const useClassSections = (params = {}) => {
  return useQuery({
    queryKey: ["classSections", params],
    queryFn: async () => {
      const response = await classSectionsAPI.list(params);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to fetch class sections");
      return response.data;
    },
  });
};

export const useCreateClassSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sectionData) => {
      const response = await classSectionsAPI.create(sectionData);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to create section");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classSections"] });
    },
  });
};

export const useUpdateClassSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await classSectionsAPI.partialUpdate(id, data);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to update section");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classSections"] });
    },
  });
};

export const useDeleteClassSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await classSectionsAPI.delete(id);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to delete section");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classSections"] });
    },
  });
};

export const useClassrooms = (params = {}) => {
  return useQuery({
    queryKey: ["classrooms", params],
    queryFn: async () => {
      const response = await classroomsAPI.list(params);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to fetch classrooms");
      return response.data;
    },
  });
};

export const useCreateClassroom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (classroomData) => {
      const response = await classroomsAPI.create(classroomData);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to create classroom");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
    },
  });
};

export const useCreateClassroomWithSections = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await classroomsAPI.createWithSections(data);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to create classroom with sections");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
      queryClient.invalidateQueries({ queryKey: ["classSections"] });
    },
  });
};

export const useUpdateClassroom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await classroomsAPI.partialUpdate(id, data);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to update classroom");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
    },
  });
};

export const useDeleteClassroom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await classroomsAPI.delete(id);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to delete classroom");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
    },
  });
};

export const useSubjects = (params = {}) => {
  return useQuery({
    queryKey: ["subjects", params],
    queryFn: async () => {
      const response = await subjectsAPI.list(params);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to fetch subjects");
      return response.data;
    },
  });
};

export const useCreateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (subjectData) => {
      const response = await subjectsAPI.create(subjectData);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to create subject");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
};

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await subjectsAPI.partialUpdate(id, data);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to update subject");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await subjectsAPI.delete(id);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to delete subject");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
};

export const useWhoAmI = () => {
  return useQuery({
    queryKey: ["whoami"],
    queryFn: async () => {
      const response = await authAPI.whoami();
      if (!response.ok) throw new Error(response.data?.detail || "Failed to fetch user");
      return response.data;
    },
    retry: false,
  });
};

// ==================== Staff Hooks ====================

export const useStaffList = (params = {}) => {
  return useQuery({
    queryKey: ["staff", params],
    queryFn: async () => {
      const response = await staffAPI.list(params);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to fetch staff");
      return response.data;
    },
  });
};

export const useStaff = (id) => {
  return useQuery({
    queryKey: ["staff", id],
    queryFn: async () => {
      const response = await staffAPI.getById(id);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to fetch staff member");
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (staffData) => {
      const response = await staffAPI.create(staffData);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to create staff");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await staffAPI.update(id, data);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to update staff");
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      queryClient.invalidateQueries({ queryKey: ["staff", variables.id] });
    },
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await staffAPI.delete(id);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to delete staff");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
};

export const useToggleStaffStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await staffAPI.toggleStatus(id, status);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to toggle staff status");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
};

export const useActiveTeachers = () => {
  return useQuery({
    queryKey: ["activeTeachers"],
    queryFn: async () => {
      const response = await staffAPI.getActiveTeachers();
      if (!response.ok) throw new Error(response.data?.detail || "Failed to fetch active teachers");
      return response.data;
    },
  });
};

// ==================== Class Subjects Hooks ====================

export const useClassSubjects = (params = {}) => {
  return useQuery({
    queryKey: ["classSubjects", params],
    queryFn: async () => {
      const response = await classSubjectsAPI.list(params);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to fetch class subjects");
      return response.data;
    },
  });
};

export const useClassSubject = (id) => {
  return useQuery({
    queryKey: ["classSubject", id],
    queryFn: async () => {
      const response = await classSubjectsAPI.getById(id);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to fetch class subject");
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateClassSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (classSubjectData) => {
      const response = await classSubjectsAPI.create(classSubjectData);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to create class subject");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classSubjects"] });
    },
  });
};

export const useUpdateClassSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await classSubjectsAPI.update(id, data);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to update class subject");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classSubjects"] });
    },
  });
};

export const useDeleteClassSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await classSubjectsAPI.delete(id);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to delete class subject");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classSubjects"] });
    },
  });
};

export const useClassSubjectsByClass = (className) => {
  return useQuery({
    queryKey: ["classSubjects", "byClass", className],
    queryFn: async () => {
      const response = await classSubjectsAPI.byClass(className);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to fetch class subjects");
      return response.data;
    },
    enabled: !!className,
  });
};

export const useAssignTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ classSubjectId, assignmentData }) => {
      const response = await classSubjectsAPI.assignTeacher(classSubjectId, assignmentData);
      if (!response.ok) throw new Error(response.data?.detail || "Failed to assign teacher");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classSubjects"] });
      queryClient.invalidateQueries({ queryKey: ["teacherAssignments"] });
    },
  });
};

export const useTeacherAssignments = () => {
  return useQuery({
    queryKey: ["teacherAssignments"],
    queryFn: async () => {
      const response = await classSubjectsAPI.getTeacherAssignments();
      if (!response.ok) throw new Error(response.data?.detail || "Failed to fetch teacher assignments");
      return response.data;
    },
  });
};
