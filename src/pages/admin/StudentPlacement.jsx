import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { baseRequest } from "@/api/api";
import { getErrorMessage } from "@/utils/helper";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
import PageHeader from "../../components/PageHeader";
import { DataGrid } from "@/components/reusable/DataGrid";
import { Search, ArrowUp, ArrowDown, ArrowRightLeft } from "lucide-react";

const dummyStudents = [
  {
    id: "stu-1",
    roll: 1,
    name: "John Doe",
    class: "10",
    section: "A",
    grade: "A",
    status: "Pass",
  },
  {
    id: "stu-2",
    roll: 2,
    name: "Jane Smith",
    class: "10",
    section: "A",
    grade: "F",
    status: "Fail",
  },
  {
    id: "stu-3",
    roll: 3,
    name: "Alice Brown",
    class: "10",
    section: "B",
    grade: "B+",
    status: "Pass",
  },
  {
    id: "stu-4",
    roll: 4,
    name: "Bob Lee",
    class: "9",
    section: "A",
    grade: "D",
    status: "Pass",
  },
];

const StudentPlacement = () => {
  const [students, setStudents] = useState(dummyStudents);
  const [classFilter, setClassFilter] = useState("10");
  const [sectionFilter, setSectionFilter] = useState("A");
  const [search, setSearch] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingSelectedIds, setPendingSelectedIds] = useState([]);

  const queryClient = useQueryClient();

  // Placement API call function
  const placementApiCall = async ({ studentIds, action, targetClass, targetSection }) => {
    const payload = {
      student_ids: studentIds,
      action: action,
      target_class: targetClass,
      target_section: targetSection,
    };

    const res = await baseRequest({
      url: "/system/students/placement/",
      method: "POST",
      body: payload,
    });

    if (!res.ok) {
      throw { response: { data: res.data, status: res.status } };
    }

    return res.data;
  };

  const placementMutation = useMutation({
    mutationFn: placementApiCall,
    onMutate: () => {
      toast.loading("Processing placement...", { id: "placement" });
    },
    onSuccess: (_, variables) => {
      // Invalidate students query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["students"] });

      const count = variables.studentIds.length;
      if (variables.action === "promote") {
        toast.success(`${count} student(s) promoted successfully.`, { id: "placement" });
      } else if (variables.action === "demote") {
        toast.success(`${count} student(s) demoted successfully.`, { id: "placement" });
      } else if (variables.action === "transfer") {
        toast.success(`${count} student(s) transferred to Section ${variables.targetSection}.`, { id: "placement" });
      }

      setPendingSelectedIds([]);
      setSelectedAction("");
      setConfirmOpen(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Placement action failed. Please try again."), { id: "placement" });
    },
  });

  const filtered = students.filter(
    (s) =>
      s.class === classFilter &&
      s.section === sectionFilter &&
      (search ? s.name.toLowerCase().includes(search.toLowerCase()) : true)
  );

  const handleBulkAction = (action, selectedStudents) => {
    if (selectedStudents.length === 0) {
      toast.error("No students selected.");
      return;
    }
    setPendingSelectedIds(selectedStudents.map(s => s.id));
    setSelectedAction(action);
    setConfirmOpen(true);
  };

  const confirmAction = () => {
    // Determine target class and section based on action
    let action = selectedAction;
    let targetClass = classFilter;
    let targetSection = sectionFilter;

    if (selectedAction === "promote") {
      action = "promote";
      targetClass = String(Number(classFilter) + 1);
    } else if (selectedAction === "demote") {
      action = "demote";
      targetClass = String(Number(classFilter) - 1);
    } else if (selectedAction.startsWith("transfer")) {
      action = "transfer";
      targetSection = selectedAction.split("-")[1];
    }

    // Convert IDs to numbers if they're strings like "stu-1"
    const numericIds = pendingSelectedIds.map(id => {
      if (typeof id === "string" && id.startsWith("stu-")) {
        return parseInt(id.replace("stu-", ""), 10);
      }
      return typeof id === "number" ? id : parseInt(id, 10);
    });

    placementMutation.mutate({
      studentIds: numericIds,
      action: action,
      targetClass: targetClass,
      targetSection: targetSection,
    });
  };

  // DataGrid columns
  const columns = [
    { field: "id", headerText: "ID", width: 80 },
    {
      field: "avatar",
      headerText: "Avatar",
      width: 60,
      allowSorting: false,
      template: (student) => (
        <Avatar>
          <AvatarImage
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`}
          />
          <AvatarFallback>{student.name[0]}</AvatarFallback>
        </Avatar>
      ),
    },
    { field: "roll", headerText: "Roll No", width: 80 },
    { field: "name", headerText: "Name", width: 150 },
    { field: "grade", headerText: "Grade", width: 80, textAlign: "Center" },
    {
      field: "status",
      headerText: "Status",
      width: 80,
      template: (student) => (
        <span className={student.status === "Pass" ? "text-green-600" : "text-red-600"}>
          {student.status}
        </span>
      ),
    },
  ];

  // Row actions
  const actionConfig = {
    mode: "dropdown",
    showOnHover: false,
    width: 60,
    actions: [
      {
        label: "Promote",
        icon: <ArrowUp className="h-4 w-4" />,
        onClick: (student) => {
          setPendingSelectedIds([student.id]);
          setSelectedAction("promote");
          setConfirmOpen(true);
        },
      },
      {
        label: "Demote",
        icon: <ArrowDown className="h-4 w-4" />,
        onClick: (student) => {
          setPendingSelectedIds([student.id]);
          setSelectedAction("demote");
          setConfirmOpen(true);
        },
      },
      {
        label: "Transfer to A",
        icon: <ArrowRightLeft className="h-4 w-4" />,
        onClick: (student) => {
          setPendingSelectedIds([student.id]);
          setSelectedAction("transfer-A");
          setConfirmOpen(true);
        },
      },
      {
        label: "Transfer to B",
        icon: <ArrowRightLeft className="h-4 w-4" />,
        onClick: (student) => {
          setPendingSelectedIds([student.id]);
          setSelectedAction("transfer-B");
          setConfirmOpen(true);
        },
      },
      {
        label: "Transfer to C",
        icon: <ArrowRightLeft className="h-4 w-4" />,
        onClick: (student) => {
          setPendingSelectedIds([student.id]);
          setSelectedAction("transfer-C");
          setConfirmOpen(true);
        },
      },
    ],
  };

  // Bulk actions config (checkboxes)
  const bulkActionConfig = {
    enabled: true,
    actions: [
      {
        label: "Promote",
        icon: <ArrowUp className="h-4 w-4" />,
        onClick: (selected) => handleBulkAction("promote", selected),
      },
      {
        label: "Demote",
        icon: <ArrowDown className="h-4 w-4" />,
        onClick: (selected) => handleBulkAction("demote", selected),
      },
      {
        label: "Transfer A",
        icon: <ArrowRightLeft className="h-4 w-4" />,
        onClick: (selected) => handleBulkAction("transfer-A", selected),
      },
      {
        label: "Transfer B",
        icon: <ArrowRightLeft className="h-4 w-4" />,
        onClick: (selected) => handleBulkAction("transfer-B", selected),
      },
      {
        label: "Transfer C",
        icon: <ArrowRightLeft className="h-4 w-4" />,
        onClick: (selected) => handleBulkAction("transfer-C", selected),
      },
    ],
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Placement Management"
        description="View, assign, and manage student placement records."
      />

      <div className="flex flex-col gap-3 flex-wrap md:flex-row md:items-center md:justify-between bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-sm">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name"
            className="w-full pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              {[9, 10, 11, 12].map((c) => (
                <SelectItem key={c} value={String(c)}>
                  Class {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sectionFilter} onValueChange={setSectionFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Section" />
            </SelectTrigger>
            <SelectContent>
              {["A", "B", "C"].map((s) => (
                <SelectItem key={s} value={s}>
                  Section {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <h2 className="text-lg font-semibold">
        Showing: Class {classFilter} - Section {sectionFilter}
      </h2>

      <DataGrid
        key={`${classFilter}-${sectionFilter}`}
        columns={columns}
        data={filtered}
        actionConfig={actionConfig}
        bulkActionConfig={bulkActionConfig}
        emptyMessage="No students found"
        keyField="id"
      />

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Confirm Action
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center text-gray-700 dark:text-gray-200">
            Are you sure you want to {selectedAction.replace("-", " ")}{" "}
            {pendingSelectedIds.length} student(s)?
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={placementMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              className={"bg-blue-600 text-white"}
              disabled={placementMutation.isPending}
            >
              {placementMutation.isPending ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentPlacement;
