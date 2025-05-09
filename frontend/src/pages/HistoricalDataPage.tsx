import { useState } from "react";
import PageTemplate from "../templates/PageTemplate";
import axios from "axios";

// Main component for the Historical Data page
const HistoricalDataPage = () => {
  // State variables for date range, loading status, error messages, and selected device
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] =
    useState<string>("Chlorella_40L_001");
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);

  // List of all sensor collections to include in the CSV export
  const collections = [
    "sensor_co2_inflow",
    "sensor_co2_outflow",
    "sensor_ec_reactor",
    "sensor_humid_inflow",
    "sensor_humid_outflow",
    "sensor_o2_inflow",
    "sensor_o2_outflow",
    "sensor_orp_reactor",
    "sensor_ph_reactor",
    "sensor_so2_inflow",
    "sensor_so2_outflow",
    "sensor_tds_reactor",
    "sensor_temp_inflow",
    "sensor_temp_outflow",
    "sensor_temp_reactor",
  ];

  /**
   * Fetches sensor data from selected collections for the selected device and date range,
   * merges them by timestamp, and formats the result as a CSV string.
   */
  const formatDataToCSV = async () => {
    // Map to merge all data points by timestamp
    const timestampMap = new Map();

    // Fetch data for each selected collection and merge by timestamp
    for (const collection of selectedCollections) {
      try {
        // Fetch filtered data for the current collection
        const response = await axios.get(
          `http://localhost:3000/api/sensor-data/${collection}/filter`,
          {
            params: {
              start: startDate,
              end: endDate,
              device_id: selectedDeviceId,
            },
          }
        );
        // Debug: log fetched data for each collection
        console.log(collection, response.data);

        // Merge each data point into the timestamp map
        response.data.forEach((item: any) => {
          const timestamp = new Date(item.timestamp).getTime();
          if (!timestampMap.has(timestamp)) {
            // Create a new entry for this timestamp
            timestampMap.set(timestamp, {
              timestamp: item.timestamp,
              device_id: item.metadata.device_id,
              [collection]: item.value,
            });
          } else {
            // Add the value to the existing entry for this timestamp
            timestampMap.get(timestamp)[collection] = item.value;
          }
        });
      } catch (err) {
        // Log errors for each collection fetch
        console.error(`Error fetching data from ${collection}:`, err);
      }
    }

    // Convert map to array and sort by timestamp (oldest to newest)
    const sortedData = Array.from(timestampMap.values()).sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });

    // CSV headers: timestamp, device_id, then all selected collection names
    const headers = ["timestamp", "device_id", ...selectedCollections];
    const csvRows = [headers.join(",")];

    // Format each row for the CSV
    sortedData.forEach((item) => {
      const row = headers.map((header) => {
        const value = item[header];
        if (value === null || value === undefined) return "";
        if (typeof value === "string") return `"${value.replace(/"/g, '""')}"`;
        if (value instanceof Date) return `"${value.toISOString()}"`;
        return value;
      });
      csvRows.push(row.join(","));
    });

    // Return the complete CSV as a string
    return csvRows.join("\n");
  };

  /**
   * Handles the CSV download button click:
   * - Validates input
   * - Fetches and formats data
   * - Triggers CSV file download
   */
  const handleDownloadCSV = async () => {
    console.log("Downloading CSV...");
    // Validate that both start and end dates are selected
    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }

    if (selectedCollections.length === 0) {
      setError("Please select at least one collection to download");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch and format data as CSV
      const csvContent = await formatDataToCSV();

      // Create a blob and trigger download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `sensor-data-${selectedDeviceId}-${startDate}-to-${endDate}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download data");
    } finally {
      setLoading(false);
    }
  };

  // Handle collection selection change
  const handleCollectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "all") {
      setSelectedCollections([...collections]);
    } else if (value && !selectedCollections.includes(value)) {
      setSelectedCollections([...selectedCollections, value]);
    }
  };

  // Handle removing a collection
  const handleRemoveCollection = (collectionToRemove: string) => {
    setSelectedCollections(
      selectedCollections.filter((c) => c !== collectionToRemove)
    );
  };

  // Handle removing all collections
  const handleRemoveAllCollections = () => {
    setSelectedCollections([]);
  };

  // Render the page template and UI
  return (
    <PageTemplate
      title="Historical Data"
      onDeviceIdChange={(deviceId) => setSelectedDeviceId(deviceId)}
    >
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-black">
            Download Historical Data
          </h2>

          {/* Date range selectors and collection selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Start Date and Time
              </label>
              <input
                type="datetime-local"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                End Date and Time
              </label>
              <input
                type="datetime-local"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="collections"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select Collection
              </label>
              <select
                id="collections"
                value=""
                onChange={handleCollectionChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a collection...</option>
                <option value="all">All Collections</option>
                {collections
                  .filter(
                    (collection) => !selectedCollections.includes(collection)
                  )
                  .map((collection) => (
                    <option key={collection} value={collection}>
                      {collection}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Selected collections display */}
          {selectedCollections.length > 0 && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium text-gray-700">
                  Selected Collections:
                </p>
                <button
                  onClick={handleRemoveAllCollections}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedCollections.map((collection) => (
                  <div
                    key={collection}
                    className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{collection}</span>
                    <button
                      onClick={() => handleRemoveCollection(collection)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error message display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {/* Download button */}
          <button
            onClick={handleDownloadCSV}
            disabled={
              loading ||
              !startDate ||
              !endDate ||
              !selectedDeviceId ||
              selectedCollections.length === 0
            }
            className={`px-4 py-2 rounded-md text-white font-medium ${
              loading ||
              !startDate ||
              !endDate ||
              !selectedDeviceId ||
              selectedCollections.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Downloading..." : "Download CSV"}
          </button>
        </div>
      </div>
    </PageTemplate>
  );
};

export default HistoricalDataPage;
