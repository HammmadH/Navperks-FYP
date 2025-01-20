import React, { useState } from "react";
import Login from "./Login";
import AdminBottomBar from "./AdminBottomBar";
import Home from "./Home";
import Slots from "./Slots";
import Account from "./Account";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2";


const initialSlots = [
  {
    floor: "Floor 1",
    slots: [
      { id: "F1-S1", reserved: false },
      { id: "F1-S2", reserved: false },
      { id: "F1-S3", reserved: false },
      { id: "F1-S4", reserved: false },
      { id: "F1-S5", reserved: false },
      { id: "F1-S6", reserved: false },
    ],
  },
  {
    floor: "Floor 2",
    slots: [
      { id: "F2-S1", reserved: false },
      { id: "F2-S2", reserved: false },
      { id: "F2-S3", reserved: false },
      { id: "F2-S4", reserved: false },
      { id: "F2-S5", reserved: false },
      { id: "F2-S6", reserved: false },
    ],
  },
  {
    floor: "Floor 3",
    slots: [
      { id: "F3-S1", reserved: false },
      { id: "F3-S2", reserved: false },
      { id: "F3-S3", reserved: false },
      { id: "F3-S4", reserved: false },
      { id: "F3-S5", reserved: false },
      { id: "F3-S6", reserved: false },
    ],
  },
];

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);

  const [selectedComponent, setSelectedComponent] = useState('home');

  const [announcements, setAnnouncements] = useState([
    { id: 1, announcement: "How are you ffdfger rtyrs rt rretry eryetyer eryety ery ryey reyye  ry " },
    { id: 2, announcement: "How are you" },
    { id: 3, announcement: "How are you" },
  ]);

  const [mySlots, setMySlots] = useState(initialSlots)
  const [selectedFloor, setSelectedFloor] = useState(0);

  const [rushedDay, setRushedDay] = useState("Monday");
  const [rushedHour, setRushedHour] = useState(5);



  const loginAsAdmin = (data) => {

    setAdminData(data);
    toast.success("Logged in Successfully!", {
      position: "top-right"
    });
  };

  const handleSelectComponent = (component) => {
    setSelectedComponent(component);
  };

  const handleAdd = (announcement) => {
    alert(announcement)
  }

  const handleEdit = (id, updatedAnnouncement) => {
      setAnnouncements((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, announcement: updatedAnnouncement } : a
        )
      );
    
  };

  const handleDelete = (id) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const bookSlot = (floorIndex, slotIndex, carNumber) => {
    setMySlots((prevSlots) =>
      prevSlots.map((floor, fIndex) =>
        fIndex === floorIndex
          ? {
            ...floor,
            slots: floor.slots.map((slot, sIndex) =>
              sIndex === slotIndex ? { ...slot, reserved: true } : slot
            ),
          }
          : floor
      )
    );
    Swal.fire("Success", "Slot booked successfully!", "success");
  };

  const emptySlot = (floorIndex, slotIndex) => {
    setMySlots((prevSlots) =>
      prevSlots.map((floor, fIndex) =>
        fIndex === floorIndex
          ? {
            ...floor,
            slots: floor.slots.map((slot, sIndex) =>
              sIndex === slotIndex ? { ...slot, reserved: false } : slot
            ),
          }
          : floor
      )
    );
    Swal.fire("Success", "Slot emptied successfully!", "success");
  };

  const handleSlotClick = (floorIndex, slotIndex) => {
    const selectedSlot = mySlots[floorIndex].slots[slotIndex];
    
    if (selectedSlot.reserved) {
      Swal.fire({
        title: "Confirm",
        text: "Do you want to empty this slot?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, empty it",
      }).then((result) => {
        if (result.isConfirmed) {
          emptySlot(floorIndex, slotIndex);
        }
      });
    } else {
      Swal.fire({
        title: "Book Slot",
        text: "Enter your car number to book this slot:",
        icon: "info",
        input: "text", // Input field for car number
        inputPlaceholder: "Enter car number",
        showCancelButton: true,
        confirmButtonText: "Book Slot",
        preConfirm: (carNumber) => {
          if (!carNumber) {
            Swal.showValidationMessage("Car number is required!");
          }
          return carNumber; // Return car number to `.then()`
        },
      }).then((result) => {
        if (result.isConfirmed) {
          bookSlot(floorIndex, slotIndex, result.value); // Use the entered car number
        }
      });
    }
  };
  

  const updatePassword = (data) => {
    // setAdminData(data);
  };

  // Function to clear admin data
  const logoutAsAdmin = () => {
    setAdminData(null);
  };

  const handleLogout = () => {
    logoutAsAdmin();
  };


  const renderComponent = () => {
    switch (selectedComponent) {
      case 'home':
        return <Home onSelect={handleSelectComponent} announcements={announcements} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete}/>;
      case 'slots':
        return <Slots onSelect={handleSelectComponent} mySlots={mySlots} selectedFloor={selectedFloor} setSelectedFloor={setSelectedFloor} handleSlotClick={handleSlotClick} />;
      case 'account':
        return <Account onSelect={handleSelectComponent} adminData={adminData} updatePassword={updatePassword} rushedDay={rushedDay} rushedHour={rushedHour} />;
      default:
        return <Home onSelect={handleSelectComponent} announcements={announcements} handleAdd={handleAdd} handleEdit={handleEdit} handleDelete={handleDelete}/>;
    }
  };



  return (
    <main className="overflow-y-scroll">
      <ToastContainer />
      {adminData ? (
        <>
          {renderComponent()}
          <AdminBottomBar
            onSelect={handleSelectComponent}
            activeTab={selectedComponent} />
        </>
      ) : (
        <Login loginAsAdmin={loginAsAdmin} />
      )}
    </main>
  );
};

export default AdminDashboard;
