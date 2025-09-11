import React, { useState } from "react";
import StudentToolbar from "./components/StudentToolbar";
import StudentListTable from "./components/StudentListTable";
import StudentListView from "./components/StudentLIstView";
import PageHeader from "@/components/PageHeader";

const StudentsListPage = () => {
  const [viewMode, setViewMode] = useState("table");

  return (
    <div className="flex flex-col gap-2">
      <PageHeader
        title="Students"
        description="View and manage student records across all classes."
      />

      <StudentToolbar viewMode={viewMode} setViewMode={setViewMode} />
      {viewMode === "table" ? <StudentListTable /> : <StudentListView />}
    </div>
  );
};

export default StudentsListPage;
