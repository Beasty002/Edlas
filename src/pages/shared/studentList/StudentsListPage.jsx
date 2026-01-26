import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { View, Edit, Search, List, Table } from "lucide-react";

import { DataGrid } from "@/components/reusable/DataGrid";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import PageHeader from "@/components/PageHeader";
import UpdateStudentForm from "./components/UpdateStudentForm";
import StudentListView from "./components/StudentListView";
import { baseRequest } from "@/api/api";
import { useDebounce, getSortConfig, buildQueryParams, getPaginationConfig } from "@/utils/helper";
import { useClassrooms } from "@/context/ClassroomsContext";

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Graduated", value: "graduated" },
  { label: "Transferred", value: "transferred" },
  { label: "Dropped Out", value: "dropped" },
];


export default function StudentsListPage() {
  const navigate = useNavigate();
  const { classOptions, getSectionsForClass } = useClassrooms();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [status, setStatus] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [section, setSection] = useState("");
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20 });
  const [ordering, setOrdering] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);

  const queryParams = buildQueryParams({
    pagination,
    search: debouncedSearch,
    ordering,
    filters: {
      status,
      student_class__name: studentClass,
      section__name: section,
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["students", queryParams.toString()],
    queryFn: async () => {
      const res = await baseRequest({
        url: `/system/students/?${queryParams.toString()}`,
        method: "GET",
      });
      return res.data;
    },
  });

  const sortConfig = getSortConfig(ordering);

  const handleSort = (newOrdering) => {
    setOrdering(newOrdering);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const columns = [
    {
      field: "id",
      headerText: "ID",
      width: 60,
      template: (student) => <span>#{student.id}</span>,
    },
    {
      field: "avatar_url",
      headerText: "Avatar",
      width: 60,
      allowSorting: false,
      template: (student) => (
        <Avatar className="h-8 w-8">
          {student.avatar_url ? (
            <AvatarImage src={student.avatar_url} alt={student.full_name} />
          ) : (
            <AvatarFallback>{student.first_name?.[0] || "S"}</AvatarFallback>
          )}
        </Avatar>
      ),
    },
    { field: "full_name", headerText: "Name", width: 150 },
    {
      field: "roll_no",
      headerText: "Roll No",
      width: 80,
      template: (student) => student.roll_no || "-",
    },
    {
      field: "student_class",
      headerText: "Class",
      width: 100,
      template: (student) => `${student.student_class} ${student.section}`,
    },
    {
      field: "parent_contact",
      headerText: "Parent Contact",
      width: 130,
      template: (student) => student.parent_contact || "-",
    },
    {
      field: "email",
      headerText: "Email",
      width: 180,
      template: (student) => student.email || "-",
    },
    { field: "admission_date", headerText: "Admission Date", width: 120 },
    {
      field: "status",
      headerText: "Status",
      width: 100,
      template: (student) => {
        const statusColors = {
          active: "bg-green-100 text-green-800",
          graduated: "bg-blue-100 text-blue-800",
          transferred: "bg-yellow-100 text-yellow-800",
          expelled: "bg-gray-100 text-gray-800",
        };
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[student.status] || statusColors.active}`}>
            {student.status}
          </span>
        );
      },
    },
  ];

  const actionConfig = {
    mode: "dropdown",
    showOnHover: false,
    showHeader: false,
    actions: [
      {
        label: "Edit",
        icon: <Edit className="h-4 w-4" />,
        onClick: (student) => setEditingStudent(student),
      },
      {
        label: "View Details",
        icon: <View className="h-4 w-4" />,
        onClick: (student) => navigate(`/students/${student.id}`),
      },
    ],
  };

  return (
    <div className="flex flex-col gap-2">
      <PageHeader
        title="Students"
        description="View and manage student records across all classes."
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-sm">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search student ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={status} onValueChange={(val) => { setStatus(val); setPagination((p) => ({ ...p, page: 1 })); }}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={studentClass} onValueChange={(val) => { setStudentClass(val); setSection(""); setPagination((p) => ({ ...p, page: 1 })); }}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={section} onValueChange={(val) => { setSection(val); setPagination((p) => ({ ...p, page: 1 })); }}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sections</SelectItem>
              {getSectionsForClass(studentClass).map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* <div className="flex items-center gap-0 border rounded-md overflow-hidden">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center justify-center px-3 py-2 w-12 ${viewMode === "table" ? "bg-gray-200 dark:bg-gray-600" : "bg-white dark:bg-gray-800"
                }`}
            >
              <List className="w-5 h-5" />
            </button>
            <div className="border-l border-gray-300 dark:border-gray-600" />
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex items-center justify-center px-3 py-2 w-12 ${viewMode === "list" ? "bg-gray-200 dark:bg-gray-600" : "bg-white dark:bg-gray-800"
                }`}
            >
              <Table className="w-5 h-5" />
            </button>
          </div> */}
        </div>
      </div>

      <DataGrid
        columns={columns}
        data={data?.results || []}
        isLoading={isLoading}
        actionConfig={actionConfig}
        emptyMessage="No students found"
        keyField="id"
        sortConfig={sortConfig}
        onSort={handleSort}
        pagination={getPaginationConfig(pagination, data?.count || 0, setPagination)}
      />
      {/* {viewMode === "table" ? (
      ) : (
        <StudentListView students={data?.results || []} isLoading={isLoading} />
      )} */}

      {editingStudent && (
        <UpdateStudentForm
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
        />
      )}
    </div>
  );
}
