import { Thermometer } from "lucide-react";
import { Thresholds } from "../changable/thresholds";
import {comman} from  "../en/comman"

const TempAlert = ({ name, temp, lastSeen }) => {
    if (temp <= Thresholds.hightemp) return null;


  return (
    <div className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
      <Thermometer className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-orange-900 text-sm">{name}</div>
        <div className="text-xs sm:text-sm text-orange-700">
           {comman.hightemp}({temp}°C)
        </div>
        <div className="text-xs text-orange-600 mt-1">{lastSeen}</div>
      </div>
    </div>
  );
};

export default TempAlert;
