import React, { createContext, useContext, useState } from "react";

// Create the AdminContext
const AdminContext = createContext();

// Create the Provider Component
export const AdminProvider = ({ children }) => {
  const [adminData, setAdminData] = useState(null);
  const [rushedDay, setRushedDay] = useState("Monday");
  const [rushedHour, setRushedHour] = useState(5);
  const [announcements, setAnnouncements] = useState([
    { id: 1, announcement: "How are you", sequence: 1 },
    { id: 2, announcement: "How are you", sequence: 2 },
    { id: 3, announcement: "How are you", sequence: 3 },
  ]);
  // Function to set admin data
  const loginAsAdmin = (data) => {
    
    setAdminData(data);
  };

  const updateUsername = (data) => {
    // setAdminData(data);
  };
  const updatePassword = (data) => {
    // setAdminData(data);
  };

  // Function to clear admin data
  const logoutAsAdmin = () => {
    setAdminData(null);
  };

  const value = {
    adminData,
    loginAsAdmin,
    logoutAsAdmin,
    updateUsername,
    updatePassword,
    rushedDay,
    rushedHour,
    announcements,
    setAnnouncements
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

// Custom Hook
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
