import { Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import OverviewPage from "./pages/OverviewPage";
import SensorDataPage from "./pages/SensorDataPage";
import HistoricalDataPage from "./pages/HistoricalDataPage";
function App() {
  return (
    <ConfigProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/sensor-data" element={<SensorDataPage />} />
          <Route path="/historical-data" element={<HistoricalDataPage />} />
        </Routes>
      </div>
    </ConfigProvider>
  );
}

export default App;
