import React, { useState } from "react";
import { useAdmin } from "../../Context/AdminContext";
import Login from "./Login";
import AdminBottomBar from "./AdminBottomBar";
import Home from "./Home";
import Slots from "./Slots";
import Account from "./Account";

const AdminDashboard = () => {
  const { adminData, logoutAsAdmin } = useAdmin();
  const [selectedComponent, setSelectedComponent] = useState('home'); 

  const handleSelectComponent = (component) => {
    setSelectedComponent(component);
  };

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'home':
        return <Home onSelect={handleSelectComponent} />;
      case 'slots':
        return <Slots onSelect={handleSelectComponent} />;
      case 'account':
        return <Account onSelect={handleSelectComponent} />;
      default:
        return <Home onSelect={handleSelectComponent} />;
    }
  };

  const handleLogout = () => {
    logoutAsAdmin();
  };

  return (
    <main>
      {adminData ? (
        <>
         { renderComponent()}
          <AdminBottomBar
          onSelect={handleSelectComponent}
          activeTab={selectedComponent}/>
        </>
      ) : (
        <Login/>
      )}
    </main>
  );
};

export default AdminDashboard;
