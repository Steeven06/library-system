import React, { useEffect, useState } from "react";
import { getUsers, getBooks, getLoans } from "../../api/dashboardService";
import StatsCard from "../../components/StatsCard";
import LoansChart from "./LoansChart";
import LastLoans from "./LastLoans";
import { UserIcon, BookOpenIcon, ClipboardIcon } from "@heroicons/react/24/outline";




export default function Dashboard() {

  const [stats, setStats] = useState({
    users: 0,
    books: 0,
    loans: 0,
    loansByMonth: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const users = await getUsers();
    const books = await getBooks();
    const loans = await getLoans();

    const grouped = groupLoansByMonth(loans.data);

    setStats({
      users: users.data.length,
      books: books.data.length,
      loans: loans.data.length,
      loansByMonth: grouped,
    });
  }

  function groupLoansByMonth(loans) {
    const result = {};

    loans.forEach(l => {
      const fecha = l.date || l.loanDate || l.fecha || l.createdAt;

      if (!fecha) return; // evita errores

      const month = new Date(fecha).toLocaleString("es-ES", { month: "short" });

      result[month] = (result[month] || 0) + 1;
    });

    return Object.entries(result).map(([month, value]) => ({
      month,
      value
    }));
  }

  return (
    <div className="p-6 text-black">

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <StatsCard title="Usuarios" value={stats.users} icon={<UserIcon className="w-8" />} color="blue" />
        <StatsCard title="Libros" value={stats.books} icon={<BookOpenIcon className="w-8" />} color="violet" />
        <StatsCard title="Préstamos" value={stats.loans} icon={<ClipboardIcon className="w-8" />}color="green" />
      </div>

      {/* Gráfico */}
      <LastLoans />
      <LoansChart data={stats.loansByMonth} />
       
     


    </div>
  );
}
