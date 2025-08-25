import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Filter, X } from "lucide-react";
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

const StudentToolbar = () => {
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterData, setFilterData] = useState({
    status: "active",
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

  const clearFilters = () => {
    const cleared = { status: "active", studentClass: "", section: "" };
    setFilterData(cleared);
    console.log({ search, ...cleared });
  };

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 rounded-sm">
      <div className="flex items-center justify-between gap-4 mb-2 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search student by name..."
            value={search}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button className="bg-blue-600 text-white hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-1" /> New Enrollment
          </Button>

          <Button
            variant="outline"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-1"
          >
            <Filter className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {filtersOpen && (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-4 p-4 bg-[#ededed2d] dark:bg-gray-700 rounded-md transition-all">
          <div className="w-full">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-200">
              Status
            </label>
            <Select
              value={filterData.status}
              onValueChange={(val) => handleFilterChange("status", val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-200">
              Class
            </label>
            <Select
              value={filterData.studentClass}
              onValueChange={(val) => handleFilterChange("studentClass", val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-200">
              Section
            </label>
            <Select
              value={filterData.section}
              onValueChange={(val) => handleFilterChange("section", val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent>
                {sectionOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex md:items-end items-start w-full md:w-auto">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex items-center justify-center w-full md:w-auto"
            >
              {" "}
              Clear
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentToolbar;
