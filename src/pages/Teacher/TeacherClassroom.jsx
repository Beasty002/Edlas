import { useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    BookOpen,
    Users,
    FileText,
    CheckCircle,
    Clock,
    ChevronRight,
    GraduationCap,
} from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import {
    mockTeacherAssignments,
    mockAssignments,
    mockSubmissions,
    mockStudents,
    mockClassSubjects,
} from "@/data/mockData";

const cardStyles = [
    { border: "border-l-emerald-500", iconBg: "bg-emerald-100 dark:bg-emerald-900/30", iconColor: "text-emerald-600 dark:text-emerald-400" },
    { border: "border-l-sky-500", iconBg: "bg-sky-100 dark:bg-sky-900/30", iconColor: "text-sky-600 dark:text-sky-400" },
    { border: "border-l-violet-500", iconBg: "bg-violet-100 dark:bg-violet-900/30", iconColor: "text-violet-600 dark:text-violet-400" },
    { border: "border-l-amber-500", iconBg: "bg-amber-100 dark:bg-amber-900/30", iconColor: "text-amber-600 dark:text-amber-400" },
    { border: "border-l-rose-400", iconBg: "bg-rose-100 dark:bg-rose-900/30", iconColor: "text-rose-500 dark:text-rose-400" },
    { border: "border-l-teal-500", iconBg: "bg-teal-100 dark:bg-teal-900/30", iconColor: "text-teal-600 dark:text-teal-400" },
];

const TeacherClassroom = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const teacherId = 1;

    const teacherClasses = useMemo(() => {
        const assignments = mockTeacherAssignments.filter(
            (ta) => ta.teacher === teacherId
        );

        const classMap = new Map();

        assignments.forEach((assignment) => {
            const key = `${assignment.classroom_name}-${assignment.section}-${assignment.class_subject_code}`;

            if (!classMap.has(key)) {
                const classSubject = mockClassSubjects.find(
                    (cs) => cs.id === assignment.class_subject
                );

                const classAssignments = mockAssignments.filter(
                    (a) =>
                        a.classSubjectId === assignment.class_subject &&
                        a.section === assignment.section
                );

                const students = mockStudents.filter(
                    (s) =>
                        s.student_class === assignment.classroom_name &&
                        s.section === assignment.section &&
                        s.status === "active"
                );

                let totalSubmissions = 0;
                let pendingGrading = 0;
                classAssignments.forEach((a) => {
                    const subs = mockSubmissions.filter((s) => s.assignmentId === a.id);
                    totalSubmissions += subs.length;
                    pendingGrading += subs.filter((s) => s.status === "submitted" && !s.grade).length;
                });

                classMap.set(key, {
                    id: key,
                    classSubjectId: assignment.class_subject,
                    className: assignment.classroom_name,
                    section: assignment.section,
                    subjectCode: assignment.class_subject_code,
                    subjectName: classSubject?.subject_name || "Unknown",
                    totalStudents: students.length,
                    totalAssignments: classAssignments.length,
                    totalSubmissions,
                    pendingGrading,
                });
            }
        });

        return Array.from(classMap.values());
    }, [teacherId]);

    const handleCardClick = (classData) => {
        navigate(`/classroom/${classData.classSubjectId}?section=${classData.section}`);
    };

    const stats = useMemo(() => {
        return {
            totalClasses: teacherClasses.length,
            totalAssignments: teacherClasses.reduce((sum, c) => sum + c.totalAssignments, 0),
            totalSubmissions: teacherClasses.reduce((sum, c) => sum + c.totalSubmissions, 0),
            pendingGrading: teacherClasses.reduce((sum, c) => sum + c.pendingGrading, 0),
        };
    }, [teacherClasses]);

    return (
        <div className="w-full space-y-6">
            <PageHeader
                title="My Classroom"
                description="Manage assignments and track student submissions"
            />

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                            <GraduationCap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">{stats.totalClasses}</p>
                            <p className="text-xs text-gray-500">Classes</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">{stats.totalAssignments}</p>
                            <p className="text-xs text-gray-500">Assignments</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">{stats.totalSubmissions}</p>
                            <p className="text-xs text-gray-500">Submissions</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">{stats.pendingGrading}</p>
                            <p className="text-xs text-gray-500">Needs Review</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section Label */}
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">
                Your classes ({teacherClasses.length})
            </p>

            {/* Class Cards */}
            <div className="space-y-3">
                {teacherClasses.map((classData, index) => {
                    const style = cardStyles[index % cardStyles.length];
                    return (
                        <Card
                            key={classData.id}
                            className={`cursor-pointer bg-white dark:bg-gray-800 border-l-4 ${style.border} hover:shadow-sm transition-shadow`}
                            onClick={() => handleCardClick(classData)}
                        >
                            <CardContent className="p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className={`hidden sm:block p-2 ${style.iconBg} rounded-lg`}>
                                            <BookOpen className={`h-5 w-5 ${style.iconColor}`} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                                    {classData.subjectName}
                                                </h3>
                                                <Badge variant="outline" className="text-xs font-normal">
                                                    {classData.subjectCode}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                <span>Class {classData.className} • Sec {classData.section}</span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="h-3.5 w-3.5" />
                                                    {classData.totalStudents}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex gap-4 text-sm">
                                            <div className="text-center">
                                                <p className="font-medium text-gray-900 dark:text-gray-100">{classData.totalAssignments}</p>
                                                <p className="text-xs text-gray-500">Tasks</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="font-medium text-emerald-600">{classData.totalSubmissions}</p>
                                                <p className="text-xs text-gray-500">Done</p>
                                            </div>
                                            {classData.pendingGrading > 0 && (
                                                <div className="text-center">
                                                    <p className="font-medium text-amber-600">{classData.pendingGrading}</p>
                                                    <p className="text-xs text-gray-500">Review</p>
                                                </div>
                                            )}
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
            {teacherClasses.length === 0 && (
                <div className="text-center py-16">
                    <BookOpen className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">No classes assigned</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Contact the administrator to get assigned to classes.
                    </p>
                </div>
            )}
        </div>
    );
};

export default TeacherClassroom;
