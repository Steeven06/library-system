import React, { useEffect, useState } from "react";

function LoansChart({ data }) {
  
  const emptyData = !data || data.length === 0;
  const maxValue = emptyData ? 0 : Math.max(...data.map(d => d.value));
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-8">
      <h2 className="text-lg font-semibold mb-4 text-blue-600">
        Préstamos por mes
      </h2>

      {emptyData ? (
        <p className="text-gray-500">No hay datos de préstamos por mes.</p>
      ) : (
        <div className="flex items-end gap-6 h-48 pb-4 border-b border-gray-300">
          {data.map((item, index) => {
            const finalHeight = (item.value / maxValue) * 100;

            return (
              <div key={index} className="flex flex-col items-center justify-end h-full">

                <div
                  className="w-10 bg-blue-500 rounded-md transition-[height] duration-700 ease-out hover:bg-blue-600 hover:scale-105"
                  style={{
                    height: animated ? `${finalHeight}%` : "0%",
                  }}
                ></div>

                <span className="mt-2 text-sm font-semibold text-gray-700">
                  {item.value}
                </span>

                <span className="text-xs text-gray-500 mt-1">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default LoansChart;
