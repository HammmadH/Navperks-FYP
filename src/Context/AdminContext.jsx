import React, { createContext, useContext, useState } from "react";

// Create the AdminContext
const AdminContext = createContext();

// Create the Provider Component
export const AdminProvider = ({ children }) => {
  const [adminData, setAdminData] = useState(null);

  // Function to set admin data
  const loginAsAdmin = (data) => {
    setAdminData(data);
  };

  // Function to clear admin data
  const logoutAsAdmin = () => {
    setAdminData(null);
  };

  const value = {
    adminData,
    loginAsAdmin,
    logoutAsAdmin,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

// Custom Hook
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
