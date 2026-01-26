import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import PageHeader from "../../components/PageHeader";
import { DataGrid } from "@/components/reusable/DataGrid";
import { Search, ArrowUp, ArrowDown, ArrowRightLeft, Loader2 } from "lucide-react";
import { useClassrooms } from "@/context/ClassroomsContext";

const fetchPlacementList = async (studentClass, section) => {
  const res = await baseRequest({
    url: `/system/students/placement-list/?student_class=${studentClass}&section=${section}`,
    method: "GET",
  });

  if (!res.ok) {
    throw { response: { data: res.data, status: res.status } };
  }

  return res.data;
};

const StudentPlacement = () => {
  const [classFilter, setClassFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingSelectedIds, setPendingSelectedIds] = useState([]);

  const queryClient = useQueryClient();
  const { classOptions, getSectionsForClass } = useClassrooms();

  useEffect(() => {
    if (classOptions.length > 0 && !classFilter) {
      const firstClass = classOptions[0].value;
      setClassFilter(firstClass);
      const sections = getSectionsForClass(firstClass);
      if (sections.length > 0) {
        setSectionFilter(sections[0].value);
      }
    }
  }, [classOptions]);

  useEffect(() => {
    if (classFilter) {
      const sections = getSectionsForClass(classFilter);
      if (sections.length > 0 && !sections.find(s => s.value === sectionFilter)) {
        setSectionFilter(sections[0].value);
      }
    }
  }, [classFilter]);

  const {
    data: placementData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["placement-list", classFilter, sectionFilter],
    queryFn: () => fetchPlacementList(classFilter, sectionFilter),
    enabled: !!classFilter && !!sectionFilter, // Only fetch when both filters are set
  });

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
      // Invalidate placement-list query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["placement-list"] });

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

  // Get students from API response and apply local search filter
  const students = placementData?.results || [];
  const filtered = students.filter((s) =>
    search ? s.name.toLowerCase().includes(search.toLowerCase()) : true
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
      field: "placement_status",
      headerText: "Status",
      width: 100,
      template: (student) => (
        <span className={student.placement_status === "Pass" ? "text-green-600" : "text-red-600"}>
          {student.placement_status}
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
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              {classOptions.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sectionFilter} onValueChange={setSectionFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Section" />
            </SelectTrigger>
            <SelectContent>
              {getSectionsForClass(classFilter).map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <h2 className="text-lg font-semibold">
        Showing: Class {classFilter} - Section {sectionFilter}
      </h2>

      {isLoading ? (
        <div className="flex items-center justify-center p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-muted-foreground">Loading students...</span>
        </div>
      ) : isError ? (
        <div className="p-8 text-center bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700 rounded-sm">
          <p className="text-red-600 dark:text-red-400">
            {getErrorMessage(error, "Failed to load placement list. Please try again.")}
          </p>
        </div>
      ) : (
        <DataGrid
          key={`${classFilter}-${sectionFilter}`}
          columns={columns}
          data={filtered}
          actionConfig={actionConfig}
          bulkActionConfig={bulkActionConfig}
          emptyMessage="No students found"
          keyField="id"
        />
      )}

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
