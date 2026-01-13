import { Route, Routes } from "react-router-dom";
import MainLayout from "../layout/MainLayout.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import Books from "../pages/Books/Books.jsx";
import Users from "../pages/Users/Users.jsx";
import Loans from "../pages/Loans/Loans.jsx";
import Authors from "../pages/Authors/Authors.jsx"; 
import Categories from "../pages/Categories/Categories.jsx";
import React from "react";

export default function AppRouter() {
  return (
    
    <Routes>
      {/* Ruta Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/books" element={<Books />} />
        <Route path="/users" element={<Users />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/authors" element={<Authors />} />
        <Route path="/categories" element={<Categories />} />
      </Route>
    </Routes>
  );
}
