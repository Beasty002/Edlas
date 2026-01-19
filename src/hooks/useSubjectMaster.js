import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { baseRequest } from "@/api/api";
import { buildQueryParams } from "@/utils/helper";

const fetchSubjects = async ({ search, ordering, pagination }) => {
  const queryParams = buildQueryParams({
    pagination: pagination || { page: 1, pageSize: 100 },
    search,
    ordering,
    filters: {},
  });
  
  const res = await baseRequest({
    url: `/academics/subjects/?${queryParams.toString()}`,
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch subjects");
  }

  return res.data;
};

const createSubject = async (data) => {
  const res = await baseRequest({
    url: "/academics/subjects/",
    method: "POST",
    body: data,
  });

  if (!res.ok) {
    throw { response: { data: res.data, status: res.status } };
  }

  return res.data;
};

const updateSubject = async ({ id, data }) => {
  const res = await baseRequest({
    url: `/academics/subjects/${id}/`,
    method: "PATCH",
    body: data,
  });

  if (!res.ok) {
    throw { response: { data: res.data, status: res.status } };
  }

  return res.data;
};

export const useSubjectMaster = ({ 
  search = "", 
  ordering = "",
  pagination = { page: 1, pageSize: 100 }
} = {}) => {
  const queryClient = useQueryClient();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["subjects", search, ordering],
    queryFn: () => fetchSubjects({ search, ordering, pagination }),
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: createSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });

  return {
    subjects: data?.results || [],
    count: data?.count || 0,
    isLoading,
    error,
    refetch,
    createSubject: createMutation.mutate,
    updateSubject: updateMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
};

export default useSubjectMaster;
