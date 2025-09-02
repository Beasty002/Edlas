import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const getGrade = (marks) => {
  if (marks >= 90) return "A+";
  if (marks >= 80) return "A";
  if (marks >= 70) return "B+";
  if (marks >= 60) return "B";
  if (marks >= 50) return "C+";
  if (marks >= 40) return "C";
  return "F";
};

export default function AddOrEditMarksDialog({
  open,
  onClose,
  studentName,
  studentRoll,
  subjects,
  initialMarks = [],
  onSave,
}) {
  const [marksData, setMarksData] = useState([]);

  useEffect(() => {
    if (initialMarks.length > 0) {
      setMarksData(initialMarks);
    } else {
      setMarksData(
        subjects.map((s) => ({
          subjectId: s.id,
          subjectName: s.name,
          theory: "",
          practical: "",
        }))
      );
    }
  }, [initialMarks, subjects]);

  const handleChange = (id, field, value) => {
    setMarksData((prev) =>
      prev.map((m) => (m.subjectId === id ? { ...m, [field]: value } : m))
    );
  };

  const calculateTotals = () => {
    let total = 0;
    let count = 0;
    marksData.forEach((m) => {
      const full = Number(m.theory || 0) + Number(m.practical || 0);
      total += full;
      count++;
    });
    const avg = count > 0 ? total / count : 0;
    return getGrade(avg);
  };

  const handleSave = () => {
    onSave(marksData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[98dvw] md:w-[50vw] !max-w-none">
        <DialogHeader>
          <DialogTitle>
            {initialMarks.length > 0 ? "Edit Marks" : "Add Marks"} -{" "}
            {studentName} (Roll {studentRoll})
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-x-auto mt-3 border rounded-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 dark:bg-gray-800">
                <TableHead>Subject</TableHead>
                <TableHead>Theory</TableHead>
                <TableHead>Practical</TableHead>
                <TableHead>Full Marks</TableHead>
                <TableHead>Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marksData.map((m) => {
                const full = Number(m.theory || 0) + Number(m.practical || 0);
                const grade = getGrade(full);
                return (
                  <TableRow key={m.subjectId}>
                    <TableCell>{m.subjectName}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={m.theory}
                        onChange={(e) =>
                          handleChange(m.subjectId, "theory", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={m.practical}
                        onChange={(e) =>
                          handleChange(m.subjectId, "practical", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>{full}</TableCell>
                    <TableCell>{grade}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end mt-4">
          <p className="font-semibold">Total Grade: {calculateTotals()}</p>
        </div>

        <DialogFooter>
          {/* <Button variant="outline" onClick={onClose}>
            Cancel
          </Button> */}
          <Button
            onClick={handleSave}
            className={"bg-blue-600 hover:bg-blue-700 text-white px-6"}
          >
            {initialMarks.length > 0 ? "Update" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
