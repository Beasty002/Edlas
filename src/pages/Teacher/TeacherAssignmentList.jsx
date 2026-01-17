import { useState, useMemo } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataGrid } from "@/components/reusable/DataGrid";
import {
    PlusCircle,
    Eye,
    Edit,
    Trash2,
    ArrowLeft,
    Calendar,
    Clock,
    Users,
    FileText,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import {
    mockAssignments,
    mockSubmissions,
    mockStudents,
    mockClassSubjects,
    mockTeacherAssignments,
} from "@/data/mockData";
import { format, isPast, differenceInDays } from "date-fns";
import { toast } from "sonner";
import CreateAssignmentModal from "./components/CreateAssignmentModal";
import ViewSubmissionsModal from "./components/ViewSubmissionsModal";

const TeacherAssignmentList = () => {
    const { classSubjectId } = useParams();
    const [searchParams] = useSearchParams();
    const section = searchParams.get("section") || "A";
    const navigate = useNavigate();

    const [assignments, setAssignments] = useState(mockAssignments);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSubmissionsModalOpen, setIsSubmissionsModalOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [editingAssignment, setEditingAssignment] = useState(null);

    const classSubject = useMemo(() => {
        return mockClassSubjects.find((cs) => cs.id === parseInt(classSubjectId));
    }, [classSubjectId]);

    const filteredAssignments = useMemo(() => {
        return assignments.filter(
            (a) =>
                a.classSubjectId === parseInt(classSubjectId) && a.section === section
        );
    }, [assignments, classSubjectId, section]);

    const students = useMemo(() => {
        return mockStudents.filter(
            (s) =>
                s.student_class === classSubject?.classroom_name &&
                s.section === section &&
                s.status === "active"
        );
    }, [classSubject, section]);

    const getSubmissionStats = (assignmentId) => {
        const subs = mockSubmissions.filter((s) => s.assignmentId === assignmentId);
        return {
            submitted: subs.length,
            graded: subs.filter((s) => s.grade !== null).length,
            pending: students.length - subs.length,
        };
    };

    const getDeadlineStatus = (dueDate, allowLate, lateDeadline) => {
        const due = new Date(dueDate);
        const now = new Date();
        const daysLeft = differenceInDays(due, now);

        if (isPast(due)) {
            if (allowLate && lateDeadline && !isPast(new Date(lateDeadline))) {
                return { label: "Late submission open", variant: "warning", icon: AlertCircle };
            }
            return { label: "Closed", variant: "destructive", icon: AlertCircle };
        }
        if (daysLeft <= 2) {
            return { label: `${daysLeft}d left`, variant: "warning", icon: Clock };
        }
        return { label: `${daysLeft}d left`, variant: "default", icon: Clock };
    };

    const handleViewSubmissions = (assignment) => {
        setSelectedAssignment(assignment);
        setIsSubmissionsModalOpen(true);
    };

    const handleEdit = (assignment) => {
        setEditingAssignment(assignment);
        setIsCreateModalOpen(true);
    };

    const handleDelete = (assignment) => {
        setAssignments((prev) => prev.filter((a) => a.id !== assignment.id));
        toast.success("Assignment deleted");
    };

    const handleSave = (assignmentData) => {
        if (editingAssignment) {
            setAssignments((prev) =>
                prev.map((a) =>
                    a.id === editingAssignment.id ? { ...a, ...assignmentData } : a
                )
            );
            toast.success("Assignment updated");
            setEditingAssignment(null);
        } else {
            const newId = Math.max(...assignments.map((a) => a.id), 0) + 1;
            setAssignments((prev) => [
                {
                    id: newId,
                    classSubjectId: parseInt(classSubjectId),
                    classSubjectCode: classSubject?.subject_code,
                    className: classSubject?.classroom_name,
                    section: section,
                    subjectName: classSubject?.subject_name,
                    createdBy: 1,
                    createdByName: "Ram Bahadur Sharma",
                    createdAt: new Date().toISOString(),
                    status: "active",
                    ...assignmentData,
                },
                ...prev,
            ]);
            toast.success("Assignment created");
        }
        setIsCreateModalOpen(false);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
        setEditingAssignment(null);
    };

    const columns = [
        {
            field: "title",
            headerText: "Assignment",
            width: 300,
            template: (row) => (
                <div>
                    <p className="font-medium truncate max-w-[280px]" title={row.title}>
                        {row.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate max-w-[280px]">
                        {row.description}
                    </p>
                </div>
            ),
        },
        {
            field: "dueDate",
            headerText: "Deadline",
            width: 150,
            template: (row) => {
                const status = getDeadlineStatus(row.dueDate, row.allowLateSubmission, row.lateDeadline);
                const StatusIcon = status.icon;
                return (
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            {format(new Date(row.dueDate), "MMM d, h:mm a")}
                        </div>
                        <Badge
                            variant={status.variant}
                            className={`text-xs ${status.variant === "warning"
                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                    : status.variant === "destructive"
                                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                }`}
                        >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                        </Badge>
                    </div>
                );
            },
        },
        {
            field: "submissions",
            headerText: "Submissions",
            width: 160,
            template: (row) => {
                const stats = getSubmissionStats(row.id);
                return (
                    <div className="flex items-center gap-3">
                        <div className="text-center">
                            <p className="text-lg font-semibold text-green-600">{stats.submitted}</p>
                            <p className="text-[10px] text-muted-foreground">Submitted</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-semibold text-amber-600">{stats.pending}</p>
                            <p className="text-[10px] text-muted-foreground">Pending</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-semibold text-blue-600">{stats.graded}</p>
                            <p className="text-[10px] text-muted-foreground">Graded</p>
                        </div>
                    </div>
                );
            },
        },
        {
            field: "totalMarks",
            headerText: "Marks",
            width: 80,
            textAlign: "Center",
            template: (row) => (
                <Badge variant="outline" className="text-sm font-medium">
                    {row.totalMarks}
                </Badge>
            ),
        },
        {
            field: "allowLateSubmission",
            headerText: "Late",
            width: 70,
            textAlign: "Center",
            template: (row) => (
                row.allowLateSubmission ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                ) : (
                    <span className="text-muted-foreground">—</span>
                )
            ),
        },
    ];

    const actionConfig = {
        mode: "dropdown",
        showOnHover: false,
        width: 60,
        actions: [
            {
                label: "View Submissions",
                icon: <Users className="h-4 w-4" />,
                onClick: handleViewSubmissions,
            },
            {
                label: "Edit",
                icon: <Edit className="h-4 w-4" />,
                onClick: handleEdit,
            },
            {
                label: "Delete",
                icon: <Trash2 className="h-4 w-4" />,
                onClick: handleDelete,
                variant: "destructive",
            },
        ],
    };

    return (
        <div className="space-y-6 w-full">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/classroom")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <PageHeader
                    title={`${classSubject?.subject_name || "Subject"} Assignments`}
                    description={`Class ${classSubject?.classroom_name || ""} - Section ${section} • ${students.length} students`}
                />
            </div>

            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="py-1.5">
                        <FileText className="h-4 w-4 mr-1" />
                        {filteredAssignments.length} Assignments
                    </Badge>
                </div>
                <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Assignment
                </Button>
            </div>

            <DataGrid
                columns={columns}
                data={filteredAssignments}
                actionConfig={actionConfig}
                emptyMessage="No assignments yet. Create your first assignment!"
                keyField="id"
            />

            <CreateAssignmentModal
                open={isCreateModalOpen}
                onOpenChange={handleCloseCreateModal}
                onSave={handleSave}
                editData={editingAssignment}
            />

            <ViewSubmissionsModal
                open={isSubmissionsModalOpen}
                onOpenChange={setIsSubmissionsModalOpen}
                assignment={selectedAssignment}
                students={students}
            />
        </div>
    );
};

export default TeacherAssignmentList;
