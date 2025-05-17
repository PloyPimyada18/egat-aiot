import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import TimeSelector from "./TimeSelector";
import axios from "axios";

interface DataPoint {
  time: string;
  value?: number;
  value1?: number;
  value2?: number;
  rawTimestamp?: string;
}

interface LineChartProps {
  deviceId: string;
  field: string;
  field2?: string; // for double chart
  title: string;
  unit: string;
  color: string;
  type: "single" | "double";
  yAxisTitle: string;
  dataLimit: number;
  data?: DataPoint[];
  loading?: boolean;
  error?: string | null;
}

const LineChart: React.FC<LineChartProps> = ({
  deviceId,
  field,
  field2,
  title,
  unit,
  color,
  type,
  yAxisTitle,
  dataLimit,
  loading: initialLoading = false,
  error: initialError = null,
}) => {
  const [chartId] = useState(`chart-${Math.floor(Math.random() * 1000)}`);
  const [timeRange, setTimeRange] = useState("today");
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(initialError);
  const [allData, setAllData] = useState<DataPoint[]>([]); // Store all fetched data
  const [windowStart, setWindowStart] = useState(0); // Start index for the window
  const windowSize = 50;

  const getDateRange = (range: string) => {
    const endDate = new Date();
    let startDate = new Date();
    switch (range) {
      case "yesterday": {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const end = new Date(yesterday);
        end.setHours(23, 59, 59, 999);
        const start = new Date(yesterday);
        start.setHours(0, 0, 0, 0);
        return { startDate: start, endDate: end };
      }
      case "today": {
        const today = new Date();
        const end = new Date(today);
        end.setHours(23, 59, 59, 999);
        const start = new Date(today);
        start.setHours(0, 0, 0, 0);
        return { startDate: start, endDate: end };
      }
      case "3 days":
        startDate = new Date(endDate.getTime() - 3 * 24 * 60 * 60 * 1000);
        break;
      case "week":
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
    }
    return { startDate, endDate };
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!deviceId) return;
      setLoading(true);
      try {
        const { startDate, endDate } = getDateRange(timeRange);
        const collection = field;
        const response = await axios.get(
          `https://egat-aiot-data.onrender.com/api/sensor-data/${collection}/filter`,
          {
            params: {
              start: startDate.toISOString(),
              end: endDate.toISOString(),
              device_id: deviceId,
            },
          }
        );
        const responseData = response.data;

        let processedData: DataPoint[] = [];
        if (type === "single") {
          processedData = responseData
            .map((item: any) => ({
              time: new Date(item.timestamp).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }),
              value: Number(item.value),
              rawTimestamp: item.timestamp,
            }))
            .sort((a: DataPoint, b: DataPoint) => a.time.localeCompare(b.time));
        } else if (type === "double" && field2) {
          const collection2 = field2;
          const response2 = await axios.get(
            `https://egat-aiot-data.onrender.com/api/sensor-data/${collection2}/filter`,
            {
              params: {
                start: startDate.toISOString(),
                end: endDate.toISOString(),
                device_id: deviceId,
              },
            }
          );
          const responseData2 = response2.data;
          const value2Map = new Map(
            responseData2.map((item: any) => [
              new Date(item.timestamp).getTime(),
              Number(item.value),
            ])
          );
          processedData = responseData
            .map((item: any) => ({
              time: new Date(item.timestamp).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }),
              value1: Number(item.value),
              value2: value2Map.get(new Date(item.timestamp).getTime()) || 0,
              rawTimestamp: item.timestamp,
            }))
            .sort((a: DataPoint, b: DataPoint) => a.time.localeCompare(b.time));
        }
        setAllData(processedData);
        setWindowStart(0); // Reset window on new fetch
        setError(null);
      } catch (err) {
        setError("Failed to fetch data");
        console.error("Error fetching chart data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Initial fetch
    // Set up polling every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, [deviceId, timeRange, field, field2, type, dataLimit]);

  // Slice the data for the current window
  const data = allData.slice(windowStart, windowStart + windowSize);

  // Pan controls
  const canPanLeft = windowStart > 0;
  const canPanRight = windowStart + windowSize < allData.length;
  const panLeft = () =>
    setWindowStart((prev) => Math.max(0, prev - windowSize));
  const panRight = () =>
    setWindowStart((prev) =>
      Math.min(allData.length - windowSize, prev + windowSize)
    );

  // Prepare series data based on chart type
  const series =
    type === "single"
      ? [
          {
            name: title,
            data: data.map((d) => d.value ?? 0),
          },
        ]
      : [
          {
            name: "Inside",
            data: data.map((d) => d.value1 ?? 0),
          },
          {
            name: "Outside",
            data: data.map((d) => d.value2 ?? 0),
          },
        ];

  // Chart options
  const chartOptions: ApexOptions = {
    chart: {
      id: chartId,
      height: 350,
      type: "line",
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 3,
      curve: "smooth",
    },
    colors: type === "single" ? [color] : [color, `${color}88`],
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: data.map((d) => d.time),
      tickAmount: 5,
      labels: {
        rotate: -45,
        rotateAlways: false,
        hideOverlappingLabels: true,
        showDuplicates: false,
        trim: false,
        minHeight: 50,
        maxHeight: 50,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      title: {
        text: yAxisTitle,
      },
    },
    tooltip: {
      theme: "dark",
      x: {
        formatter: function (value: any, { dataPointIndex }: any) {
          const point = data[dataPointIndex];
          if (!point || !point.rawTimestamp) return value;
          const date = new Date(point.rawTimestamp);
          return date.toLocaleString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          });
        },
      },
    },
  };

  // Calculate averages
  const calculateAverage = () => {
    if (type === "single") {
      if (allData.length === 0) return "0";
      return (
        allData.reduce((sum, item) => sum + (item.value ?? 0), 0) /
        allData.length
      ).toFixed(1);
    } else {
      if (allData.length === 0) return { in: "0", out: "0" };
      return {
        in: (
          allData.reduce((sum, item) => sum + (item.value1 ?? 0), 0) /
          allData.length
        ).toFixed(0),
        out: (
          allData.reduce((sum, item) => sum + (item.value2 ?? 0), 0) /
          allData.length
        ).toFixed(0),
      };
    }
  };

  const average = calculateAverage();

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4 md:p-6">
      <div className="flex justify-between mb-5">
        <div>
          <h5 className="text-gray-500 font-normal mb-2">Avg {title}</h5>
          {type === "single" ? (
            <p className="text-gray-900 text-2xl font-bold">
              {String(average)}
              {unit}
            </p>
          ) : (
            <div className="space-y-1">
              <p className="text-gray-900 text-base font-bold">
                Inside:{" "}
                {typeof average === "object" && "in" in average
                  ? average.in
                  : ""}
                {unit}
              </p>
              <p className="text-gray-900 text-base font-bold">
                Outside:{" "}
                {typeof average === "object" && "out" in average
                  ? average.out
                  : ""}
                {unit}
              </p>
            </div>
          )}
        </div>
        <TimeSelector
          onTimeRangeChange={setTimeRange}
          color={color}
          initialRange={timeRange}
        />
      </div>
      <div className="mt-6" style={{ height: "350px", width: "100%" }}>
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Loading...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500">
            Error loading data
          </div>
        ) : (
          <ReactApexChart
            options={chartOptions}
            series={series}
            type="line"
            height={350}
            width="100%"
          />
        )}
      </div>
      <div className="flex justify-center items-center mt-2 gap-2">
        <button
          onClick={panLeft}
          disabled={!canPanLeft}
          className="px-2 py-1 bg-blue-500 text-white rounded disabled:opacity-50 disabled:bg-blue-200"
        >
          ◀
        </button>
        <span className="text-black">
          {windowStart + 1} -{" "}
          {Math.min(windowStart + windowSize, allData.length)} /{" "}
          {allData.length}
        </span>
        <button
          onClick={panRight}
          disabled={!canPanRight}
          className="px-2 py-1 bg-blue-500 text-white rounded disabled:opacity-50 disabled:bg-blue-200"
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default LineChart;
