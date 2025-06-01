import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import App from "./App.jsx";
import Admin from "./Components/Admin/Admin.jsx";
import ReportTable from "./Components/Admin/ReportTable.jsx";
import IndoorMap from "./Components/IndoorMap.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="admin"
          element={
            <Admin />
          }
        />

      </Routes>
    </BrowserRouter>
  </StrictMode>
);
