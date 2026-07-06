import React from "react";

const PageLoader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="h-10 w-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
    </div>
  );
};

export default PageLoader;
