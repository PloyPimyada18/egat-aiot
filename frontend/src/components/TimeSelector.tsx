import React, { useState } from "react";

interface TimeSelectorProps {
  onTimeRangeChange: (range: string) => void;
  color?: string;
  initialRange?: string;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({
  onTimeRangeChange,
  color = "#3B82F6",
  initialRange = "Today",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState(initialRange);

  const ranges = [
    { label: "Yesterday", value: "yesterday" },
    { label: "Today", value: "today" },
    { label: "Last 3 days", value: "3 days" },
    { label: "Last 7 days", value: "week" },
    { label: "Last 30 days", value: "month" },
  ];

  const handleSelect = (range: { label: string; value: string }) => {
    setSelectedRange(range.label);
    setIsOpen(false);
    onTimeRangeChange(range.value);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="px-3 py-2 inline-flex items-center text-sm font-medium focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-200"
        style={{ color: color }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedRange}
        <svg
          className="w-2.5 h-2.5 ms-2.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
          style={{ stroke: color }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg z-50">
          <ul className="py-2 text-sm text-gray-700">
            {ranges.map((range) => (
              <li key={range.value}>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  style={{ color: "#374151" }}
                  onClick={() => handleSelect(range)}
                >
                  {range.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TimeSelector;
