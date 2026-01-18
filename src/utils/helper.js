import { useState, useEffect } from "react";

export const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};


export const getSortConfig = (ordering) => {
  if (!ordering) {
    return { field: "", direction: null };
  }
  return {
    field: ordering.startsWith("-") ? ordering.slice(1) : ordering,
    direction: ordering.startsWith("-") ? "desc" : "asc",
  };
};


export const buildQueryParams = ({ pagination, search, ordering, filters = {} }) => {
  const params = new URLSearchParams();
  
  params.set("page", pagination.page);
  params.set("page_size", pagination.pageSize);
  
  if (search) {
    params.set("search", search);
  }
  
  if (ordering) {
    params.set("ordering", ordering);
  }
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== "all") {
      params.set(key, value);
    }
  });  
  
  return params;
};


export const getPaginationConfig = (pagination, total, setPagination, pageSizeOptions = [10, 20, 40, 50, 100]) => ({
  page: pagination.page,
  pageSize: pagination.pageSize,
  total,
  pageSizeOptions,
  onPageChange: (p) => setPagination((prev) => ({ ...prev, page: p })),
  onPageSizeChange: (size) => setPagination({ page: 1, pageSize: size }),
});
