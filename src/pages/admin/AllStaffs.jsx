import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Edit, UserX, Search } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { DataGrid } from "@/components/reusable/DataGrid";
import { baseRequest } from "@/api/api";
import { useDebounce, getSortConfig, buildQueryParams, getPaginationConfig } from "@/utils/helper";
import { toast } from "sonner";

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const roleOptions = [
  { label: "Teacher", value: "teacher" },
  { label: "Admin", value: "admin" },
];

const AllStaffs = () => {
  const [editingStaff, setEditingStaff] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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

  const sortConfig = getSortConfig(ordering);

  const handleSort = (newOrdering) => {
    setOrdering(newOrdering);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleEditClick = (staff) => {
    setEditingStaff({ ...staff });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingStaff) return;
    toast.success("Staff updated");
    setIsEditDialogOpen(false);
    setEditingStaff(null);
  };

  const handleToggleStatus = (staff) => {
    const newStatus = staff.status === "active" ? "inactive" : "active";
    toast.success(
      `Staff ${newStatus === "active" ? "activated" : "deactivated"}`
    );
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
        label: "Toggle Status",
        icon: <UserX className="h-4 w-4" />,
        onClick: handleToggleStatus,
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Staff</DialogTitle>
          </DialogHeader>
          {editingStaff && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  className="w-full"
                  value={editingStaff.full_name}
                  onChange={(e) =>
                    setEditingStaff({
                      ...editingStaff,
                      full_name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  className="w-full"
                  value={editingStaff.email}
                  onChange={(e) =>
                    setEditingStaff({ ...editingStaff, email: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  className="w-full"
                  value={editingStaff.phone}
                  onChange={(e) =>
                    setEditingStaff({ ...editingStaff, phone: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  className="w-full"
                  value={editingStaff.role}
                  onChange={(e) =>
                    setEditingStaff({ ...editingStaff, role: e.target.value })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllStaffs;
