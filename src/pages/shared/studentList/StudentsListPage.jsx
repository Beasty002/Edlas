import React from "react";
import StudentToolbar from "./components/StudentToolbar";
import StudentListTable from "./components/StudentListTable";

const StudentsListPage = () => {
  return (
    <div className="flex flex-col gap-2">
      <StudentToolbar />
      <StudentListTable />
    </div>
  );
};

export default StudentsListPage;
