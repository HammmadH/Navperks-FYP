import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import App from "./App.jsx";
import { ParkingContextProvider } from "./Context/ParkingContext.jsx";
import Admin from "./Components/Admin/Admin.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ParkingContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />

          <Route
            path="admin"
            element={
              // <AdminProvider>
                <Admin />
              // </AdminProvider>
            }
          />
        </Routes>
      </BrowserRouter>
    </ParkingContextProvider>
  </StrictMode>
);
