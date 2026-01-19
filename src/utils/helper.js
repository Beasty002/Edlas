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


export const getErrorMessage = (error, defaultMessage = "An error occurred. Please try again.") => {
  if (!error?.response) {
    if (error?.message) {
      return error.message;
    }
    return defaultMessage;
  }

  const errorData = error.response?.data;

  if (typeof errorData === "string") {
    return errorData || defaultMessage;
  }

  if (errorData && typeof errorData === "object") {
    if (errorData.message) {
      return errorData.message;
    }
    if (errorData.detail) {
      return errorData.detail;
    }
    if (errorData.error) {
      return errorData.error;
    }

    if (errorData.non_field_errors) {
      const nonFieldErrors = Array.isArray(errorData.non_field_errors) 
        ? errorData.non_field_errors.join(", ") 
        : errorData.non_field_errors;
      return nonFieldErrors;
    }

    const fieldErrors = Object.entries(errorData)
      .filter(([key]) => !["message", "detail", "error", "status", "statusCode", "non_field_errors"].includes(key))
      .map(([field, messages]) => {
        const msg = Array.isArray(messages) ? messages.join(", ") : messages;
        const formattedField = field
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
        return `${formattedField}: ${msg}`;
      });

    if (fieldErrors.length > 0) {
      return fieldErrors.join("\n");
    }
  }

  if (Array.isArray(errorData) && errorData.length > 0) {
    return errorData.join(", ");
  }

  return defaultMessage;
};
