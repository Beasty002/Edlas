import React, { useState } from "react";
import StudentToolbar from "./components/StudentToolbar";
import StudentListTable from "./components/StudentListTable";
import StudentListView from "./components/StudentListView";

const StudentsListPage = () => {
  const [viewMode, setViewMode] = useState("table");

  return (
    <div className="flex flex-col gap-2">
      <StudentToolbar viewMode={viewMode} setViewMode={setViewMode} />
      {viewMode === "table" ? <StudentListTable /> : <StudentListView />}
    </div>
  );
};

export default StudentsListPage;
