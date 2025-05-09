import React, { useState, ReactNode } from "react";
import DashboardHeader from "./headers/DashboardHeader";
import Sidebar from "./Sidebar";
import Footbar from "./footers/Footerbar";
import Alert from "./Alert";

interface PageTemplateProps {
  children: ReactNode;
  title: string;
  onDeviceIdChange?: (deviceId: string) => void;
}

const PageTemplate: React.FC<PageTemplateProps> = ({
  children,
  title,
  onDeviceIdChange,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [error, setError] = useState<string>("");
  const [deviceIds] = useState<string[]>([
    "Chlorella_40L_001",
    "Chlorella_40L_002",
    // Add more device IDs as needed
  ]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(
    deviceIds[0] || ""
  );

  // Mock error message for demonstration
  React.useEffect(() => {
    setError("Warning: System maintenance scheduled for tomorrow at 2 AM");
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleDeviceIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDeviceId = e.target.value;
    setSelectedDeviceId(newDeviceId);
    if (onDeviceIdChange) {
      onDeviceIdChange(newDeviceId);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      {/* Main Content - Apply margin and text size based on sidebar state */}
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 relative ${
          isSidebarCollapsed ? "ml-16 text-base" : "ml-64 text-sm"
        }`}
      >
        {/* Alert - Absolute position at top */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
          {error && <Alert type="error" message={error} />}
        </div>

        {/* Header */}
        <div className="w-full bg-white shadow-md z-10">
          <DashboardHeader />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Page Title and Device ID Selector */}
          <div className="mb-6 flex items-center justify-between">
            <h1
              className={`font-bold text-gray-800 ${
                isSidebarCollapsed ? "text-2xl" : "text-xl"
              }`}
            >
              {title}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="deviceId" className="text-gray-700 font-medium">
                  Device ID:
                </label>
                <select
                  id="deviceId"
                  value={selectedDeviceId}
                  onChange={handleDeviceIdChange}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {deviceIds.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Page Content */}
          {children}

          {/* Footer */}
          <Footbar />
        </div>
      </div>
    </div>
  );
};

export default PageTemplate;
