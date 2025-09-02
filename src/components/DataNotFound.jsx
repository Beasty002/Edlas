import { Search } from "lucide-react";
import React from "react";

const DataNotFound = ({ item }) => {
  return (
    <div className="p-12 text-center text-muted-foreground">
      <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
        <Search className="h-8 w-8" />
      </div>
      <div className="text-lg font-medium">No {item} found</div>
      <div className="text-sm mt-1">
        Try adjusting your search or filter criteria.
      </div>
    </div>
  );
};

export default DataNotFound;
