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
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const dummyStudents = [
  {
    id: "stu-1",
    roll: 1,
    name: "John Doe",
    class: "10",
    section: "A",
    grade: "A",
    status: "Pass",
  },
  {
    id: "stu-2",
    roll: 2,
    name: "Jane Smith",
    class: "10",
    section: "A",
    grade: "F",
    status: "Fail",
  },
  {
    id: "stu-3",
    roll: 3,
    name: "Alice Brown",
    class: "10",
    section: "B",
    grade: "B+",
    status: "Pass",
  },
  {
    id: "stu-4",
    roll: 4,
    name: "Bob Lee",
    class: "9",
    section: "A",
    grade: "D",
    status: "Pass",
  },
];

const StudentPlacement = () => {
  const [students, setStudents] = useState(dummyStudents);
  const [selected, setSelected] = useState([]);
  const [classFilter, setClassFilter] = useState("10");
  const [sectionFilter, setSectionFilter] = useState("A");
  const [search, setSearch] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const filtered = students.filter(
    (s) =>
      s.class === classFilter &&
      s.section === sectionFilter &&
      (search ? s.name.toLowerCase().includes(search.toLowerCase()) : true)
  );

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (checked) => {
    if (checked) setSelected(filtered.map((s) => s.id));
    else setSelected([]);
  };

  const handleActionClick = (action) => {
    if (selected.length === 0) {
      toast.error("No students selected.");
      return;
    }
    setSelectedAction(action);
    setConfirmOpen(true);
  };

  const confirmAction = () => {
    let updated = [...students];
    if (selectedAction === "promote") {
      updated = updated.map((s) =>
        selected.includes(s.id)
          ? { ...s, class: String(Number(s.class) + 1) }
          : s
      );
      toast.success(`${selected.length} students promoted.`);
    } else if (selectedAction === "demote") {
      updated = updated.map((s) =>
        selected.includes(s.id)
          ? { ...s, class: String(Number(s.class) - 1) }
          : s
      );
      toast.success(`${selected.length} students demoted.`);
    } else if (selectedAction.startsWith("transfer")) {
      const section = selectedAction.split("-")[1];
      updated = updated.map((s) =>
        selected.includes(s.id) ? { ...s, section } : s
      );
      toast.success(
        `${selected.length} students transferred to Section ${section}.`
      );
    }
    setStudents(updated);
    setSelected([]);
    setSelectedAction("");
    setConfirmOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 flex-wrap md:flex-row md:items-center md:justify-between bg-white  dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-sm ">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search by name"
            className="w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-full md:w-32">
            <SelectValue placeholder="Class" />
          </SelectTrigger>
          <SelectContent>
            {[9, 10, 11, 12].map((c) => (
              <SelectItem key={c} value={String(c)}>
                Class {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sectionFilter} onValueChange={setSectionFilter}>
          <SelectTrigger className="w-full md:w-32">
            <SelectValue placeholder="Section" />
          </SelectTrigger>
          <SelectContent>
            {["A", "B", "C"].map((s) => (
              <SelectItem key={s} value={s}>
                Section {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full md:w-40 bg-blue-600 hover:bg-blue-800 text-white">
              Bulk Action
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleActionClick("promote")}>
              Promote
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleActionClick("demote")}>
              Demote
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleActionClick("transfer-A")}>
              Transfer to A
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleActionClick("transfer-B")}>
              Transfer to B
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleActionClick("transfer-C")}>
              Transfer to C
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <h2 className="text-lg font-semibold">
        Showing: Class {classFilter} - Section {sectionFilter}
      </h2>

      <div className="overflow-hidden rounded-sm border border-gray-200 dark:border-gray-700 shadow-sm">
        <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-gray-800">
              <TableHead>
                <Checkbox
                  checked={
                    selected.length === filtered.length && filtered.length > 0
                  }
                  onCheckedChange={(val) => toggleSelectAll(val)}
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Avatar</TableHead>
              <TableHead>Roll No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          {filtered.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="p-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No students found
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {filtered.map((student) => (
                <TableRow
                  key={student.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(student.id)}
                      onCheckedChange={() => toggleSelect(student.id)}
                    />
                  </TableCell>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>
                    <Avatar>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`}
                      />
                      <AvatarFallback>{student.name[0]}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{student.roll}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell
                    className={
                      student.status === "Pass"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {student.status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Confirm Action
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center text-gray-700 dark:text-gray-200">
            Are you sure you want to {selectedAction.replace("-", " ")}{" "}
            {selected.length} student(s)?
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              className={"bg-blue-600 text-white"}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentPlacement;
