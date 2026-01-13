import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter.jsx";
import React from "react";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <BrowserRouter>
      <AppRouter />

      {/* Toaster global para toda la app */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#333",
            fontSize: "14px",
            borderRadius: "8px",
            border: "1px solid #eee"
          }
        }}
      />
    </BrowserRouter>
  );
}
