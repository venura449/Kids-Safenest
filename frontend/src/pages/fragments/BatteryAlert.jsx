// AlertsForChildren.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Battery as BatteryIcon,
  Thermometer,
  Droplets,
  Activity,
  HeartPulse,
  Gauge,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Thresholds } from "../changable/thresholds";
import { comman } from "../en/comman";

/**
 * EXPECTED Thresholds (rename if yours differ):
 * {
 *   // Battery
 *   highbatterylimit: 100,   // above this => no alert
 *   lowbatterylimit: 20,     // below this => critical
 *
 *   // Temperature (°C)
 *   lowtemplimit: 18,
 *   hightemplimit: 37.5,
 *   warnTempDelta: 0.5,      // optional small buffer for warnings
 *
 *   // Humidity (%)
 *   lowhumiditylimit: 25,
 *   highhumiditylimit: 70,
 *
 *   // Pressure (hPa)
 *   lowpressurelimit: 980,
 *   highpressurelimit: 1030,
 *
 *   // SpO2 (%)
 *   lowspo2limit: 92,        // below => critical; 92–94 => warning (example)
 *
 *   // BPM (heart rate)
 *   lowbpmlimit: 50,
 *   highbpmlimit: 120
 * }
 */

// ---------- tiny helpers ----------
const clampInt = (v) => (v == null ? null : Math.round(Number(v)));

const iconByType = {
  battery: BatteryIcon,
  temp: Thermometer,
  humidity: Droplets,
  pressure: Gauge,
  spo2: HeartPulse,
  bpm: Activity,
};

const chipBySeverity = (sev) =>
  sev === "critical"
    ? { box: "bg-red-50 border-red-500", text: "text-red-700", icon: "text-red-500" }
    : sev === "warning"
    ? { box: "bg-yellow-50 border-yellow-500", text: "text-yellow-700", icon: "text-yellow-500" }
    : { box: "bg-green-50 border-green-500", text: "text-green-700", icon: "text-green-500" };

// ---------- evaluators (return {severity, label, valueDisplay}) ----------
function evalBattery(battery) {
  if (battery == null) return null;
  const pct = clampInt(battery);
  if (pct < Thresholds.lowbatterylimit) {
    return { severity: "critical", label: comman?.lowbattery || "Low battery", valueDisplay: `${pct}%` };
  }
  if (pct < Thresholds.highbatterylimit) {
    return { severity: "warning", label: comman?.lowbattery || "Low battery", valueDisplay: `${pct}%` };
  }
  return null;
}

function evalTemp(temp) {
  if (temp == null) return null;
  const t = Number(temp);
  const warnDelta = Thresholds.warnTempDelta ?? 0.0;
  if (t <= Thresholds.lowtemplimit) {
    return { severity: "critical", label: "Low temperature", valueDisplay: `${t}°C` };
  }
  if (t >= Thresholds.hightemplimit) {
    return { severity: "critical", label: "High temperature", valueDisplay: `${t}°C` };
  }
  // (optional) warn if close to limits
  if (t <= Thresholds.lowtemplimit + warnDelta) {
    return { severity: "warning", label: "Temp near low limit", valueDisplay: `${t}°C` };
  }
  if (t >= Thresholds.hightemplimit - warnDelta) {
    return { severity: "warning", label: "Temp near high limit", valueDisplay: `${t}°C` };
  }
  return null;
}

function evalHumidity(h) {
  if (h == null) return null;
  const v = Number(h);
  if (v <= Thresholds.lowhumiditylimit) {
    return { severity: "warning", label: "Low humidity", valueDisplay: `${v}%` };
  }
  if (v >= Thresholds.highhumiditylimit) {
    return { severity: "warning", label: "High humidity", valueDisplay: `${v}%` };
  }
  return null;
}

function evalPressure(p) {
  if (p == null) return null;
  const v = Number(p);
  if (v <= Thresholds.lowpressurelimit) {
    return { severity: "warning", label: "Low pressure", valueDisplay: `${v} hPa` };
  }
  if (v >= Thresholds.highpressurelimit) {
    return { severity: "warning", label: "High pressure", valueDisplay: `${v} hPa` };
  }
  return null;
}

function evalSpo2(spo2) {
  if (spo2 == null) return null;
  const v = Number(spo2);
  if (v < Thresholds.lowspo2limit) {
    return { severity: "critical", label: "Low SpO₂", valueDisplay: `${v}%` };
  }
  if (v < Thresholds.lowspo2limit + 2) {
    return { severity: "warning", label: "SpO₂ borderline", valueDisplay: `${v}%` };
  }
  return null;
}

function evalBpm(bpm) {
  if (bpm == null) return null;
  const v = Number(bpm);
  if (v <= Thresholds.lowbpmlimit) {
    return { severity: "critical", label: "Low heart rate", valueDisplay: `${v} bpm` };
  }
  if (v >= Thresholds.highbpmlimit) {
    return { severity: "critical", label: "High heart rate", valueDisplay: `${v} bpm` };
  }
  // Could add warning bands if you like
  return null;
}

