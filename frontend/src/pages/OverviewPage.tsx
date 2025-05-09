import React, { useState } from "react";
import LineChart from "../components/LineChart";
import PageTemplate from "../templates/PageTemplate";

const OverviewPage: React.FC = () => {
  const [selectedDeviceId, setSelectedDeviceId] =
    useState<string>("Chlorella_40L_001");
  const dataLimit = 50; // Fixed number of points to show

  return (
    <PageTemplate
      title="Overview Dashboard"
      onDeviceIdChange={(deviceId) => setSelectedDeviceId(deviceId)}
    >
      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Temperature Charts */}
        <LineChart
          deviceId={selectedDeviceId}
          field="sensor_temp_inflow"
          title="Temperature Inflow"
          unit="°C"
          color="#3B82F6"
          type="single"
          yAxisTitle="Temperature (°C)"
          dataLimit={dataLimit}
        />
        <LineChart
          deviceId={selectedDeviceId}
          field="sensor_temp_outflow"
          title="Temperature Outflow"
          unit="°C"
          color="#EF4444"
          type="single"
          yAxisTitle="Temperature (°C)"
          dataLimit={dataLimit}
        />

        {/* Humidity Charts */}
        <LineChart
          deviceId={selectedDeviceId}
          field="sensor_humid_inflow"
          title="Humidity Inflow"
          unit="%"
          color="#10B981"
          type="single"
          yAxisTitle="Humidity (%)"
          dataLimit={dataLimit}
        />
        <LineChart
          deviceId={selectedDeviceId}
          field="sensor_humid_outflow"
          title="Humidity Outflow"
          unit="%"
          color="#059669"
          type="single"
          yAxisTitle="Humidity (%)"
          dataLimit={dataLimit}
        />

        {/* CO2 Charts */}
        <LineChart
          deviceId={selectedDeviceId}
          field="sensor_co2_inflow"
          field2="sensor_co2_outflow"
          title="CO₂ Levels"
          unit=" ppm"
          color="#9333EA"
          type="double"
          yAxisTitle="CO₂ Level (ppm)"
          dataLimit={dataLimit}
        />

        {/* O2 Charts */}
        <LineChart
          deviceId={selectedDeviceId}
          field="sensor_o2_inflow"
          field2="sensor_o2_outflow"
          title="O₂ Levels"
          unit="%"
          color="#EC4899"
          type="double"
          yAxisTitle="O₂ Level (%)"
          dataLimit={dataLimit}
        />

        {/* Reactor Parameters */}
        <LineChart
          deviceId={selectedDeviceId}
          field="sensor_temp_reactor"
          title="Reactor Temperature"
          unit="°C"
          color="#F59E0B"
          type="single"
          yAxisTitle="Temperature (°C)"
          dataLimit={dataLimit}
        />
        <LineChart
          deviceId={selectedDeviceId}
          field="sensor_ph_reactor"
          title="Reactor pH"
          unit=""
          color="#6366F1"
          type="single"
          yAxisTitle="pH Level"
          dataLimit={dataLimit}
        />
      </div>
    </PageTemplate>
  );
};

export default OverviewPage;
