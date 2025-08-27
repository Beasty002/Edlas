import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const dummyStudents = [
  { id: "stu-1", name: "John Doe", class: "10", section: "A" },
  { id: "stu-2", name: "Jane Smith", class: "10", section: "A" },
  { id: "stu-3", name: "Alice Brown", class: "10", section: "B" },
  { id: "stu-4", name: "Bob Lee", class: "9", section: "A" },
  { id: "stu-5", name: "John Doe", class: "10", section: "A" },
  { id: "stu-6", name: "Jane Smith", class: "10", section: "A" },
  { id: "stu-7", name: "Alice Brown", class: "10", section: "B" },
  { id: "stu-8", name: "Bob Lee", class: "9", section: "A" },
  { id: "stu-9", name: "John Doe", class: "10", section: "A" },
  { id: "stu-10", name: "Jane Smith", class: "10", section: "A" },
  { id: "stu-11", name: "Alice Brown", class: "10", section: "B" },
  { id: "stu-12", name: "Bob Lee", class: "9", section: "A" },
];

const StudentPlacement = () => {
  const [students, setStudents] = useState(dummyStudents);
  const [selected, setSelected] = useState([]);
  const [classFilter, setClassFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [search, setSearch] = useState("");

  const filtered = students.filter(
    (s) =>
      (classFilter ? s.class === classFilter : true) &&
      (sectionFilter ? s.section === sectionFilter : true) &&
      (search ? s.name.toLowerCase().includes(search.toLowerCase()) : true)
  );

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelected(filtered.map((s) => s.id));
  const clearAll = () => setSelected([]);

  const handleAction = (action) => {
    toast.success(
      selected.length > 0
        ? `${selected.length} students ${action}.`
        : "No students selected."
    );
    setSelected([]);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <Select onValueChange={setClassFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="9">9</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="11">11</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setSectionFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">A</SelectItem>
            <SelectItem value="B">B</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Search by name"
          className="w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button variant="outline" onClick={selectAll}>
          Select All
        </Button>
        <Button variant="outline" onClick={clearAll}>
          Clear All
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Section</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(student.id)}
                      onCheckedChange={() => toggleSelect(student.id)}
                    />
                  </TableCell>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.section}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Sticky Action Bar */}
      {selected.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white shadow-md rounded-xl px-6 py-3 flex gap-4 items-center border z-50">
          <span className="text-sm text-gray-600">
            {selected.length} selected
          </span>
          <Button onClick={() => handleAction("promoted")}>Promote</Button>
          <Button variant="secondary" onClick={() => handleAction("demoted")}>
            Demote
          </Button>
          <Select
            onValueChange={(val) => handleAction(`transferred to ${val}`)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Transfer Section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">Section A</SelectItem>
              <SelectItem value="B">Section B</SelectItem>
              <SelectItem value="C">Section C</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default StudentPlacement;
