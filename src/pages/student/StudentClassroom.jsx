import { useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

// Subject card colors for visual variety
const subjectColors = [
    { bg: "from-blue-500 to-blue-600", icon: "bg-blue-600" },
    { bg: "from-purple-500 to-purple-600", icon: "bg-purple-600" },
    { bg: "from-green-500 to-green-600", icon: "bg-green-600" },
    { bg: "from-amber-500 to-amber-600", icon: "bg-amber-600" },
    { bg: "from-rose-500 to-rose-600", icon: "bg-rose-600" },
    { bg: "from-cyan-500 to-cyan-600", icon: "bg-cyan-600" },
    { bg: "from-indigo-500 to-indigo-600", icon: "bg-indigo-600" },
];

const StudentClassroom = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    // For demo, we'll use student class 10, section A (Aarav Sharma)
    const studentClass = "10";
    const studentSection = "A";
    const studentId = 1;

    const subjects = useMemo(() => {
        // Get subjects for student's class
        const classSubjects = mockClassSubjects.filter(
            (cs) => cs.classroom_name === studentClass
        );

        return classSubjects.map((cs, index) => {
            // Get teacher for this subject-section
            const teacherAssignment = mockTeacherAssignments.find(
                (ta) => ta.class_subject === cs.id && ta.section === studentSection
            );
            const teacher = teacherAssignment
                ? mockStaff.find((s) => s.id === teacherAssignment.teacher)
                : null;

            // Get assignments for this subject-section
            const assignments = mockAssignments.filter(
                (a) => a.classSubjectId === cs.id && a.section === studentSection
            );

            // Get student's submissions
            const submissions = mockSubmissions.filter(
                (s) => s.studentId === studentId && assignments.some((a) => a.id === s.assignmentId)
            );

            // Calculate stats
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
                color: subjectColors[index % subjectColors.length],
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
        <div className="space-y-6 w-full">
            <PageHeader
                title="My Classroom"
                description={`Class ${studentClass} - Section ${studentSection} • View and submit your assignments`}
            />

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 bg-blue-500 rounded-lg">
                            <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{overallStats.totalAssignments}</p>
                            <p className="text-xs text-muted-foreground">Total</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 bg-green-500 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{overallStats.totalSubmitted}</p>
                            <p className="text-xs text-muted-foreground">Submitted</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 bg-amber-500 rounded-lg">
                            <Clock className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{overallStats.totalPending}</p>
                            <p className="text-xs text-muted-foreground">Pending</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 bg-red-500 rounded-lg">
                            <AlertTriangle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{overallStats.totalOverdue}</p>
                            <p className="text-xs text-muted-foreground">Overdue</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Subject Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map((subject) => (
                    <Card
                        key={subject.id}
                        className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 border-0"
                        onClick={() => handleCardClick(subject)}
                    >
                        {/* Colored Header */}
                        <div className={`bg-gradient-to-r ${subject.color.bg} p-4 text-white`}>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 ${subject.color.icon} rounded-xl bg-white/20`}>
                                        <BookOpen className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{subject.subjectName}</h3>
                                        <p className="text-sm text-white/80">{subject.subjectCode}</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>

                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                                <User className="h-4 w-4" />
                                {subject.teacherName}
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <p className="text-lg font-bold text-green-600">{subject.submitted}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Done</p>
                                </div>
                                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                    <p className="text-lg font-bold text-amber-600">{subject.upcoming}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Pending</p>
                                </div>
                                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                    <p className="text-lg font-bold text-red-600">{subject.overdue}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Overdue</p>
                                </div>
                            </div>

                            {subject.overdue > 0 && (
                                <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                                    <AlertTriangle className="h-4 w-4" />
                                    {subject.overdue} assignment{subject.overdue > 1 ? "s" : ""} overdue!
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {subjects.length === 0 && (
                <Card className="p-12 text-center">
                    <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Subjects Found</h3>
                    <p className="text-muted-foreground">
                        You don't have any subjects assigned to your class yet.
                    </p>
                </Card>
            )}
        </div>
    );
};

export default StudentClassroom;
