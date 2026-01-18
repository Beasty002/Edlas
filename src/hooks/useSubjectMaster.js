import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { baseRequest } from "@/api/api";

const fetchSubjects = async ({ search, ordering }) => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (ordering) params.append("ordering", ordering);
  
  const queryString = params.toString();
  const url = `/academics/subjects/${queryString ? `?${queryString}` : ""}`;
  
  const res = await baseRequest({
    url,
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

export const useSubjectMaster = ({ search = "", ordering = "" } = {}) => {
  const queryClient = useQueryClient();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["subjects", search, ordering],
    queryFn: () => fetchSubjects({ search, ordering }),
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
    subjects: data?.subjects || [],
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
