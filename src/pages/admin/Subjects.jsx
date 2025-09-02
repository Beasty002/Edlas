import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Eye, Edit, Trash2, Search } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import DataNotFound from "@/components/DataNotFound";

const initialSubjects = {
  9: [
    {
      id: 1,
      name: "Mathematics",
      description: "Basic algebra and geometry",
      fullMarks: 100,
      passMarks: 40,
      theory: 70,
      practical: 30,
      optional: false,
    },
    {
      id: 2,
      name: "English",
      description: "Literature and grammar",
      fullMarks: 100,
      passMarks: 35,
      theory: 100,
      practical: 0,
      optional: false,
    },
    {
      id: 3,
      name: "Science",
      description: "General science concepts",
      fullMarks: 100,
      passMarks: 40,
      theory: 60,
      practical: 40,
      optional: false,
    },
  ],
  10: [
    {
      id: 4,
      name: "Mathematics",
      description: "Advanced algebra and trigonometry",
      fullMarks: 100,
      passMarks: 40,
      theory: 70,
      practical: 30,
      optional: false,
    },
    {
      id: 5,
      name: "English",
      description: "Advanced literature studies",
      fullMarks: 100,
      passMarks: 35,
      theory: 100,
      practical: 0,
      optional: false,
    },
    {
      id: 6,
      name: "Physics",
      description: "Mechanics and thermodynamics",
      fullMarks: 100,
      passMarks: 40,
      theory: 60,
      practical: 40,
      optional: false,
    },
  ],
  11: [
    {
      id: 7,
      name: "Biology",
      description: "Cell biology and genetics",
      fullMarks: 100,
      passMarks: 35,
      theory: 60,
      practical: 40,
      optional: true,
    },
    {
      id: 8,
      name: "Chemistry",
      description: "Organic and inorganic chemistry",
      fullMarks: 100,
      passMarks: 40,
      theory: 70,
      practical: 30,
      optional: false,
    },
  ],
  12: [
    {
      id: 9,
      name: "Mathematics",
      description: "Calculus and statistics",
      fullMarks: 100,
      passMarks: 40,
      theory: 70,
      practical: 30,
      optional: false,
    },
    {
      id: 10,
      name: "Economics",
      description: "Microeconomics and macroeconomics",
      fullMarks: 100,
      passMarks: 35,
      theory: 100,
      practical: 0,
      optional: true,
    },
  ],
};

const Subjects = () => {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");

  const handleAction = (action, subject) => {
    console.log(`${action} action for subject:`, subject);
    alert(`${action} clicked for ${subject.name}`);
  };

  const filteredSubjects = Object.entries(initialSubjects).reduce(
    (acc, [cls, subjects]) => {
      const filtered = subjects.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
      );
      if (
        filtered.length > 0 &&
        (classFilter === "all" || classFilter === cls)
      ) {
        acc[cls] = filtered;
      }
      return acc;
    },
    {}
  );

  const allClasses = ["9", "10", "11", "12"];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Subjects Management"
        description="Manage subjects across different classes"
      />
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-sm">
        <div className="flex-1 min-w-[200px]  relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by subject name"
            className="pl-10 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {allClasses.map((c) => (
              <SelectItem key={c} value={c}>
                Class {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {Object.entries(filteredSubjects).length === 0 ? (
        <DataNotFound item="subjects" />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Class</TableHead>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Subject Name</TableHead>
                <TableHead className="hidden md:table-cell">
                  Description
                </TableHead>
                <TableHead className="w-16 text-center">Full Marks</TableHead>
                <TableHead className="w-16 text-center">Pass Marks</TableHead>
                <TableHead className="w-16 text-center">Theory</TableHead>
                <TableHead className="w-16 text-center">Practical</TableHead>
                <TableHead className="w-16 text-center">Optional</TableHead>

                <TableHead className="w-20 text-center"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(filteredSubjects).map(([cls, subjects]) =>
                subjects.map((subject, index) => (
                  <TableRow key={subject.id} className="group">
                    <TableCell className="text-center border-r">
                      {index === 0 && (
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary border-primary/20"
                        >
                          Class {cls}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      #{subject.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {subject.name}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground max-w-xs">
                      <div className="truncate">{subject.description}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      {subject.fullMarks}
                    </TableCell>
                    <TableCell className="text-center">
                      {subject.passMarks}
                    </TableCell>
                    <TableCell className="text-center">
                      {subject.theory}
                    </TableCell>
                    <TableCell className="text-center">
                      {subject.practical}
                    </TableCell>
                    <TableCell className="text-center">
                      {subject.optional ? "Yes" : "No"}
                    </TableCell>

                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => handleAction("View", subject)}
                          >
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAction("Edit", subject)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit Subject
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAction("Delete", subject)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Subject
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Subjects;
