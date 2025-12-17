import React from "react";
import { Box } from "lucide-react";

function ViewHeader({ heading, from }) {
  return (
    <div>
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-8">
          <Box size={24} color="currentColor" />
          <div className="flex flex-col gap-1">
            <h2
              className={`${
                from === "addProduct" ? "text-[20px]" : "text-[16px]"
              } font-[600] text-[#26334F]`}
            >
              {heading.main}
            </h2>
            <span className="text-[#A4A0A0]">{heading.sub}</span>
          </div>
        </div>
      </div>
      <div className="flex border mt-2 border-gray-200"></div>
    </div>
  );
}

export default ViewHeader;
