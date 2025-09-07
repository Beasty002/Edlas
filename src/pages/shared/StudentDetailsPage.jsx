import { useState } from "react";
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
import { User, Calendar, School, Phone, Home, Award } from "lucide-react";

const dummyMarks = [
  {
    subject: "Mathematics",
    theory: 50,
    practical: 30,
    fullMarks: 80,
    grade: "A",
  },
  { subject: "English", theory: 45, practical: 20, fullMarks: 65, grade: "A+" },
  { subject: "Science", theory: 48, practical: 25, fullMarks: 73, grade: "A" },
  {
    subject: "Social Studies",
    theory: 40,
    practical: 15,
    fullMarks: 55,
    grade: "B+",
  },
  { subject: "Arts", theory: 48, practical: 25, fullMarks: 73, grade: "A" },
];

const defaultStudentData = {
  admissionNumber: "A001",
  firstName: "John",
  middleName: "M",
  lastName: "Doe",
  dob: "2010/05/12",
  gender: "Male",
  rollNo: "001",
  studentClass: "10",
  section: "A",
  admissionDate: "2019/06/01",
  fatherName: "Mr. Doe",
  fatherPhone: "000-0000-000",
  motherName: "Mrs. Doe",
  motherPhone: "000-0000-001",
  guardianChoice: "Father",
  guardianName: "Mr. Doe",
  guardianRelation: "Father",
  guardianPhone: "000-0000-000",
  address: "City, Country",
  notes: "Excellent student",
  previousSchool: "Generic School",
  avatar: null,
  status: "active",
  totalMarks: 346,
  grade: "A",
  position: 2,
  remarks: "Excellent performance",
};

const StudentDetailsPage = ({ studentData }) => {
  const [selectedClass, setSelectedClass] = useState(
    studentData?.studentClass || "10"
  );
  const [selectedTerm, setSelectedTerm] = useState("1st Term");
  const [search, setSearch] = useState("");

  const studentInfo = studentData || defaultStudentData;
  const filteredMarks = dummyMarks.filter((m) =>
    m.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row gap-2 max-w-8xl mx-auto h-full">
      <Card className="w-full md:w-1/3 flex flex-col items-center p-6 shadow-sm   border ">
        <div className="w-30 h-30 rounded-full bg-gray-200 mb-4 flex items-center justify-center text-3xl font-bold text-gray-600">
          {studentInfo.firstName[0]}
          {studentInfo.lastName[0]}
        </div>
        <CardHeader className="flex justify-center w-full">
          <CardTitle className="text-xl font-bold whitespace-nowrap overflow-hidden text-ellipsis underline">
            {studentInfo.firstName} {studentInfo.middleName}{" "}
            {studentInfo.lastName}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 w-full">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" /> Roll No:{" "}
            <strong>{studentInfo.rollNo}</strong>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" /> DOB:{" "}
            <strong>{studentInfo.dob}</strong>
          </div>
          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-gray-500" /> Class:{" "}
            <strong>
              {studentInfo.studentClass}-{studentInfo.section}
            </strong>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-500" /> Father:{" "}
            <strong>
              {studentInfo.fatherName} ({studentInfo.fatherPhone})
            </strong>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-500" /> Mother:{" "}
            <strong>
              {studentInfo.motherName} ({studentInfo.motherPhone})
            </strong>
          </div>
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-gray-500" /> Address:{" "}
            <strong>{studentInfo.address}</strong>
          </div>
          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-gray-500" /> Previous School:{" "}
            <strong>{studentInfo.previousSchool}</strong>
          </div>
          <Badge
            className={`mt-4 text-center w-full py-2 ${
              studentInfo.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {studentInfo.status === "active"
              ? "Active Student"
              : "Inactive Student"}
          </Badge>
        </CardContent>
      </Card>

      <div className="flex-1 border rounded-md p-4   shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-3 justify-between mb-4">
          <div className="flex flex-col md:flex-row gap-3">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="min-w-[120px]">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {["9", "10", "11", "12"].map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    Class {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedTerm} onValueChange={setSelectedTerm}>
              <SelectTrigger className="min-w-[140px]">
                <SelectValue placeholder="Select Term" />
              </SelectTrigger>
              <SelectContent>
                {["1st Term", "2nd Term", "Final"].map((term) => (
                  <SelectItem key={term} value={term}>
                    {term}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            placeholder="Search Subject"
            className="md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-gray-800">
              <TableHead>Subject</TableHead>
              <TableHead className="text-center">Theory</TableHead>
              <TableHead className="text-center">Practical</TableHead>
              <TableHead className="text-center">Full Marks</TableHead>
              <TableHead className="text-center">Grade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMarks.map((mark, idx) => (
              <TableRow key={idx} className="group">
                <TableCell>{mark.subject}</TableCell>
                <TableCell className="text-center">{mark.theory}</TableCell>
                <TableCell className="text-center">{mark.practical}</TableCell>
                <TableCell className="text-center">{mark.fullMarks}</TableCell>
                <TableCell className="text-center">{mark.grade}</TableCell>
              </TableRow>
            ))}
            <TableRow className="  font-semibold">
              <TableCell>Total / Summary</TableCell>
              <TableCell className="text-center">
                {dummyMarks.reduce((a, b) => a + b.theory, 0)}
              </TableCell>
              <TableCell className="text-center">
                {dummyMarks.reduce((a, b) => a + b.practical, 0)}
              </TableCell>
              <TableCell className="text-center">
                {dummyMarks.reduce((a, b) => a + b.fullMarks, 0)}
              </TableCell>
              <TableCell className="text-center">{studentInfo.grade}</TableCell>
            </TableRow>
            <TableRow className="  font-semibold">
              <TableCell colSpan={5} className="text-left">
                Position: {studentInfo.position} | Remarks:{" "}
                {studentInfo.remarks}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StudentDetailsPage;
