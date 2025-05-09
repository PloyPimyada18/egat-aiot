import React from "react";
import logo from "../../assets/pic/logo.png";
import TimeDisplay from "./TimeDisplay";
import AddUserButton from "./AddUserButton";
import NotificationIcon from "./NotificationIcon";
import ProfileMenu from "./UserIcon";

const DashboardHeader: React.FC = () => {
  return (
    <div className="bg-white rounded-lg p-2.5 mb-4 w-full">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <img src={logo} alt="EGAT Logo" className="h-8 sm:h-12 w-auto" />
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
              EGAT AIoT Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
              Real-time Monitoring System
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 w-full md:w-auto">
          <TimeDisplay />
          <AddUserButton />
          <NotificationIcon />
          <ProfileMenu />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
