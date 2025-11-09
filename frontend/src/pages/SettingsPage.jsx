import React, { useState,useEffect } from "react";
import { MapPin, Shield, Sun, Thermometer, Users, X, Moon } from "lucide-react";
import Navbar from "../components/Navbar";

export default function SettingsPage() {
  const predefinedLocations = ["Home", "School", "Park", "Library", "Grandparent's House"];
  const [userName, setUserName] = useState("User");

    useEffect(() => {
      // Get user name from stored token
      const token = sessionStorage.getItem("token");
      if (token) {
        try {
          // Decode JWT token to get user info
          const payload = JSON.parse(atob(token.split(".")[1]));
          if (payload.name) {
            setUserName(payload.name);
          }
        } catch (error) {
          console.log("Could not decode token, using default name");
        }
      }
    }, []);

  const initialSettings = {
    liveTracking: true,
    shareLocation: true,
    darkMode: false,
    privacyMode: false,
    raiseToWake: false,
    findDevice: false,
    units: "metric",
    safeZones: ["Home"],
    newSafeZone: "",
  };

  const [settings, setSettings] = useState(initialSettings);

  const toggleSwitch = (key) => setSettings({ ...settings, [key]: !settings[key] });

  const handleInputChange = (e) => setSettings({ ...settings, [e.target.name]: e.target.value });

  const addSafeZone = (zone) => {
    const newZone = zone || settings.newSafeZone.trim();
    if (newZone && !settings.safeZones.includes(newZone)) {
      setSettings({
        ...settings,
        safeZones: [...settings.safeZones, newZone],
        newSafeZone: "",
      });
    }
  };

  const removeSafeZone = (zone) => {
    setSettings({
      ...settings,
      safeZones: settings.safeZones.filter((z) => z !== zone),
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSafeZone();
    }
  };

  const handleSave = () => {
    console.log("Saved settings:", settings);
    alert("Settings saved!");
  };

  const handleResetDevice = () => {
    if (window.confirm("Are you sure you want to reset the device?")) {
      setSettings(initialSettings);
      alert("Device reset to default settings!");
    }
  };

  const filteredSuggestions = predefinedLocations.filter(
    (loc) =>
      loc.toLowerCase().includes(settings.newSafeZone.toLowerCase()) &&
      !settings.safeZones.includes(loc)
  );

  return (
    <div className={`min-h-screen ${settings.darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
        {/* Top Navigation Bar */}
        <Navbar userName={userName} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>

      
        <div className="space-y-4">
          <ToggleItem icon={<MapPin className="w-5 h-5 text-blue-500" />} label="Live Tracking" value={settings.liveTracking} onToggle={() => toggleSwitch("liveTracking")} darkMode={settings.darkMode} />
          <ToggleItem icon={<MapPin className="w-5 h-5 text-green-500" />} label="Share Location with Guardians" value={settings.shareLocation} onToggle={() => toggleSwitch("shareLocation")} darkMode={settings.darkMode} />
          <ToggleItem icon={<MapPin className="w-5 h-5 text-purple-500" />} label="Find Device" value={settings.findDevice} onToggle={() => toggleSwitch("findDevice")} darkMode={settings.darkMode} />
        </div>

        <div className={`p-3 rounded-xl shadow border ${settings.darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} relative`}>
          <div className="flex items-center mb-2 space-x-2">
            <Users className={`${settings.darkMode ? "text-purple-300" : "text-purple-500"} w-5 h-5`} />
            <label className="text-sm font-medium">Safe Zones</label>
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            {settings.safeZones.map((zone) => (
              <div key={zone} className="flex items-center bg-blue-100 text-blue-700 rounded-full px-2 py-1 text-sm dark:bg-blue-900 dark:text-blue-300">
                {zone}
                <button className="ml-1 focus:outline-none" onClick={() => removeSafeZone(zone)}>
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <input
            type="text"
            name="newSafeZone"
            value={settings.newSafeZone}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Type or select a safe zone and press Enter"
            className={`w-full rounded-lg p-2 border ${settings.darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300"}`}
          />

          {settings.newSafeZone && filteredSuggestions.length > 0 && (
            <div className={`absolute top-full left-0 mt-1 w-full rounded-lg shadow max-h-40 overflow-auto z-50 ${settings.darkMode ? "bg-gray-700 border border-gray-600" : "bg-white border border-gray-300"}`}>
              {filteredSuggestions.map((loc) => (
                <div key={loc} onClick={() => addSafeZone(loc)} className="px-3 py-2 hover:bg-blue-100 cursor-pointer flex items-center space-x-2">
                  <MapPin className={`${settings.darkMode ? "text-blue-300" : "text-blue-500"} w-4 h-4`} />
                  <span>{loc}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`space-y-4`}>
          <ToggleItem icon={<Shield className={`${settings.darkMode ? "text-red-300" : "text-red-500"} w-5 h-5`} />} label="Privacy Mode" value={settings.privacyMode} onToggle={() => toggleSwitch("privacyMode")} darkMode={settings.darkMode} />
          <ToggleItem icon={<Sun className={`${settings.darkMode ? "text-yellow-300" : "text-yellow-500"} w-5 h-5`} />} label="Raise to Wake Mode" value={settings.raiseToWake} onToggle={() => toggleSwitch("raiseToWake")} darkMode={settings.darkMode} />
        </div>

        
        <ToggleItem icon={<Moon className={`${settings.darkMode ? "text-gray-100" : "text-gray-700"} w-5 h-5`} />} label="Dark Mode" value={settings.darkMode} onToggle={() => toggleSwitch("darkMode")} darkMode={settings.darkMode} />

       
        <div className={`p-3 rounded-xl shadow border ${settings.darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <div className="flex items-center mb-1 space-x-2">
            <Thermometer className={`${settings.darkMode ? "text-orange-300" : "text-orange-500"} w-5 h-5`} />
            <label className="text-sm font-medium">Units</label>
          </div>
          <select
            name="units"
            value={settings.units}
            onChange={handleInputChange}
            className={`mt-1 w-full border rounded-lg p-2 ${settings.darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300"}`}
          >
            <option value="metric">Metric (°C, km)</option>
            <option value="imperial">Imperial (°F, miles)</option>
          </select>
        </div>

        
        <div className="flex space-x-4">
          <button onClick={handleSave} className={`flex-1 py-2 font-semibold rounded-lg shadow ${settings.darkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}>
            Save
          </button>
          <button onClick={handleResetDevice} className={`flex-1 py-2 font-semibold rounded-lg shadow ${settings.darkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-100" : "bg-gray-300 hover:bg-gray-400 text-gray-800"}`}>
            Reset Device
          </button>
        </div>
      </div>
    </div>
  );
}


function ToggleItem({ icon, label, value, onToggle, darkMode }) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl shadow border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
      <div className="flex items-center space-x-2">{icon}<span>{label}</span></div>
      <button onClick={onToggle} className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${value ? "bg-blue-500" : "bg-gray-300"}`}>
        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${value ? "translate-x-6" : ""}`} />
      </button>
    </div>
  );
}

