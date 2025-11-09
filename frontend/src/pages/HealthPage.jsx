import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  Home,
  CheckSquare,
  Heart,
  Calendar,
  Bell,
  Settings,
  User,
  LogOut,
  Droplets,
  Thermometer,
  Menu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { comman } from "./en/comman";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function HealthPage() {
  const [userName, setUserName] = useState("User");
  const [sensorData, setSensorData] = useState({});
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("live");

  const aggregatedHistory = React.useMemo(() => {
    if (viewMode === "daily") {
      const grouped = {};
      history.forEach((d) => {
        const day = new Date(d.received_at).toLocaleDateString();
        if (!grouped[day])
          grouped[day] = { count: 0, bpm: 0, temp: 0, humidity: 0 };
        grouped[day].bpm += d.bpm;
        grouped[day].temp += d.temp;
        grouped[day].humidity += d.humidity;
        grouped[day].count += 1;
      });
      return Object.entries(grouped).map(([day, val]) => ({
        time: day,
        bpm: val.bpm / val.count,
        temp: val.temp / val.count,
        humidity: val.humidity / val.count,
      }));
    }
    return history;
  }, [viewMode, history]);

  const downsampledHistory = history.filter((_, i) => i % 3 === 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:14192/api/sensor/W001/today");
        const data = await res.json();

        if (Array.isArray(data)) {
          const formatted = data.map((d) => ({
            temp: d.temp || 0,
            humidity: d.humidity || 0,
            bpm: d.bpm || 0,
            time: new Date(d.received_at || new Date()).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));

          setHistory(formatted);

          const latest = data[data.length - 1];
          setSensorData({
            temp: latest.temp || 0,
            humidity: latest.humidity || 0,
            bpm: latest.bpm || 0,
            spo2: latest.spo2 || 0,
            pressure: latest.pressure || 0,
            latitude: latest.latitude || 0,
            longitude: latest.longitude || 0,
            battery: latest.battery || 0,
            received_at: latest.received_at || new Date().toISOString(),
            watch_id: latest.watch_id || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch sensor data", err);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar userName={userName} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {comman.HealthTracker}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {comman.MonitorHealth}, {userName}!
          </p>
        </div>

        {/* Health Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "BPM",
              value: sensorData.bpm,
              icon: <Heart className="w-5 h-5 text-pink-600" />,
              color: "pink",
            },
            {
              label: "Temperature",
              value: sensorData.temp,
              icon: <Thermometer className="w-5 h-5 text-orange-600" />,
              color: "orange",
            },
            {
              label: "Humidity",
              value: sensorData.humidity,
              icon: <Droplets className="w-5 h-5 text-blue-600" />,
              color: "blue",
            },
            {
              label: "SpO2",
              value: sensorData.spo2,
              icon: <Droplets className="w-5 h-5 text-green-600" />,
              color: "green",
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {card.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {card.value || "—"}
                  {card.label === "Temperature"
                    ? " °F"
                    : card.label === "Humidity" || card.label === "SpO2"
                    ? "%"
                    : ""}
                </p>
                {(card.label === "BPM" || card.label === "Temperature") && (
                  <p
                    className={`text-xs ${
                      card.label === "BPM"
                        ? card.value >= 60 && card.value <= 100
                          ? "text-green-600"
                          : "text-yellow-600"
                        : card.value >= 97 && card.value <= 99
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {card.label === "BPM"
                      ? card.value >= 60 && card.value <= 100
                        ? "Normal"
                        : "Check"
                      : card.value >= 97 && card.value <= 99
                      ? "Normal"
                      : "Check"}
                  </p>
                )}
              </div>
              <div
                className={`w-10 h-10 bg-${card.color}-100 rounded-lg flex items-center justify-center`}
              >
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        {/* Charts Header with Tabs */}
        <div className="text-2xl font-bold text-gray-900 ">
          {comman.healthStats}
        </div>
        <div className="mt-8 bg-red-100 p-4 rounded-md text-sm sm:text-base text-red-600 mb-5">
          {comman.healthNote}
        </div>
        <div className="flex flex-col gap-6 justify-center">
          {[
            { label: "BPM Over Time", dataKey: "bpm", color: "#f472b6" },
            {
              label: "Temperature Over Time",
              dataKey: "temp",
              color: "#fb923c",
            },
            {
              label: "Humidity Over Time",
              dataKey: "humidity",
              color: "#3b82f6",
            },
          ].map((chart, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 w-full overflow-x-auto"
            >
              <p className="text-sm font-medium text-gray-600 mb-2">
                {chart.label}
              </p>

              {/* Scrollable container */}
              <div className="overflow-x-auto">
                <div className="min-w-[1200px] h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={
                        viewMode === "live"
                          ? downsampledHistory
                          : aggregatedHistory
                      }
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey={viewMode === "daily" ? "date" : "time"}
                        interval="preserveStartEnd"
                        minTickGap={30}
                      />
                      <YAxis />
                      <Tooltip cursor={{ stroke: "#9ca3af", strokeWidth: 1 }} />
                      <Line
                        type="monotone"
                        dataKey={chart.dataKey}
                        stroke={chart.color}
                        strokeWidth={2}
                        isAnimationActive={true}
                        dot={true}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
