import React, { forwardRef } from "react";
import { Button } from "../ui/button";
import { MoreVertical } from "lucide-react";

const TableActionButton = forwardRef((props, ref) => {
  return (
    <Button
      ref={ref}
      {...props}
      variant="ghost"
      className="h-8 w-8 p-0 md:opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <span className="sr-only">Open menu</span>
      <MoreVertical className="h-4 w-4" />
    </Button>
  );
});

export default TableActionButton;
