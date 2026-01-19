import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit, UserX, UserCheck, Search } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { DataGrid } from "@/components/reusable/DataGrid";
import { baseRequest } from "@/api/api";
import { useDebounce, getSortConfig, buildQueryParams, getPaginationConfig, getErrorMessage } from "@/utils/helper";
import { toast } from "sonner";
import UpdateStaffForm from "./UpdateStaffForm";

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const roleOptions = [
  { label: "Teacher", value: "teacher" },
  { label: "Admin", value: "admin" },
];

const AllStaffs = () => {
  const queryClient = useQueryClient();
  const [editingStaff, setEditingStaff] = useState(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20 });
  const [ordering, setOrdering] = useState(null);

  const queryParams = buildQueryParams({
    pagination,
    search: debouncedSearch,
    ordering,
    filters: {
      status,
      role,
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["staff", queryParams.toString()],
    queryFn: async () => {
      const res = await baseRequest({
        url: `/system/staff/?${queryParams.toString()}`,
        method: "GET",
      });
      return res.data;
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ staffId, isActive }) => {
      const res = await baseRequest({
        url: `/system/staff/${staffId}/`,
        method: "PATCH",
        body: { is_active: isActive },
      });
      if (!res.ok) {
        throw { response: { data: res.data, status: res.status } };
      }
      return res.data;
    },
    onMutate: ({ isActive }) => {
      toast.loading(isActive ? "Activating staff..." : "Deactivating staff...", { id: "toggle-status" });
    },
    onSuccess: (_, { isActive }) => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success(isActive ? "Staff activated" : "Staff deactivated", { id: "toggle-status" });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update status"), { id: "toggle-status" });
    },
  });

  const sortConfig = getSortConfig(ordering);

  const handleSort = (newOrdering) => {
    setOrdering(newOrdering);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleEditClick = (staff) => {
    setEditingStaff(staff);
  };

  const handleToggleStatus = (staff) => {
    const newIsActive = staff.status !== "active";
    toggleStatusMutation.mutate({ staffId: staff.id, isActive: newIsActive });
  };

  const columns = [
    { field: "id", headerText: "ID", width: 60, template: (staff) => <span>#{staff.id}</span> },
    { field: "name", headerText: "Name", width: 150 },
    { field: "email", headerText: "Email", width: 200 },
    { field: "phone", headerText: "Phone", width: 120, template: (staff) => staff.phone || "-" },
    { field: "role", headerText: "Role", width: 100 },
    {
      field: "status",
      headerText: "Status",
      width: 100,
      textAlign: "Center",
      template: (staff) => (
        <Badge variant={staff.status === "active" ? "default" : "destructive"}>
          {staff.status === "active" ? "Active" : "Inactive"}
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
        label: "Edit",
        icon: <Edit className="h-4 w-4" />,
        onClick: handleEditClick,
      },
      {
        label: "Activate",
        icon: <UserCheck className="h-4 w-4" />,
        onClick: handleToggleStatus,
        hidden: (staff) => staff.status === "active",
      },
      {
        label: "Deactivate",
        icon: <UserX className="h-4 w-4" />,
        onClick: handleToggleStatus,
        hidden: (staff) => staff.status !== "active",
      },
    ],
  };

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Staff Management"
        description="Manage all staff members and their assignments"
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-sm">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={status} onValueChange={(val) => { setStatus(val); setPagination((p) => ({ ...p, page: 1 })); }}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={role} onValueChange={(val) => { setRole(val); setPagination((p) => ({ ...p, page: 1 })); }}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {roleOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataGrid
        columns={columns}
        data={data?.staff || []}
        isLoading={isLoading}
        actionConfig={actionConfig}
        emptyMessage="No staff members found"
        keyField="id"
        sortConfig={sortConfig}
        onSort={handleSort}
        pagination={getPaginationConfig(pagination, data?.pagination?.total || 0, setPagination)}
      />

      {editingStaff && (
        <UpdateStaffForm
          staff={editingStaff}
          onClose={() => setEditingStaff(null)}
        />
      )}
    </div>
  );
};

export default AllStaffs;

