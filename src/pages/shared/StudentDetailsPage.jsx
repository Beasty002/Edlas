import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, BookOpen, Users } from "lucide-react";
import { baseRequest } from "@/api/api";
import { getErrorMessage } from "@/utils/helper";
import { format } from "date-fns";

const fetchStudentDetails = async (id) => {
  const res = await baseRequest({
    url: `/system/students/${id}/`,
    method: "GET",
  });
  if (!res.ok) {
    throw { response: { data: res.data, status: res.status } };
  }
  return res.data;
};

const dummyMarks = [
  { subject: "Mathematics", theory: 50, practical: 30, fullMarks: 80, grade: "A" },
  { subject: "English", theory: 45, practical: 20, fullMarks: 65, grade: "A+" },
  { subject: "Science", theory: 48, practical: 25, fullMarks: 73, grade: "A" },
  { subject: "Social Studies", theory: 40, practical: 15, fullMarks: 55, grade: "B+" },
  { subject: "Arts", theory: 48, practical: 25, fullMarks: 73, grade: "A" },
];

const StudentDetailsPage = () => {
  const { id } = useParams();
  const [selectedTerm, setSelectedTerm] = useState("1st Term");
  const [search, setSearch] = useState("");

  const {
    data: student,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["student-details", id],
    queryFn: () => fetchStudentDetails(id),
    enabled: !!id,
  });

  const filteredMarks = dummyMarks.filter((m) =>
    m.subject.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-16">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-muted-foreground">Loading student details...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 dark:text-red-400">
          {getErrorMessage(error, "Failed to load student details.")}
        </p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Student not found.</p>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return format(new Date(dateStr), "MMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  const studentFields = [
    { label: "Roll No", value: student.roll_no },
    { label: "Class", value: `${student.student_class} - ${student.section}` },
    { label: "Gender", value: student.gender },
    { label: "Date of Birth", value: formatDate(student.dob) },
    { label: "Admission Date", value: formatDate(student.admission_date) },
    { label: "Email", value: student.email },
    { label: "Address", value: student.address },
  ];

  return (
    <div className="space-y-6 w-full">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex flex-col items-center gap-3">
              <Avatar className="w-20 h-20">
                {student.avatar_url ? (
                  <AvatarImage src={student.avatar_url} alt={student.full_name} />
                ) : (
                  <AvatarFallback className="text-xl bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                    {student.first_name?.[0]}{student.last_name?.[0]}
                  </AvatarFallback>
                )}
              </Avatar>
              <Badge
                variant="outline"
                className={student.status === "active"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
                }
              >
                {student.status}
              </Badge>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold mb-1">{student.full_name}</h1>
              <p className="text-sm text-muted-foreground mb-4">{student.admission_number}</p>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {studentFields.map((field) => (
                  <div key={field.label} className="min-w-0">
                    <p className="text-xs text-muted-foreground">{field.label}</p>
                    <p className="text-sm font-medium truncate">{field.value || "—"}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4" />
              Parent / Guardian
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {student.father_name && (
              <div className="text-sm">
                <p className="text-muted-foreground text-xs">Father</p>
                <p className="font-medium">{student.father_name}</p>
                {student.father_phone && <p className="text-xs text-muted-foreground">{student.father_phone}</p>}
              </div>
            )}
            {student.mother_name && (
              <div className="text-sm">
                <p className="text-muted-foreground text-xs">Mother</p>
                <p className="font-medium">{student.mother_name}</p>
                {student.mother_phone && <p className="text-xs text-muted-foreground">{student.mother_phone}</p>}
              </div>
            )}
            {student.guardian_name && (
              <div className="text-sm">
                <p className="text-muted-foreground text-xs">Guardian ({student.guardian_relation})</p>
                <p className="font-medium">{student.guardian_name}</p>
                {student.guardian_phone && <p className="text-xs text-muted-foreground">{student.guardian_phone}</p>}
              </div>
            )}
            {!student.father_name && !student.mother_name && !student.guardian_name && (
              <p className="text-sm text-muted-foreground">No information</p>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Academic Results
              </CardTitle>
              <div className="flex gap-2">
                <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                  <SelectTrigger className="w-28 h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["1st Term", "2nd Term", "Final"].map((term) => (
                      <SelectItem key={term} value={term}>{term}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Search..."
                  className="w-32 h-8 text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-center w-20">Theory</TableHead>
                    <TableHead className="text-center w-20">Practical</TableHead>
                    <TableHead className="text-center w-20">Total</TableHead>
                    <TableHead className="text-center w-20">Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMarks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No results found
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {filteredMarks.map((mark, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{mark.subject}</TableCell>
                          <TableCell className="text-center">{mark.theory}</TableCell>
                          <TableCell className="text-center">{mark.practical}</TableCell>
                          <TableCell className="text-center">{mark.fullMarks}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary" className="text-xs">{mark.grade}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-medium bg-muted/50">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-center">{dummyMarks.reduce((a, b) => a + b.theory, 0)}</TableCell>
                        <TableCell className="text-center">{dummyMarks.reduce((a, b) => a + b.practical, 0)}</TableCell>
                        <TableCell className="text-center">{dummyMarks.reduce((a, b) => a + b.fullMarks, 0)}</TableCell>
                        <TableCell className="text-center">
                          <Badge className="text-xs">A</Badge>
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDetailsPage;
