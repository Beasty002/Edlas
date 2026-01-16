import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Search, Edit, UserX, PlusCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import DataNotFound from "@/components/reusable/DataNotFound";
import { TableSkeleton } from "@/components/reusable/TableSkeleton";
import TableActionButton from "@/components/reusable/TableActionButton";
import { useStaffList, useUpdateStaff, useToggleStaffStatus } from "@/api/hooks";
import { toast } from "sonner";

const AllStaffs = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingStaff, setEditingStaff] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: staffData, isLoading, error } = useStaffList({
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });
  const updateStaff = useUpdateStaff();
  const toggleStaffStatus = useToggleStaffStatus();

  const staffList = staffData?.staff || [];

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to fetch staff");
    }
  }, [error]);

  const handleEditClick = (staff) => {
    setEditingStaff({
      ...staff,
      name: `${staff.first_name || ""} ${staff.middle_name || ""} ${staff.last_name || ""}`.trim(),
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingStaff) return;

    // Parse name into first/middle/last
    const nameParts = editingStaff.name.split(" ");
    const first_name = nameParts[0] || "";
    const last_name = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
    const middle_name = nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "";

    updateStaff.mutate(
      {
        id: editingStaff.id,
        data: {
          first_name,
          middle_name,
          last_name,
          email: editingStaff.email,
          phone_number: editingStaff.phone_number,
          role: editingStaff.role,
        },
      },
      {
        onSuccess: () => {
          toast.success("Staff updated");
          setIsEditDialogOpen(false);
          setEditingStaff(null);
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleToggleStatus = (staff) => {
    const newStatus = staff.status === "active" ? "inactive" : "active";
    toggleStaffStatus.mutate(
      { id: staff.id, status: newStatus },
      {
        onSuccess: () => toast.success(`Staff ${newStatus === "active" ? "activated" : "deactivated"}`),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  // Get full name helper
  const getFullName = (staff) => {
    return `${staff.first_name || ""} ${staff.middle_name || ""} ${staff.last_name || ""}`.trim() || "N/A";
  };

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Staff Management"
        description="Manage all staff members and their assignments"
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-sm">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name or email"
            className="pl-10 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-auto min-w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link to="/staffs/add">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Staff
            </Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} columns={7} />
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 dark:bg-gray-800">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="w-16 text-center"></TableHead>
              </TableRow>
            </TableHeader>

            {staffList.length === 0 ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={7} className="p-6 text-center">
                    <DataNotFound item="staff members" />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {staffList.map((staff) => (
                  <TableRow key={staff.id} className="group">
                    <TableCell className="font-medium">{staff.name || getFullName(staff)}</TableCell>
                    <TableCell>{staff.email}</TableCell>
                    <TableCell>{staff.phone}</TableCell>
                    <TableCell>{staff.role}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(staff.subject_names || []).map((subject, idx) => (
                          <Badge key={idx} variant="outline">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={staff.status === "active" ? "default" : "destructive"}
                      >
                        {staff.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <TableActionButton />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClick(staff)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(staff)}>
                            <UserX className="mr-2 h-4 w-4" />
                            {staff.status === "active" ? "Set Inactive" : "Set Active"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </div>
      )}

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
                  value={editingStaff.name}
                  onChange={(e) =>
                    setEditingStaff({ ...editingStaff, name: e.target.value })
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
                  value={editingStaff.phone_number}
                  onChange={(e) =>
                    setEditingStaff({ ...editingStaff, phone_number: e.target.value })
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
            <Button onClick={handleSaveEdit} disabled={updateStaff.isPending}>
              {updateStaff.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllStaffs;
