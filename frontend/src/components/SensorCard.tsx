import React from "react";

interface SensorCardProps {
  title: string;
  unit?: string;
  color?: string;
  value?: number;
  loading?: boolean;
  error?: string | null;
}

const SensorCard: React.FC<SensorCardProps> = ({
  title,
  unit = "",
  color = "#3B82F6", // Default to blue if no color provided
  value,
  loading = false,
  error = null,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-3 w-full">
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">{title}</h3>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-500">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (error || value === undefined) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-3 w-full">
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">{title}</h3>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-500">
            Error
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-3 w-full">
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">{title}</h3>
        <div className="text-lg sm:text-xl lg:text-2xl font-bold">
          <span style={{ color }}>
            {value}
            {unit && (
              <span className="text-base sm:text-lg lg:text-xl ml-1">
                {unit}
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SensorCard;
