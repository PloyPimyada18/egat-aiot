import React, { useState } from "react";

type AlertType = "info" | "success" | "warning" | "error" | "dark";
type AlertProps = {
  type: AlertType;
  message: string;
  link?: {
    text: string;
    href: string;
  };
  onClose?: () => void;
};

const Alert: React.FC<AlertProps> = ({ type, message, link, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const getAlertStyles = () => {
    switch (type) {
      case "info":
        return "text-blue-800 bg-blue-50 dark:bg-gray-800 dark:text-blue-400";
      case "success":
        return "text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400";
      case "warning":
        return "text-yellow-800 bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300";
      case "error":
        return "text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400";
      case "dark":
        return "bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
      default:
        return "text-blue-800 bg-blue-50 dark:bg-gray-800 dark:text-blue-400";
    }
  };

  const getButtonStyles = () => {
    switch (type) {
      case "info":
        return "bg-blue-50 text-blue-500 hover:bg-blue-200 dark:bg-gray-800 dark:text-blue-400";
      case "success":
        return "bg-green-50 text-green-500 hover:bg-green-200 dark:bg-gray-800 dark:text-green-400";
      case "warning":
        return "bg-yellow-50 text-yellow-500 hover:bg-yellow-200 dark:bg-gray-800 dark:text-yellow-300";
      case "error":
        return "bg-red-50 text-red-500 hover:bg-red-200 dark:bg-gray-800 dark:text-red-400";
      case "dark":
        return "bg-gray-50 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-blue-50 text-blue-500 hover:bg-blue-200 dark:bg-gray-800 dark:text-blue-400";
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`flex items-center p-3 rounded-lg max-w-md mx-auto ${getAlertStyles()}`}
      role="alert"
    >
      <svg
        className="shrink-0 w-4 h-4"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
      </svg>
      <span className="sr-only">Info</span>
      <div className="ms-3 text-sm font-medium">
        {message}
        {link && (
          <a
            href={link.href}
            className="font-semibold underline hover:no-underline"
          >
            {link.text}
          </a>
        )}
      </div>
      <button
        type="button"
        className={`ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-${type}-400 p-1.5 inline-flex items-center justify-center h-8 w-8 dark:hover:bg-gray-700 ${getButtonStyles()}`}
        onClick={handleClose}
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  );
};

export default Alert;
