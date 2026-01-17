import { useState, useMemo } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    User,
    CheckCircle,
    Clock,
    AlertCircle,
    FileText,
    ExternalLink,
    X,
    Save,
} from "lucide-react";
import { mockSubmissions } from "@/data/mockData";
import { format } from "date-fns";

const ViewSubmissionsModal = ({ open, onOpenChange, assignment, students }) => {
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [gradeData, setGradeData] = useState({ grade: "", feedback: "" });

    const submissions = useMemo(() => {
        if (!assignment) return [];
        return mockSubmissions.filter((s) => s.assignmentId === assignment.id);
    }, [assignment]);

    const studentSubmissions = useMemo(() => {
        if (!students || !assignment) return [];

        return students.map((student) => {
            const submission = submissions.find((s) => s.studentId === student.id);
            return {
                student,
                submission,
                status: submission
                    ? submission.grade !== null
                        ? "graded"
                        : "submitted"
                    : "pending",
            };
        });
    }, [students, submissions, assignment]);

    const stats = useMemo(() => {
        return {
            total: studentSubmissions.length,
            submitted: studentSubmissions.filter((s) => s.status !== "pending").length,
            graded: studentSubmissions.filter((s) => s.status === "graded").length,
            pending: studentSubmissions.filter((s) => s.status === "pending").length,
        };
    }, [studentSubmissions]);

    const handleSelectSubmission = (item) => {
        if (item.submission) {
            setSelectedSubmission(item);
            setGradeData({
                grade: item.submission.grade || "",
                feedback: item.submission.feedback || "",
            });
        }
    };

    const handleSaveGrade = () => {
        // In real app, this would save to backend
        console.log("Saving grade:", gradeData);
        setSelectedSubmission(null);
    };

    if (!assignment) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col overflow-hidden p-0">
                <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
                    <DialogTitle className="text-xl font-semibold">
                        Submissions: {assignment.title}
                    </DialogTitle>
                    <div className="flex gap-2 mt-2">
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            {stats.submitted}/{stats.total} Submitted
                        </Badge>
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            {stats.graded} Graded
                        </Badge>
                        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            {stats.pending} Pending
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-hidden flex">
                    {/* Student List */}
                    <div className={`${selectedSubmission ? "w-1/2" : "w-full"} border-r overflow-y-auto custom-scrollbar`}>
                        <div className="divide-y">
                            {studentSubmissions.map((item) => (
                                <div
                                    key={item.student.id}
                                    className={`p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors ${selectedSubmission?.student.id === item.student.id
                                            ? "bg-blue-50 dark:bg-blue-900/20"
                                            : ""
                                        }`}
                                    onClick={() => handleSelectSubmission(item)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                            <User className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{item.student.full_name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Roll No: {item.student.roll_no}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {item.status === "graded" ? (
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    {item.submission.grade}/{assignment.totalMarks}
                                                </Badge>
                                            </div>
                                        ) : item.status === "submitted" ? (
                                            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                <Clock className="h-3 w-3 mr-1" />
                                                Submitted
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                                <AlertCircle className="h-3 w-3 mr-1" />
                                                Pending
                                            </Badge>
                                        )}
                                        {item.submission && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {format(new Date(item.submission.submittedAt), "MMM d, h:mm a")}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submission Detail Panel */}
                    {selectedSubmission && (
                        <div className="w-1/2 p-4 overflow-y-auto custom-scrollbar">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">{selectedSubmission.student.full_name}</h3>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedSubmission(null)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-xs text-muted-foreground mb-1">Submitted on</p>
                                    <p className="text-sm font-medium">
                                        {format(new Date(selectedSubmission.submission.submittedAt), "MMM d, yyyy 'at' h:mm a")}
                                    </p>
                                </div>

                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-xs text-muted-foreground mb-2">Submitted File</p>
                                    <a
                                        href={selectedSubmission.submission.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
                                    >
                                        <FileText className="h-4 w-4" />
                                        {selectedSubmission.submission.fileName}
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">
                                        Grade (out of {assignment.totalMarks})
                                    </Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        max={assignment.totalMarks}
                                        value={gradeData.grade}
                                        onChange={(e) => setGradeData({ ...gradeData, grade: e.target.value })}
                                        className="h-11"
                                        placeholder="Enter grade..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Feedback</Label>
                                    <Textarea
                                        value={gradeData.feedback}
                                        onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                                        placeholder="Enter feedback for the student..."
                                        rows={3}
                                        className="resize-none"
                                    />
                                </div>

                                <Button
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                    onClick={handleSaveGrade}
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Grade
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="px-6 py-4 border-t shrink-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ViewSubmissionsModal;
