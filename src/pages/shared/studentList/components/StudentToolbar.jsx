import { useState } from "react";
import { Input } from "@/components/ui/input";
import { List, Table, Search } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Graduated", value: "graduated" },
  { label: "Transferred", value: "transferred" },
  { label: "Dropped Out", value: "dropped" },
];

const classOptions = Array.from({ length: 12 }, (_, i) => ({
  label: `Class ${i + 1}`,
  value: `class-${i + 1}`,
}));

const sectionOptions = ["A", "B", "C"].map((s) => ({ label: s, value: s }));

const StudentToolbar = ({ viewMode, setViewMode }) => {
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState({
    status: "",
    studentClass: "",
    section: "",
  });

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    console.log({ search: e.target.value, ...filterData });
  };

  const handleFilterChange = (key, value) => {
    const updated = { ...filterData, [key]: value };
    setFilterData(updated);
    console.log({ search, ...updated });
  };

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-sm">
      <div className="flex-1 min-w-[200px] relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search student ..."
          value={search}
          onChange={handleSearchChange}
          className="w-full pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Select
          value={filterData.status}
          onValueChange={(val) => handleFilterChange("status", val)}
        >
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filterData.studentClass}
          onValueChange={(val) => handleFilterChange("studentClass", val)}
        >
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {classOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filterData.section}
          onValueChange={(val) => handleFilterChange("section", val)}
        >
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sections</SelectItem>
            {sectionOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-0 border rounded-md overflow-hidden">
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`flex items-center justify-center px-3 py-2 w-12 ${viewMode === "table"
                ? "bg-gray-200 dark:bg-gray-600"
                : "bg-white dark:bg-gray-800"
              }`}
          >
            <List className="w-5 h-5" />
          </button>
          <div className="border-l border-gray-300 dark:border-gray-600" />
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`flex items-center justify-center px-3 py-2 w-12 ${viewMode === "list"
                ? "bg-gray-200 dark:bg-gray-600"
                : "bg-white dark:bg-gray-800"
              }`}
          >
            <Table className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentToolbar;
