import React,{ useEffect, useState } from "react";
import { getLoans } from "../../api/dashboardService";

export default function LastLoans() {

  const [loans, setLoans] = useState([]);

  useEffect(() => {
    loadLoans();
  }, []);

  async function loadLoans() {
    const response = await getLoans();
    
    const sorted = response.data
      .map(l => ({
        user: l.userFullName || l.user || "Sin nombre",
        book: l.bookTitle || l.book || "Sin título",
        date: l.date || l.loanDate || l.fecha || l.createdAt
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    setLoans(sorted);
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">

      <h2 className="text-xl font-semibold mb-4 text-purple-700">Últimos préstamos</h2>

      <table className="w-full border-collapse">
        <thead>
          <tr className="text-gray-500 border-b border-gray-300">
            <th className="text-left py-2">Usuario</th>
            <th className="text-left py-2">Libro</th>
            <th className="text-left py-2">Fecha</th>
          </tr>
        </thead>

        <tbody>
          {loans.map((item, index) => (
            <tr key={index} className="border-b border-gray-200 text-gray-600">
              <td className="py-2">{item.user}</td>
              <td className="py-2">{item.book}</td>
              <td className="py-2">
                {new Date(item.date).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {loans.length === 0 && (
        <p className="text-gray-500 mt-4 text-sm">No hay préstamos registrados.</p>
      )}
    </div>
  );
}
