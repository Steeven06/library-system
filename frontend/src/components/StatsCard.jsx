import React from "react";

export default function StatsCard({ title, value, icon, color = "blue" }) {

  const colorMap = {
    blue: "from-blue-500 to-blue-600 text-white",
    green: "from-green-500 to-green-600 text-white",
    violet: "from-violet-500 to-violet-600 text-white",
    orange: "from-orange-500 to-orange-600 text-white",
    pink: "from-pink-500 to-pink-600 text-white",
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.12)] transition">
      
      <div className="flex items-center gap-4">
        
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center`}>
          {icon}
        </div>

        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>

      </div>
    </div>
  );
}
