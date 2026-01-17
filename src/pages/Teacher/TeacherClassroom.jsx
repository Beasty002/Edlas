import { useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

const TeacherClassroom = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    // Get teacher's assigned class-subjects based on logged in user
    // For demo, we'll use teacher id 1 (Ram Bahadur Sharma) who teaches MATH in multiple classes
    const teacherId = 1; // In real app, this would come from user context

    const teacherClasses = useMemo(() => {
        // Get all assignments for this teacher
        const assignments = mockTeacherAssignments.filter(
            (ta) => ta.teacher === teacherId
        );

        // Group by class-subject and get details
        const classMap = new Map();

        assignments.forEach((assignment) => {
            const key = `${assignment.classroom_name}-${assignment.section}-${assignment.class_subject_code}`;

            if (!classMap.has(key)) {
                const classSubject = mockClassSubjects.find(
                    (cs) => cs.id === assignment.class_subject
                );

                // Get assignments for this class-subject-section
                const classAssignments = mockAssignments.filter(
                    (a) =>
                        a.classSubjectId === assignment.class_subject &&
                        a.section === assignment.section
                );

                // Get total students in this class-section
                const students = mockStudents.filter(
                    (s) =>
                        s.student_class === assignment.classroom_name &&
                        s.section === assignment.section &&
                        s.status === "active"
                );

                // Count submissions for these assignments
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
        <div className="space-y-6 w-full">
            <PageHeader
                title="My Classroom"
                description="Manage assignments and track student submissions across your classes."
            />

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 bg-blue-500 rounded-lg">
                            <GraduationCap className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.totalClasses}</p>
                            <p className="text-xs text-muted-foreground">Classes</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 bg-purple-500 rounded-lg">
                            <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.totalAssignments}</p>
                            <p className="text-xs text-muted-foreground">Assignments</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 bg-green-500 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.totalSubmissions}</p>
                            <p className="text-xs text-muted-foreground">Submissions</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 bg-amber-500 rounded-lg">
                            <Clock className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.pendingGrading}</p>
                            <p className="text-xs text-muted-foreground">To Grade</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Class Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teacherClasses.map((classData) => (
                    <Card
                        key={classData.id}
                        className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-700"
                        onClick={() => handleCardClick(classData)}
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                        <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{classData.subjectName}</CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            Class {classData.className} - Section {classData.section}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="flex items-center gap-2 mb-4">
                                <Badge variant="outline" className="text-xs">
                                    {classData.subjectCode}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                    <Users className="h-3 w-3 mr-1" />
                                    {classData.totalStudents} students
                                </Badge>
                            </div>

                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <p className="text-lg font-semibold">{classData.totalAssignments}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Assignments</p>
                                </div>
                                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <p className="text-lg font-semibold text-green-600">{classData.totalSubmissions}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Submitted</p>
                                </div>
                                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                    <p className="text-lg font-semibold text-amber-600">{classData.pendingGrading}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">To Grade</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {teacherClasses.length === 0 && (
                <Card className="p-12 text-center">
                    <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Classes Assigned</h3>
                    <p className="text-muted-foreground">
                        You don't have any classes assigned yet. Contact the administrator to get assigned to classes.
                    </p>
                </Card>
            )}
        </div>
    );
};

export default TeacherClassroom;
