import React from "react";

const PageHeader = ({ title, description, className = "" }) => {
  return (
    <div className={`mb-3 ${className}`}>
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
