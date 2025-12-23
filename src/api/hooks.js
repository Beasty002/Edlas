import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  studentsAPI,
  usersAPI,
  classSectionsAPI,
  classroomsAPI,
  subjectsAPI,
  authAPI,
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
