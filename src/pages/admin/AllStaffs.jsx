import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Edit, UserX, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import DataNotFound from "@/components/reusable/DataNotFound";
import TableActionButton from "@/components/reusable/TableActionButton";
import { mockStaff, mockSubjects } from "@/data/mockData";
import { toast } from "sonner";

const AllStaffs = () => {
  const [editingStaff, setEditingStaff] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [staffList, setStaffList] = useState(mockStaff);

  // Get subject names for a staff member
  const getSubjectNames = (subjectIds) => {
    return subjectIds.map((id) => {
      const subject = mockSubjects.find((s) => s.id === id);
      return subject ? subject.name : "Unknown";
    });
  };

  const handleEditClick = (staff) => {
    setEditingStaff({ ...staff });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingStaff) return;

    setStaffList((prev) =>
      prev.map((s) => (s.id === editingStaff.id ? editingStaff : s))
    );
    toast.success("Staff updated");
    setIsEditDialogOpen(false);
    setEditingStaff(null);
  };

  const handleToggleStatus = (staff) => {
    const newStatus = staff.status === "active" ? "inactive" : "active";
    setStaffList((prev) =>
      prev.map((s) => (s.id === staff.id ? { ...s, status: newStatus } : s))
    );
    toast.success(
      `Staff ${newStatus === "active" ? "activated" : "deactivated"}`
    );
  };

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Staff Management"
        description="Manage all staff members and their assignments"
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-sm">
        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
          <Link to="/staffs/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Staff
          </Link>
        </Button>
      </div>

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
                  <TableCell className="font-medium">
                    {staff.full_name}
                  </TableCell>
                  <TableCell>{staff.email}</TableCell>
                  <TableCell>{staff.phone}</TableCell>
                  <TableCell>{staff.role}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {getSubjectNames(staff.subjects).map((subject, idx) => (
                        <Badge key={idx} variant="outline">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        staff.status === "active" ? "default" : "destructive"
                      }
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
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(staff)}
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          {staff.status === "active"
                            ? "Set Inactive"
                            : "Set Active"}
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
