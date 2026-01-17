import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    Calendar,
    Clock,
    CheckCircle,
    AlertTriangle,
    FileText,
    Upload,
    ExternalLink,
    Award,
} from "lucide-react";
import {
    mockAssignments,
    mockSubmissions,
    mockClassSubjects,
    mockTeacherAssignments,
    mockStaff,
} from "@/data/mockData";
import { format, isPast, differenceInDays, differenceInHours } from "date-fns";
import SubmitAssignmentModal from "./components/SubmitAssignmentModal";

const StudentAssignmentList = () => {
    const { subjectId } = useParams();
    const navigate = useNavigate();

    // For demo, student class 10, section A
    const studentSection = "A";
    const studentId = 1;

    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    const classSubject = useMemo(() => {
        return mockClassSubjects.find((cs) => cs.id === parseInt(subjectId));
    }, [subjectId]);

    const teacher = useMemo(() => {
        const ta = mockTeacherAssignments.find(
            (t) => t.class_subject === parseInt(subjectId) && t.section === studentSection
        );
        return ta ? mockStaff.find((s) => s.id === ta.teacher) : null;
    }, [subjectId, studentSection]);

    const assignments = useMemo(() => {
        return mockAssignments.filter(
            (a) => a.classSubjectId === parseInt(subjectId) && a.section === studentSection
        );
    }, [subjectId, studentSection]);

    const getSubmission = (assignmentId) => {
        return mockSubmissions.find(
            (s) => s.assignmentId === assignmentId && s.studentId === studentId
        );
    };

    const getAssignmentStatus = (assignment) => {
        const submission = getSubmission(assignment.id);
        const now = new Date();
        const dueDate = new Date(assignment.dueDate);
        const lateDeadline = assignment.lateDeadline ? new Date(assignment.lateDeadline) : null;

        if (submission) {
            if (submission.grade !== null) {
                return {
                    type: "graded",
                    label: `Graded: ${submission.grade}/${assignment.totalMarks}`,
                    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                    icon: Award,
                };
            }
            return {
                type: "submitted",
                label: "Submitted",
                color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                icon: CheckCircle,
            };
        }

        if (isPast(dueDate)) {
            if (assignment.allowLateSubmission && lateDeadline && !isPast(lateDeadline)) {
                const hoursLeft = differenceInHours(lateDeadline, now);
                return {
                    type: "late",
                    label: hoursLeft < 24 ? `${hoursLeft}h left (late)` : `${differenceInDays(lateDeadline, now)}d left (late)`,
                    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                    icon: AlertTriangle,
                };
            }
            return {
                type: "overdue",
                label: "Overdue",
                color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                icon: AlertTriangle,
            };
        }

        const daysLeft = differenceInDays(dueDate, now);
        const hoursLeft = differenceInHours(dueDate, now);

        if (daysLeft <= 1) {
            return {
                type: "urgent",
                label: hoursLeft < 24 ? `${hoursLeft}h left` : `${daysLeft}d left`,
                color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                icon: Clock,
            };
        }

        return {
            type: "pending",
            label: `${daysLeft} days left`,
            color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
            icon: Clock,
        };
    };

    const handleSubmit = (assignment) => {
        setSelectedAssignment(assignment);
        setIsSubmitModalOpen(true);
    };

    const handleSubmitAssignment = (data) => {
        console.log("Submitting:", data);
        setIsSubmitModalOpen(false);
        // In real app, would add to submissions
    };

    // Sort assignments: pending first, then by due date
    const sortedAssignments = useMemo(() => {
        return [...assignments].sort((a, b) => {
            const aSubmitted = !!getSubmission(a.id);
            const bSubmitted = !!getSubmission(b.id);
            if (aSubmitted !== bSubmitted) return aSubmitted ? 1 : -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
        });
    }, [assignments]);

    return (
        <div className="space-y-6 w-full">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/my-classroom")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <PageHeader
                    title={classSubject?.subject_name || "Subject"}
                    description={`${classSubject?.subject_code} • Taught by ${teacher?.full_name || "TBA"}`}
                />
            </div>

            {/* Assignment List */}
            <div className="space-y-4">
                {sortedAssignments.map((assignment) => {
                    const status = getAssignmentStatus(assignment);
                    const StatusIcon = status.icon;
                    const submission = getSubmission(assignment.id);
                    const isSubmitted = !!submission;

                    return (
                        <Card
                            key={assignment.id}
                            className={`overflow-hidden transition-all hover:shadow-md ${status.type === "overdue" ? "border-red-200 dark:border-red-800" : ""
                                }`}
                        >
                            <CardContent className="p-0">
                                <div className="flex">
                                    {/* Left colored bar */}
                                    <div
                                        className={`w-1.5 ${status.type === "graded"
                                                ? "bg-green-500"
                                                : status.type === "submitted"
                                                    ? "bg-blue-500"
                                                    : status.type === "overdue"
                                                        ? "bg-red-500"
                                                        : status.type === "urgent" || status.type === "late"
                                                            ? "bg-amber-500"
                                                            : "bg-gray-300"
                                            }`}
                                    />

                                    <div className="flex-1 p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    <h3 className="font-semibold text-lg">{assignment.title}</h3>
                                                    <Badge className={status.color}>
                                                        <StatusIcon className="h-3 w-3 mr-1" />
                                                        {status.label}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                    {assignment.description}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-4 text-sm">
                                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                                        <Calendar className="h-4 w-4" />
                                                        Due: {format(new Date(assignment.dueDate), "MMM d, yyyy 'at' h:mm a")}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                                        <Award className="h-4 w-4" />
                                                        {assignment.totalMarks} marks
                                                    </div>
                                                    {assignment.allowLateSubmission && (
                                                        <Badge variant="outline" className="text-xs">
                                                            Late submission allowed
                                                        </Badge>
                                                    )}
                                                </div>

                                                {assignment.attachmentUrl && (
                                                    <a
                                                        href={assignment.attachmentUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-blue-600 hover:underline text-sm mt-2"
                                                    >
                                                        <FileText className="h-4 w-4" />
                                                        View Attachment
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                )}

                                                {/* Submission info */}
                                                {submission && (
                                                    <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                                                        <p className="text-xs text-muted-foreground mb-1">Your submission</p>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <FileText className="h-4 w-4 text-blue-500" />
                                                                <span className="text-sm font-medium">{submission.fileName}</span>
                                                            </div>
                                                            <span className="text-xs text-muted-foreground">
                                                                {format(new Date(submission.submittedAt), "MMM d 'at' h:mm a")}
                                                            </span>
                                                        </div>
                                                        {submission.feedback && (
                                                            <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded text-sm">
                                                                <p className="text-xs text-green-600 font-medium mb-1">Teacher Feedback:</p>
                                                                <p className="text-green-700 dark:text-green-400">{submission.feedback}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action button */}
                                            <div className="shrink-0">
                                                {!isSubmitted && status.type !== "overdue" ? (
                                                    <Button
                                                        className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                                                        onClick={() => handleSubmit(assignment)}
                                                    >
                                                        <Upload className="h-4 w-4" />
                                                        Submit
                                                    </Button>
                                                ) : isSubmitted && status.type !== "graded" ? (
                                                    <Button
                                                        variant="outline"
                                                        className="gap-2"
                                                        onClick={() => handleSubmit(assignment)}
                                                    >
                                                        <Upload className="h-4 w-4" />
                                                        Resubmit
                                                    </Button>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}

                {assignments.length === 0 && (
                    <Card className="p-12 text-center">
                        <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Assignments Yet</h3>
                        <p className="text-muted-foreground">
                            Your teacher hasn't posted any assignments for this subject yet.
                        </p>
                    </Card>
                )}
            </div>

            <SubmitAssignmentModal
                open={isSubmitModalOpen}
                onOpenChange={setIsSubmitModalOpen}
                assignment={selectedAssignment}
                onSubmit={handleSubmitAssignment}
            />
        </div>
    );
};

export default StudentAssignmentList;
