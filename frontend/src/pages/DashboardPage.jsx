import React, { useState, useEffect } from "react";
import { comman } from "./en/comman";
import Navbar from "../components/Navbar";
import {
  Users,
  MapPin,
  Shield,
  Battery,
  Thermometer,
  Activity,
  AlertTriangle,
  Send,
  RefreshCw,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import AlertsForChildren from "./fragments/BatteryAlert";

// Fix default marker icons for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Create custom markers for children
const createCustomMarker = (color) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const childColors = [
  "#EF4444", // red
  "#3B82F6", // blue
  "#10B981", // green
  "#F59E0B", // yellow
  "#8B5CF6", // purple
  "#EC4899", // pink
];


function detectStops(readings, minMinutes = 5, distanceThreshold = 20) {
  if (!Array.isArray(readings) || readings.length === 0) return [];

  const stops = [];
  let start = readings[0];

  for (let i = 1; i < readings.length; i++) {
    const prev = readings[i - 1];
    const curr = readings[i];

    // Distance between points in meters
    const dist = haversineDistance(
      [prev.latitude, prev.longitude],
      [curr.latitude, curr.longitude]
    );

    const timeDiff = (new Date(curr.received_at) - new Date(start.received_at)) / 60000; 

    if (dist > distanceThreshold) {
      // child moved, check if last stay qualifies as stop
      if (timeDiff >= minMinutes) {
        stops.push({
          latitude: start.latitude,
          longitude: start.longitude,
          from: start.received_at,
          to: prev.received_at,
          duration: timeDiff,
        });
      }
      start = curr; // reset stop start
    }
  }

  return stops;
}

// Haversine formula for distance in meters
function haversineDistance([lat1, lon1], [lat2, lon2]) {
  const R = 6371e3; // earth radius in meters
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function DashboardPage() {
  const [userName, setUserName] = useState("User");
  const [location, setLocation] = useState({ lat: 37.7749, lon: -122.4194 }); // map center fallback
  const [battery, setBattery] = useState(null);     // kept for your BatteryAlert
  const [temp, setTemp] = useState(null);           // kept for your TempAlert
  const [humidity, setHumidity] = useState(null);
  const [pressure, setPressure] = useState(null);
  const [spo2, setSpo2] = useState(null);
  const [bpm, setBpm] = useState(null);
  const [history, setHistory] = useState([]);       // optional batch history if needed
  const [child, setChild] = useState([]);           // children list
  const [sensorsByWatchId, setSensorsByWatchId] = useState({}); // { [watchId]: latestReading }
  const [historicalPath, setHistoricalPath] =useState({});

  // Fetch latest sensor for each child (by watchId)
  const fetchSensorsForChildren = async (childrenArr) => {
    const ids = [...new Set((childrenArr || []).map((c) => c.watchId).filter(Boolean))];
    if (ids.length === 0) {
      setSensorsByWatchId({});
      return;
    }

    const results = await Promise.allSettled(
      ids.map((id) =>
        fetch(`http://localhost:14192/api/sensor/${id}/today`).then((r) => r.json())
      )
    );

    const map = {};
    const historyMap = {};
    results.forEach((res, i) => {
      const wid = ids[i];
      if (res.status === "fulfilled" && Array.isArray(res.value) && res.value.length > 0) {
        map[wid] = res.value[res.value.length - 1]; // latest reading
        historyMap[id] = res.value;
      }
    });
    setSensorsByWatchId(map);
    setHistoricalPath(historyMap);

    // Optionally center the map to the first child that has coordinates
    const firstWithLoc = Object.values(map).find(
      (m) => m?.latitude != null && m?.longitude != null
    );
    if (firstWithLoc) {
      setLocation({
        lat: firstWithLoc.latitude ?? 37.7749,
        lon: firstWithLoc.longitude ?? -122.4194,
      });
    }
  };

  // Main fetch that refreshes children + their sensors + (optional) a baseline W001 history
  const fetchData = async () => {
    try {
      // 1) Fetch children (authorized)
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.warn("No token found in sessionStorage");
      }
      const ures = await fetch("http://localhost:14192/api/children", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token || ""}`,
          "Content-Type": "application/json",
        },
      });
      if (!ures.ok) {
        console.error("Children fetch failed:", ures.status);
      }
      const userdata = await ures.json();
      const childrenArr = Array.isArray(userdata) ? userdata : [];
      setChild(childrenArr);

      // 2) Fetch sensors per child
      await fetchSensorsForChildren(childrenArr);

      // 3) (Optional) keep your existing W001/today history/vitals for global alerts
      const res = await fetch("http://localhost:14192/api/sensor/W001/today");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setHistory(data);
        const latest = data[data.length - 1];

        // Global fallbacks / alerts use W001 (you can change this to a selected child)
        setBattery(latest?.battery ?? null);
        setTemp(latest?.temp ?? null);
        setHumidity(latest?.humidity ?? null);
        setPressure(latest?.pressure ?? null);
        setSpo2(latest?.spo2 ?? null);
        setBpm(latest?.bpm ?? null);

        // If map didn’t get centered via child sensors, center via this
        if (latest?.latitude != null && latest?.longitude != null) {
          setLocation({
            lat: latest.latitude,
            lon: latest.longitude,
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    }
  };

  useEffect(() => {
    // Load user name
    try {
      const storedUser = JSON.parse(sessionStorage.getItem("user"));
      if (storedUser?.name) setUserName(storedUser.name);
    } catch (err) {
      console.error("Failed to parse stored user");
    }

    // Initial fetch + interval
    fetchData();
    const intervalId = setInterval(fetchData, 10000); // 10s refresh
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <Navbar userName={userName} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {comman.WelcomeBackUser}, {userName}!
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {comman.WhatsHappening}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Children Online
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {child?.length ?? 0}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Active Alerts
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">1</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Safe Zones
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">4</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Avg Daily Steps
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  4,200
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Child Profile Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {Array.isArray(child) && child.length > 0 ? (
            child.map((c, idx) => {
              const initials = (c.name || "")
                .split(/\s+/)
                .map((p) => p[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              const latest = c.watchId ? sensorsByWatchId[c.watchId] : null;
              const batteryPct =
                latest?.battery != null ? Math.round(latest.battery) : null;
              const tempC = latest?.temp != null ? latest.temp : null;
              const status = c.status || (latest ? "safe" : "unknown");
              const statusColor =
                status === "safe"
                  ? "bg-green-100 text-green-800"
                  : status === "warning"
                  ? "bg-orange-100 text-orange-800"
                  : "bg-red-100 text-red-800";

              // rotating avatar colors
              const palettes = [
                ["bg-purple-100", "text-purple-600"],
                ["bg-blue-100", "text-blue-600"],
                ["bg-pink-100", "text-pink-600"],
                ["bg-teal-100", "text-teal-600"],
              ];
              const [avatarBg, avatarText] = palettes[idx % palettes.length];

              return (
                <div
                  key={c.id ?? `${c.watchId || "no-watch"}-${idx}`}
                  className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="relative">
                      <div
                        className={`w-12 h-12 sm:w-16 sm:h-16 ${avatarBg} rounded-full flex items-center justify-center`}
                      >
                        <span className={`${avatarText} font-bold text-sm sm:text-lg`}>
                          {initials || "NA"}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                          {c.name || "Unknown"}
                        </h3>
                        {c.age ? (
                          <span className="text-xs sm:text-sm text-gray-500">
                            {c.age} years old
                          </span>
                        ) : null}
                      </div>

                      <div className="space-y-1 sm:space-y-2">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-600 truncate">
                            {c.location || c.college || "—"}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Battery className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-600">
                            {batteryPct != null ? `${batteryPct}%` : "—"}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Thermometer className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-600">
                            {tempC != null ? `${tempC}°C` : "—"}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-600">
                            <span className={`text-xs px-2 py-1 rounded ${statusColor}`}>
                              {status}
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 sm:mt-3 text-xs text-gray-500">
                        Last updated: {latest?.timestamp || "—"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-2">
              <div className="bg-white rounded-xl p-6 border border-gray-200 text-center text-gray-600">
                No children found.
              </div>
            </div>
          )}
        </div>

        {/* Bottom Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Live Location */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Live Location
              </h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm text-green-600 font-medium">
                  Live
                </span>
              </div>
            </div>

            <div className="rounded-lg h-32 sm:h-48 mb-4 relative overflow-hidden">
              <MapContainer
                center={[location.lat, location.lon]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {Array.isArray(child) &&
                  child.map((c, idx) => {
                    const latest = c.watchId ? sensorsByWatchId[c.watchId] : null;
                    const lat = latest?.latitude;
                    const lng = latest?.longitude;
                    if (lat == null || lng == null) return null;

                    return (
                      <Marker
                        key={c.id ?? `${c.watchId || "no-watch"}-${idx}`}
                        position={[lat, lng]}
                        icon={createCustomMarker(idx % 2 === 0 ? "#EF4444" : "#3B82F6")}
                      >
                        <Popup>
                          <div className="text-center">
                            <strong>{c.name || "Unknown"}</strong>
                            <br />
                            {c.college || c.location || "—"}
                            <br />
                            <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
                              {c.status || "safe"}
                            </span>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                  {Array.isArray(child) &&
                    child.map((c, idx) =>{
                        const history = c.watchId ? historicalPath?.[c.watchId] || [] : [];
                        if (history.length === 0) return null;

                      const color = childColors[idx % childColors.length];
                      const stops = detectStops(history);

                      return (
                        <React.Fragment key={`path-${c.watchId}`}>
                          {/* Path */}
                          <Polyline
                            positions={history.map((p) => [p.latitude, p.longitude])}
                            color={color}
                          />

                          {/* Stops */}
                          {stops.map((s, idx) => (
                            <CircleMarker
                              key={`stop-${c.watchId}-${idx}`}
                              center={[s.latitude, s.longitude]}
                              radius={6}
                              color={color}
                            >
                              <Popup>
                                <strong>{c.name || "Child"}</strong>
                                <br />
                                From: {new Date(s.from).toLocaleTimeString()}
                                <br />
                                To: {new Date(s.to).toLocaleTimeString()}
                                <br />
                                Duration: {s.duration.toFixed(1)} min
                              </Popup>
                            </CircleMarker>
                          ))}
                        </React.Fragment>
                      );
                    })}
              </MapContainer>

              {/* Overlay controls */}
              <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-[1000]">
                <button className="p-1 sm:p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50">
                  <Send className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                </button>
              </div>
              <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 z-[1000]">
                <button className="px-2 py-1 sm:px-3 bg-blue-500 text-white text-xs rounded-lg flex items-center space-x-1 hover:bg-blue-600">
                  <RefreshCw className="w-2 h-2 sm:w-3 sm:h-3" />
                  <span>Safe Zone</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-0">
              <span>
                Last Update: <strong>2 minutes ago</strong>
              </span>
              <span>
                Accuracy: <strong>±5 meters</strong>
              </span>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Recent Alerts
            </h3>

            <AlertsForChildren
    childrenList={child}
    baseUrl="http://localhost:14192"
    useAuth={true}           // set to true if your sensor endpoints need JWT
    maxAlertsPerChild={2}    // show up to 2 alerts per child
    showOKState={true}
  />
          </div>
        </div>

        {/* Daily Activity Graph */}
        <div className="mt-6 sm:mt-8 bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            Daily Activity
          </h3>
          <div className="h-32 sm:h-48 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Activity className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-xs sm:text-sm text-gray-500">
                Activity graph will be displayed here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
