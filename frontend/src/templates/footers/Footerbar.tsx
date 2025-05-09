import React from "react";

const Footbar: React.FC = () => {
  return (
    <footer className="bg-white shadow-md py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            EGAT Carbon Neutrality by 2050
          </h2>
          <p className="text-gray-600">Lower-carbon future for All</p>
        </div>
      </div>
    </footer>
  );
};

export default Footbar;