// Build all alerts for one reading
function buildAlertsFromReading(reading) {
  if (!reading) return [];
  const items = [];

  const b = evalBattery(reading.battery);
  if (b) items.push({ type: "battery", ...b });

  const t = evalTemp(reading.temp);
  if (t) items.push({ type: "temp", ...t });

  const h = evalHumidity(reading.humidity);
  if (h) items.push({ type: "humidity", ...h });

  const p = evalPressure(reading.pressure);
  if (p) items.push({ type: "pressure", ...p });

  const s = evalSpo2(reading.spo2);
  if (s) items.push({ type: "spo2", ...s });

  const hr = evalBpm(reading.bpm);
  if (hr) items.push({ type: "bpm", ...hr });

  return items;
}

// ---------- Presentational row for a single alert ----------
const AlertRow = ({ childName, alert, timestamp }) => {
  const palette = chipBySeverity(alert.severity);
  const Icon = iconByType[alert.type] || AlertTriangle;

  return (
    <div className={`flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg border-l-4 ${palette.box}`}>
      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 ${palette.icon}`} />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-gray-900">{childName}</div>
        <div className={`text-xs sm:text-sm ${palette.text}`}>
          {alert.label} — {alert.valueDisplay}
        </div>
        <div className="text-xs text-gray-600 mt-1">{timestamp || "—"}</div>
      </div>
    </div>
  );
};

// ---------- Main container ----------
/**
 * Props:
 *  - childrenList: Array<{ id?, name, watchId }>
 *  - baseUrl: string (default "http://localhost:14192")
 *  - useAuth: boolean (default false) — adds Bearer token from sessionStorage
 *  - maxAlertsPerChild: number (default 3)
 *  - showOKState: boolean (default false) — show a green “All good” row when no alerts
 */
export default function AlertsForChildren({
  childrenList = [],
  baseUrl = "http://localhost:14192",
  useAuth = false,
  maxAlertsPerChild = 3,
  showOKState = false,
}) {
  const [byWatch, setByWatch] = useState({}); // { [watchId]: latestSensor }

  const watchIds = useMemo(
    () => [...new Set(childrenList.map((c) => c.watchId).filter(Boolean))],
    [childrenList]
  );

  useEffect(() => {
    let abort = false;

    (async () => {
      if (watchIds.length === 0) {
        setByWatch({});
        return;
      }

      const headers = { "Content-Type": "application/json" };
      if (useAuth) {
        const token = sessionStorage.getItem("token");
        if (token) headers.Authorization = `Bearer ${token}`;
      }

      const results = await Promise.allSettled(
        watchIds.map((id) =>
          fetch(`${baseUrl}/api/sensor/${id}/today`, { headers }).then((r) => r.json())
        )
      );

      if (abort) return;

      const map = {};
      results.forEach((res, i) => {
        const wid = watchIds[i];
        if (res.status === "fulfilled" && Array.isArray(res.value) && res.value.length > 0) {
          map[wid] = res.value[res.value.length - 1]; // latest reading
        }
      });
      setByWatch(map);
    })();

    return () => {
      abort = true;
    };
  }, [watchIds, baseUrl, useAuth]);

  // Build alert rows (sorted: critical first, then warning; lowest battery & latest timestamp could be secondary sorts)
  const rows = useMemo(() => {
    const out = [];

    childrenList.forEach((c) => {
      const latest = c.watchId ? byWatch[c.watchId] : null;
      const alerts = buildAlertsFromReading(latest);

      // sort child's alerts: critical before warning
      alerts.sort((a, b) => {
        const rank = { critical: 0, warning: 1 };
        return (rank[a.severity] ?? 2) - (rank[b.severity] ?? 2);
      });

      // take top N
      alerts.slice(0, maxAlertsPerChild).forEach((a, idx) => {
        out.push({
          key: `${c.id ?? c.watchId ?? c.name}-a${idx}`,
          childName: c.name || "Unknown",
          alert: a,
          timestamp: latest?.timestamp,
          sortSeverity: a.severity,
          sortBatteryHint: a.type === "battery" ? (latest?.battery ?? 101) : 101,
        });
      });
    });

    // global sort: critical first; then lower battery first; finally most recent (if you want, parse timestamp)
    out.sort((x, y) => {
      const sevRank = { critical: 0, warning: 1 };
      const dSev = (sevRank[x.sortSeverity] ?? 2) - (sevRank[y.sortSeverity] ?? 2);
      if (dSev !== 0) return dSev;

      const dBattery = (x.sortBatteryHint ?? 101) - (y.sortBatteryHint ?? 101);
      if (dBattery !== 0) return dBattery;

      // optional: timestamp sort (newest first)
      const tx = x.timestamp ? Date.parse(x.timestamp) : 0;
      const ty = y.timestamp ? Date.parse(y.timestamp) : 0;
      return ty - tx;
    });

    return out;
  }, [childrenList, byWatch, maxAlertsPerChild]);

  if (rows.length === 0) {
    return showOKState ? (
      <div className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg border-l-4 bg-green-50 border-green-500">
        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 text-green-500" />
        <div className="text-sm text-green-700">
          {comman?.noalerts || "All good — no alerts right now"}
        </div>
      </div>
    ) : null;
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {rows.map((r) => (
        <AlertRow key={r.key} childName={r.childName} alert={r.alert} timestamp={r.timestamp} />
      ))}
    </div>
  );
}
