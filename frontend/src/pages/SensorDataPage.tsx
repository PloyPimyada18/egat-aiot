import React, { useState, useEffect } from "react";
import PageTemplate from "../templates/PageTemplate";
import SensorCard from "../components/SensorCard";
import axios from "axios";

// Interface for the structure of sensor data
interface SensorData {
  [key: string]: {
    value: number;
    unit: string;
  };
}

// Main component for displaying live sensor data analytics
const SensorDataPage: React.FC = () => {
  // State for selected device, sensor data, loading status, and error messages
  const [selectedDeviceId, setSelectedDeviceId] =
    useState<string>("Chlorella_40L_001");
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch latest sensor data for the selected device
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedDeviceId) return;
      try {
        setLoading(true);
        const response = await axios.get(
          `https://egat-aiot-data.onrender.com/api/sensor-data/latest-all/${selectedDeviceId}`
        );
        setSensorData(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch data");
        console.error("Error fetching sensor data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Set up polling every 30 seconds to refresh data
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [selectedDeviceId]);

  // Render the sensor dashboard
  return (
    <PageTemplate
      title="Sensor Data Analytics"
      onDeviceIdChange={(deviceId) => setSelectedDeviceId(deviceId)}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Temperature Sensors */}
        <SensorCard
          title="Temperature In"
          color="#3B82F6"
          value={sensorData?.sensor_temp_inflow?.value}
          unit={sensorData?.sensor_temp_inflow?.unit}
          loading={loading}
          error={error}
        />
        <SensorCard
          title="Temperature Out"
          color="#3B82F6"
          value={sensorData?.sensor_temp_outflow?.value}
          unit={sensorData?.sensor_temp_outflow?.unit}
          loading={loading}
          error={error}
        />
        <SensorCard
          title="Reactor Temperature"
          color="#6366F1"
          value={sensorData?.sensor_temp_reactor?.value}
          unit={sensorData?.sensor_temp_reactor?.unit}
          loading={loading}
          error={error}
        />

        {/* CO₂ Sensors */}
        <SensorCard
          title="CO₂ In"
          color="#9333EA"
          value={sensorData?.sensor_co2_inflow?.value}
          unit={sensorData?.sensor_co2_inflow?.unit}
          loading={loading}
          error={error}
        />
        <SensorCard
          title="CO₂ Out"
          color="#9333EA"
          value={sensorData?.sensor_co2_outflow?.value}
          unit={sensorData?.sensor_co2_outflow?.unit}
          loading={loading}
          error={error}
        />

        {/* Humidity Sensors */}
        <SensorCard
          title="Humidity In"
          color="#10B981"
          value={sensorData?.sensor_humid_inflow?.value}
          unit={sensorData?.sensor_humid_inflow?.unit}
          loading={loading}
          error={error}
        />
        <SensorCard
          title="Humidity Out"
          color="#10B981"
          value={sensorData?.sensor_humid_outflow?.value}
          unit={sensorData?.sensor_humid_outflow?.unit}
          loading={loading}
          error={error}
        />

        {/* O₂ Sensors */}
        <SensorCard
          title="O₂ In"
          color="#EC4899"
          value={sensorData?.sensor_o2_inflow?.value}
          unit={sensorData?.sensor_o2_inflow?.unit}
          loading={loading}
          error={error}
        />
        <SensorCard
          title="O₂ Out"
          color="#EC4899"
          value={sensorData?.sensor_o2_outflow?.value}
          unit={sensorData?.sensor_o2_outflow?.unit}
          loading={loading}
          error={error}
        />

        {/* SO₂ Sensors */}
        <SensorCard
          title="SO₂ In"
          color="#F59E0B"
          value={sensorData?.sensor_so2_inflow?.value}
          unit={sensorData?.sensor_so2_inflow?.unit}
          loading={loading}
          error={error}
        />
        <SensorCard
          title="SO₂ Out"
          color="#F59E0B"
          value={sensorData?.sensor_so2_outflow?.value}
          unit={sensorData?.sensor_so2_outflow?.unit}
          loading={loading}
          error={error}
        />

        {/* Reactor Sensors */}
        <SensorCard
          title="Reactor pH"
          color="#6366F1"
          value={sensorData?.sensor_ph_reactor?.value}
          unit={sensorData?.sensor_ph_reactor?.unit}
          loading={loading}
          error={error}
        />
        <SensorCard
          title="Reactor EC"
          color="#6366F1"
          value={sensorData?.sensor_ec_reactor?.value}
          unit={sensorData?.sensor_ec_reactor?.unit}
          loading={loading}
          error={error}
        />
        <SensorCard
          title="TDS"
          color="#8B5CF6"
          value={sensorData?.sensor_tds_reactor?.value}
          unit={sensorData?.sensor_tds_reactor?.unit}
          loading={loading}
          error={error}
        />
        <SensorCard
          title="ORP"
          color="#8B5CF6"
          value={sensorData?.sensor_orp_reactor?.value}
          unit={sensorData?.sensor_orp_reactor?.unit}
          loading={loading}
          error={error}
        />
      </div>
    </PageTemplate>
  );
};

export default SensorDataPage;
