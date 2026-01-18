import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { baseRequest } from "@/api/api";
import { buildQueryParams } from "@/utils/helper";

const fetchClassSubjects = async ({ search, ordering, classFilter, pagination }) => {
  const queryParams = buildQueryParams({
    pagination,
    search,
    ordering,
    filters: {
      class_name: classFilter,
    },
  });
  
  const res = await baseRequest({
    url: `/academics/class-subjects/?${queryParams.toString()}`,
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch class subjects");
  }

  return res.data;
};

const createClassSubject = async (data) => {
  const res = await baseRequest({
    url: "/academics/class-subjects/",
    method: "POST",
    body: data,
  });

  if (!res.ok) {
    throw { response: { data: res.data, status: res.status } };
  }

  return res.data;
};

const updateClassSubject = async ({ id, data }) => {
  const res = await baseRequest({
    url: `/academics/class-subjects/${id}/`,
    method: "PATCH",
    body: data,
  });

  if (!res.ok) {
    throw { response: { data: res.data, status: res.status } };
  }

  return res.data;
};

const deleteClassSubject = async (id) => {
  const res = await baseRequest({
    url: `/academics/class-subjects/${id}/`,
    method: "DELETE",
  });

  if (!res.ok) {
    throw { response: { data: res.data, status: res.status } };
  }

  return res.data;
};

export const useClassSubjects = ({ 
  search = "", 
  ordering = "", 
  classFilter = "", 
  pagination = { page: 1, pageSize: 20 }
} = {}) => {
  const queryClient = useQueryClient();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["classSubjects", search, ordering, classFilter, pagination.page, pagination.pageSize],
    queryFn: () => fetchClassSubjects({ search, ordering, classFilter, pagination }),
    staleTime: 1000 * 60 * 5,
  });

  const flattenedData = () => {
    if (!data?.class_subjects) return [];
    return Object.values(data.class_subjects).flat();
  };

  const createMutation = useMutation({
    mutationFn: createClassSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classSubjects"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateClassSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classSubjects"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteClassSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classSubjects"] });
    },
  });

  return {
    classSubjects: flattenedData(),
    rawData: data,
    count: data?.count || 0,
    isLoading,
    error,
    refetch,
    createClassSubject: createMutation.mutate,
    updateClassSubject: updateMutation.mutate,
    deleteClassSubject: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export default useClassSubjects;
