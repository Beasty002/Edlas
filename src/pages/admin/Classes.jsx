import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Eye, UserX, PlusCircle, Search } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { DataGrid } from "@/components/reusable/DataGrid";
import AddClassModal from "./components/AddClassModal";
import AssignTeacherModal from "./components/AssignTeacherModal";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { buildQueryParams, useDebounce } from "@/utils/helper";
import { baseRequest } from "@/api/api";

const fetchClassSections = async (queryString) => {
  const res = await baseRequest({
    url: `/academics/class-sections/${queryString}`,
    method: "GET",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch class sections");
  }
  return res.data;
};

const Classes = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [status, setStatus] = useState("");
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [ordering, setOrdering] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);

  const queryParams = buildQueryParams({
    pagination,
    search: debouncedSearch,
    ordering,
    filters: {
      is_active: status === "active" ? true : status === "inactive" ? false : undefined,
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["classSections", queryParams.toString()],
    queryFn: () => fetchClassSections(queryParams.toString() ? `?${queryParams.toString()}` : ""),
  });

  const classSections = data?.results || [];
  const totalCount = data?.count || 0;

  const handleStatusChange = (value) => {
    setStatus(value === "all" ? "" : value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleAssignTeacher = (cls) => {
    setSelectedClass(cls);
    setIsTeacherModalOpen(true);
  };

  const toggleStatusMutation = useMutation({
    mutationFn: async (cls) => {
      const res = await baseRequest({
        url: `/academics/class-sections/${cls.id}/`,
        method: "PATCH",
        body: { is_active: !cls.is_active },
      });
      if (!res.ok) {
        throw new Error("Failed to update status");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classSections"] });
      toast.success("Status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  const handleAction = (action, cls) => {
    if (action === "toggle") {
      toggleStatusMutation.mutate(cls);
    }
  };

  const handleSaveNewClass = () => {
    queryClient.invalidateQueries({ queryKey: ["classSections"] });
  };

  const handleSaveTeacher = () => {
    queryClient.invalidateQueries({ queryKey: ["classSections"] });
    setIsTeacherModalOpen(false);
  };

  const columns = [
    {
      field: "classroom_name",
      headerText: "Class",
      width: 100,
      template: (cls) => (
        <Badge className="bg-primary/10 text-primary border-primary/20">
          Class {cls.classroom_name}
        </Badge>
      ),
    },
    {
      field: "name",
      headerText: "Section",
      width: 80,
    },
    {
      field: "teacher_name",
      headerText: "Class Teacher",
      width: 150,
      template: (cls) => cls.teacher_name || "--",
    },
    {
      field: "total_students",
      headerText: "Total Students",
      width: 120,
      textAlign: "Center",
      template: (cls) => cls.total_students || 0,
    },
    {
      field: "is_active",
      headerText: "Status",
      width: 100,
      textAlign: "Center",
      template: (cls) => (
        <Badge variant={cls.is_active ? "default" : "destructive"}>
          {cls.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

  const actionConfig = {
    mode: "dropdown",
    showOnHover: false,
    width: 60,
    actions: [
      {
        label: "View",
        icon: <Eye className="h-4 w-4" />,
        onClick: (cls) => handleAction("View", cls),
      },
      {
        label: "Toggle Status",
        icon: <UserX className="h-4 w-4" />,
        onClick: (cls) => handleAction("toggle", cls),
      },
      {
        label: "Assign Teacher",
        icon: <PlusCircle className="h-4 w-4" />,
        onClick: handleAssignTeacher,
      },
    ],
  };

  const paginationConfig = {
    page: pagination.page,
    pageSize: pagination.pageSize,
    total: totalCount,
    onPageChange: (newPage) => setPagination((prev) => ({ ...prev, page: newPage })),
    onPageSizeChange: (newSize) => setPagination({ page: 1, pageSize: newSize }),
  };

  const sortConfig = ordering
    ? {
      field: ordering.startsWith("-") ? ordering.slice(1) : ordering,
      direction: ordering.startsWith("-") ? "desc" : "asc",
    }
    : { field: "", direction: null };

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Class Management"
        description="Manage classes, sections, and assign class teachers efficiently"
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-sm">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search classes..."
            className="pl-10 w-full"
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={status || "all"} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <AddClassModal onSave={handleSaveNewClass} />
          </Button>
        </div>
      </div>

      <DataGrid
        columns={columns}
        data={classSections}
        isLoading={isLoading}
        actionConfig={actionConfig}
        emptyMessage="No classes found"
        keyField="id"
        pagination={paginationConfig}
        sortConfig={sortConfig}
        onSort={setOrdering}
      />

      <AssignTeacherModal
        cls={selectedClass}
        open={isTeacherModalOpen}
        onOpenChange={setIsTeacherModalOpen}
        onSave={handleSaveTeacher}
      />
    </div>
  );
};

export default Classes;
