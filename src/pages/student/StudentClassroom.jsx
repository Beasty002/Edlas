import { useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    BookOpen,
    FileText,
    CheckCircle,
    Clock,
    ChevronRight,
    AlertTriangle,
    User,
} from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import {
    mockClassSubjects,
    mockTeacherAssignments,
    mockAssignments,
    mockSubmissions,
    mockStaff,
} from "@/data/mockData";

const cardStyles = [
    { border: "border-l-sky-500", iconBg: "bg-sky-100 dark:bg-sky-900/30", iconColor: "text-sky-600 dark:text-sky-400" },
    { border: "border-l-emerald-500", iconBg: "bg-emerald-100 dark:bg-emerald-900/30", iconColor: "text-emerald-600 dark:text-emerald-400" },
    { border: "border-l-violet-500", iconBg: "bg-violet-100 dark:bg-violet-900/30", iconColor: "text-violet-600 dark:text-violet-400" },
    { border: "border-l-amber-500", iconBg: "bg-amber-100 dark:bg-amber-900/30", iconColor: "text-amber-600 dark:text-amber-400" },
    { border: "border-l-rose-400", iconBg: "bg-rose-100 dark:bg-rose-900/30", iconColor: "text-rose-500 dark:text-rose-400" },
    { border: "border-l-teal-500", iconBg: "bg-teal-100 dark:bg-teal-900/30", iconColor: "text-teal-600 dark:text-teal-400" },
    { border: "border-l-indigo-500", iconBg: "bg-indigo-100 dark:bg-indigo-900/30", iconColor: "text-indigo-600 dark:text-indigo-400" },
];

const StudentClassroom = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const studentClass = "10";
    const studentSection = "A";
    const studentId = 1;

    const subjects = useMemo(() => {
        const classSubjects = mockClassSubjects.filter(
            (cs) => cs.classroom_name === studentClass
        );

        return classSubjects.map((cs, index) => {
            const teacherAssignment = mockTeacherAssignments.find(
                (ta) => ta.class_subject === cs.id && ta.section === studentSection
            );
            const teacher = teacherAssignment
                ? mockStaff.find((s) => s.id === teacherAssignment.teacher)
                : null;

            const assignments = mockAssignments.filter(
                (a) => a.classSubjectId === cs.id && a.section === studentSection
            );

            const submissions = mockSubmissions.filter(
                (s) => s.studentId === studentId && assignments.some((a) => a.id === s.assignmentId)
            );

            const now = new Date();
            const pending = assignments.filter((a) => {
                const hasSubmitted = submissions.some((s) => s.assignmentId === a.id);
                return !hasSubmitted;
            });
            const overdue = pending.filter((a) => new Date(a.dueDate) < now);
            const upcoming = pending.filter((a) => new Date(a.dueDate) >= now);

            return {
                id: cs.id,
                subjectCode: cs.subject_code,
                subjectName: cs.subject_name,
                teacherName: teacher?.full_name || "Not Assigned",
                totalAssignments: assignments.length,
                submitted: submissions.length,
                pending: pending.length,
                overdue: overdue.length,
                upcoming: upcoming.length,
                colorIndex: index,
            };
        });
    }, [studentClass, studentSection, studentId]);

    const overallStats = useMemo(() => {
        return {
            totalSubjects: subjects.length,
            totalAssignments: subjects.reduce((sum, s) => sum + s.totalAssignments, 0),
            totalSubmitted: subjects.reduce((sum, s) => sum + s.submitted, 0),
            totalPending: subjects.reduce((sum, s) => sum + s.pending, 0),
            totalOverdue: subjects.reduce((sum, s) => sum + s.overdue, 0),
        };
    }, [subjects]);

    const handleCardClick = (subject) => {
        navigate(`/my-classroom/${subject.id}`);
    };

    return (
        <div className="w-full space-y-6">
            <PageHeader
                title="My Classroom"
                description={`Class ${studentClass} • Section ${studentSection}`}
            />

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">{overallStats.totalAssignments}</p>
                            <p className="text-xs text-gray-500">Total</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">{overallStats.totalSubmitted}</p>
                            <p className="text-xs text-gray-500">Submitted</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">{overallStats.totalPending}</p>
                            <p className="text-xs text-gray-500">Pending</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">{overallStats.totalOverdue}</p>
                            <p className="text-xs text-gray-500">Overdue</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section Label */}
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">
                Your subjects ({subjects.length})
            </p>

            {/* Subject Cards - List Layout */}
            <div className="space-y-3">
                {subjects.map((subject) => {
                    const style = cardStyles[subject.colorIndex % cardStyles.length];
                    return (
                        <Card
                            key={subject.id}
                            className={`cursor-pointer bg-white dark:bg-gray-800 border-l-4 ${style.border} hover:shadow-sm transition-shadow`}
                            onClick={() => handleCardClick(subject)}
                        >
                            <CardContent className="p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex items-start gap-4 min-w-0">
                                        <div className={`hidden sm:block p-2 ${style.iconBg} rounded-lg mt-0.5`}>
                                            <BookOpen className={`h-5 w-5 ${style.iconColor}`} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                                    {subject.subjectName}
                                                </h3>
                                                <Badge variant="outline" className="text-xs font-normal">
                                                    {subject.subjectCode}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                <User className="h-3.5 w-3.5" />
                                                <span>{subject.teacherName}</span>
                                            </div>
                                            {subject.overdue > 0 && (
                                                <div className="flex items-center gap-1.5 mt-2 text-sm text-red-600 dark:text-red-400">
                                                    <AlertTriangle className="h-3.5 w-3.5" />
                                                    <span>{subject.overdue} overdue</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex gap-5 text-sm">
                                            <div className="text-center">
                                                <p className="font-medium text-emerald-600">{subject.submitted}</p>
                                                <p className="text-xs text-gray-500">Done</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="font-medium text-amber-600">{subject.upcoming}</p>
                                                <p className="text-xs text-gray-500">Pending</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="font-medium text-gray-900 dark:text-gray-100">{subject.totalAssignments}</p>
                                                <p className="text-xs text-gray-500">Total</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Empty State */}
            {subjects.length === 0 && (
                <div className="text-center py-16">
                    <BookOpen className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">No subjects found</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        You don't have any subjects assigned to your class yet.
                    </p>
                </div>
            )}
        </div>
    );
};

export default StudentClassroom;
