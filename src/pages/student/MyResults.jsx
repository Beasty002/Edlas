import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Calendar, BookOpen, Award, TrendingUp } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const studentResults = [
  {
    id: 1,
    examName: "First Term Examination",
    year: "2024",
    class: "10",
    section: "A",
    date: "2024-04-15",
    totalMarks: 500,
    obtainedMarks: 423,
    percentage: 84.6,
    grade: "A",
    rank: 5,
    subjects: [
      { name: "Mathematics", code: "MATH-10", fullMarks: 100, obtained: 88, grade: "A+" },
      { name: "English", code: "ENG-10", fullMarks: 100, obtained: 82, grade: "A" },
      { name: "Physics", code: "PHY-10", fullMarks: 100, obtained: 85, grade: "A" },
      { name: "Chemistry", code: "CHEM-10", fullMarks: 100, obtained: 79, grade: "B+" },
      { name: "Nepali", code: "NEP-10", fullMarks: 100, obtained: 89, grade: "A+" },
    ],
  },
  {
    id: 2,
    examName: "Mid Term Examination",
    year: "2024",
    class: "10",
    section: "A",
    date: "2024-08-20",
    totalMarks: 500,
    obtainedMarks: 435,
    percentage: 87.0,
    grade: "A+",
    rank: 3,
    subjects: [
      { name: "Mathematics", code: "MATH-10", fullMarks: 100, obtained: 92, grade: "A+" },
      { name: "English", code: "ENG-10", fullMarks: 100, obtained: 85, grade: "A" },
      { name: "Physics", code: "PHY-10", fullMarks: 100, obtained: 88, grade: "A+" },
      { name: "Chemistry", code: "CHEM-10", fullMarks: 100, obtained: 82, grade: "A" },
      { name: "Nepali", code: "NEP-10", fullMarks: 100, obtained: 88, grade: "A+" },
    ],
  },
  {
    id: 3,
    examName: "Final Examination",
    year: "2023",
    class: "9",
    section: "A",
    date: "2023-12-10",
    totalMarks: 500,
    obtainedMarks: 398,
    percentage: 79.6,
    grade: "B+",
    rank: 8,
    subjects: [
      { name: "Mathematics", code: "MATH-9", fullMarks: 100, obtained: 78, grade: "B+" },
      { name: "English", code: "ENG-9", fullMarks: 100, obtained: 80, grade: "A" },
      { name: "Science", code: "SCI-9", fullMarks: 100, obtained: 82, grade: "A" },
      { name: "Social Studies", code: "SOC-9", fullMarks: 100, obtained: 75, grade: "B+" },
      { name: "Nepali", code: "NEP-9", fullMarks: 100, obtained: 83, grade: "A" },
    ],
  },
  {
    id: 4,
    examName: "First Term Examination",
    year: "2023",
    class: "9",
    section: "A",
    date: "2023-04-18",
    totalMarks: 500,
    obtainedMarks: 380,
    percentage: 76.0,
    grade: "B+",
    rank: 10,
    subjects: [
      { name: "Mathematics", code: "MATH-9", fullMarks: 100, obtained: 72, grade: "B" },
      { name: "English", code: "ENG-9", fullMarks: 100, obtained: 78, grade: "B+" },
      { name: "Science", code: "SCI-9", fullMarks: 100, obtained: 80, grade: "A" },
      { name: "Social Studies", code: "SOC-9", fullMarks: 100, obtained: 70, grade: "B" },
      { name: "Nepali", code: "NEP-9", fullMarks: 100, obtained: 80, grade: "A" },
    ],
  },
];

const getGradeColor = (grade) => {
  if (grade.startsWith("A")) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
  if (grade.startsWith("B")) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
  if (grade.startsWith("C")) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
  return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
};

const MyResults = () => {
  const [selectedResult, setSelectedResult] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewResult = (result) => {
    setSelectedResult(result);
    setIsDialogOpen(true);
  };

  const groupedResults = studentResults.reduce((acc, result) => {
    const key = `${result.year} - Class ${result.class}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(result);
    return acc;
  }, {});

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="My Results"
        description="View all your examination results and academic performance"
      />

      {Object.entries(groupedResults).map(([yearClass, results]) => (
        <div key={yearClass} className="space-y-4">
          <h2 className="text-lg font-semibold text-muted-foreground">{yearClass}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {results.map((result) => (
              <Card key={result.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{result.examName}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        <Calendar className="inline h-4 w-4 mr-1" />
                        {new Date(result.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <Badge className={getGradeColor(result.grade)}>{result.grade}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="space-y-1">
                      <p className="text-3xl font-bold">{result.percentage}%</p>
                      <p className="text-sm text-muted-foreground">
                        {result.obtainedMarks} / {result.totalMarks} marks
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-2xl font-semibold">#{result.rank}</p>
                      <p className="text-sm text-muted-foreground">Class Rank</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleViewResult(result)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedResult?.examName}</DialogTitle>
          </DialogHeader>
          {selectedResult && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Score</p>
                  <p className="text-2xl font-bold">
                    {selectedResult.obtainedMarks} / {selectedResult.totalMarks}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Percentage</p>
                  <p className="text-2xl font-bold">{selectedResult.percentage}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Grade</p>
                  <Badge className={`text-lg ${getGradeColor(selectedResult.grade)}`}>
                    {selectedResult.grade}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Rank</p>
                  <p className="text-2xl font-bold">#{selectedResult.rank}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Subject-wise Marks</h3>
                <div className="space-y-2">
                  {selectedResult.subjects.map((subject) => (
                    <div
                      key={subject.code}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{subject.name}</p>
                        <p className="text-xs text-muted-foreground">{subject.code}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-semibold">
                          {subject.obtained} / {subject.fullMarks}
                        </p>
                        <Badge className={getGradeColor(subject.grade)}>
                          {subject.grade}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyResults;
