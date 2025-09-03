import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Edit, Eye, UserX, PlusCircle } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import DataNotFound from "@/components/reusable/DataNotFound";
import TableActionButton from "@/components/reusable/TableActionButton";
import { Badge } from "@/components/ui/badge";
import AddClassModal from "./components/AddClassModal";

// Dummy Data
const dummyClasses = [
  {
    id: "c1",
    className: "10",
    section: "A",
    teacher: "Mr. Sharma",
    totalStudents: 45,
    status: "active",
  },
  {
    id: "c2",
    className: "10",
    section: "B",
    teacher: "Ms. Karki",
    totalStudents: 40,
    status: "inactive",
  },
  {
    id: "c3",
    className: "9",
    section: "A",
    teacher: "Mr. Thapa",
    totalStudents: 42,
    status: "active",
  },
  {
    id: "c4",
    className: "9",
    section: "B",
    teacher: "Ms. Singh",
    totalStudents: 38,
    status: "active",
  },
];

const Classes = () => {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [classes, setClasses] = useState(dummyClasses);

  const filtered = classes.filter((cls) => {
    const matchesSearch =
      cls.className.toLowerCase().includes(search.toLowerCase()) ||
      cls.section.toLowerCase().includes(search.toLowerCase()) ||
      cls.teacher.toLowerCase().includes(search.toLowerCase());
    const matchesClass = classFilter === "all" || cls.className === classFilter;
    const matchesSection =
      sectionFilter === "all" || cls.section === sectionFilter;
    return matchesSearch && matchesClass && matchesSection;
  });

  const groupedClasses = filtered.reduce((acc, cls) => {
    if (!acc[cls.className]) acc[cls.className] = [];
    acc[cls.className].push(cls);
    return acc;
  }, {});

  const handleAction = (action, cls) => {
    if (action === "toggle") {
      setClasses((prev) =>
        prev.map((c) =>
          c.id === cls.id
            ? { ...c, status: c.status === "active" ? "inactive" : "active" }
            : c
        )
      );
    } else {
      alert(`${action} class ${cls.className}-${cls.section}`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Class Management"
        description="Manage classes, sections, and assign class teachers efficiently."
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-sm">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by class, section or teacher"
            className="pl-10 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select
            value={classFilter}
            onValueChange={setClassFilter}
            className={"min-w-[120px]"}
          >
            <SelectTrigger className="w-auto min-w-[150px]">
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {["9", "10", "11", "12"].map((c) => (
                <SelectItem key={c} value={c}>
                  Class {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sectionFilter} onValueChange={setSectionFilter}>
            <SelectTrigger className="w-auto min-w-[150px]">
              <SelectValue placeholder="Section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sections</SelectItem>
              {["A", "B", "C"].map((s) => (
                <SelectItem key={s} value={s}>
                  Section {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button className={"bg-blue-600 hover:bg-blue-700 text-white"}>
            <AddClassModal
              classesData={[
                {
                  className: "9",
                  sections: ["A", "B"],
                  teacher: "Mr. Ram",
                  status: "active",
                },
                {
                  className: "10",
                  sections: ["A", "B", "C"],
                  teacher: "Mrs. Sita",
                  status: "active",
                },
              ]}
              onSave={(newClass) => console.log("Saved class:", newClass)}
            />
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-gray-800">
              <TableHead>Class</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Class Teacher</TableHead>
              <TableHead className="text-center">Total Students</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="w-16 text-center"></TableHead>
            </TableRow>
          </TableHeader>

          {filtered.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={6} className="p-6 text-center">
                  <DataNotFound item="classes" />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {Object.keys(groupedClasses).map((className) => {
                const classSections = groupedClasses[className];
                return classSections.map((cls, idx) => (
                  <TableRow key={cls.id} className="group">
                    <TableCell>
                      {idx === 0 && (
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          Class {cls.className}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-left">{cls.section}</TableCell>
                    <TableCell>{cls.teacher}</TableCell>
                    <TableCell className="text-center">
                      {cls.totalStudents}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          cls.status === "active" ? "default" : "destructive"
                        }
                      >
                        {cls.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <TableActionButton />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleAction("View", cls)}
                          >
                            <Eye className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAction("Edit", cls)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAction("toggle", cls)}
                          >
                            <UserX className="mr-2 h-4 w-4" />{" "}
                            {cls.status === "active"
                              ? "Set Inactive"
                              : "Set Active"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ));
              })}
            </TableBody>
          )}
        </Table>
      </div>
    </div>
  );
};

export default Classes;
