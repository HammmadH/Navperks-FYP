import React, { useState } from "react";
import Login from "./Login";
import AdminBottomBar from "./AdminBottomBar";
import Home from "./Home";
import Slots from "./Slots";
import Account from "./Account";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { useEffect } from "react";

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

const initialResponse = [
  {
    id: 1,
    announcementText: "There isn't any event or announcement for now in KIET.",
  },
]

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(
    localStorage.getItem("admin") || null
  );

  const [selectedComponent, setSelectedComponent] = useState("home");

  const [announcements, setAnnouncements] = useState(initialResponse);

  const [mySlots, setMySlots] = useState(initialSlots);
  const [selectedFloor, setSelectedFloor] = useState(0);

  const [rushedDay, setRushedDay] = useState("Monday");
  const [rushedHour, setRushedHour] = useState(5);

  useEffect(() => {
    if (!(adminData == null)) localStorage.setItem("admin", adminData);
  }, [adminData]);

  const fetchannouncements = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/Announcements`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        }
      );
      if (response.ok) {
        const result = await response.json();
        if (result.length > 0) {
          setAnnouncements(result); // Ensure this function is defined in your component
        }else {
          setAnnouncements(initialResponse);
        }
      } else {
        console.log("error");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    fetchannouncements()
  }, []);

  const loginAsAdmin = async (data) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/Admin/api/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const result = await response.text();
        setAdminData(data.username); // Ensure this function is defined in your component
        toast.success(`${result}`, {
          position: "top-right",
        });
      } else {
        const error = await response.text();
        console.log(error);
        toast.error(`Login Failed: ${error || "Unknown Error"}`, {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while logging in.", {
        position: "top-right",
      });
    }
  };

  const handleSelectComponent = (component) => {
    setSelectedComponent(component);
  };

  const handleAdd = async (announcement) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/Announcements`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          body: JSON.stringify(announcement),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Announcement Added",
          text: "The announcement has been successfully added.",
          confirmButtonText: "OK",
        });
        fetchannouncements()
      } else {
        const error = await response.text();
        Swal.fire({
          icon: "error",
          title: "Failed to Add Announcement",
          text: error || "An unknown error occurred.",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Unable to connect to the server. Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const handleEdit = async (id, updatedAnnouncement) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/Announcements/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          body: JSON.stringify(updatedAnnouncement),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Announcement edited",
          text: "The announcement has been successfully edited.",
          confirmButtonText: "OK",
        });
        fetchannouncements()
      } else {
        const error = await response.text();
        Swal.fire({
          icon: "error",
          title: "Failed to Edit Announcement",
          text: error || "An unknown error occurred.",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Unable to connect to the server. Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/Announcements/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Announcement Deleted",
          text: "The announcement has been successfully deleted.",
          confirmButtonText: "OK",
        });
        fetchannouncements()
      } else {
        const error = await response.text();
        Swal.fire({
          icon: "error",
          title: "Failed to Delete Announcement",
          text: error || "An unknown error occurred.",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Unable to connect to the server. Please try again later.",
        confirmButtonText: "OK",
      });
    }
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

  const updatePassword = async (data) => {
   try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/Admin/api/admin/update-password`,{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({
          newPassword: data
        }),
      })
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Password Updated",
          text: "The Password has been successfully updated.",
          confirmButtonText: "OK",
        });
        fetchannouncements()
      } else {
        const error = await response.text();
        Swal.fire({
          icon: "error",
          title: "Failed to Update Password",
          text: error || "An unknown error occurred.",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Unable to connect to the server. Please try again later.",
        confirmButtonText: "OK",
      });
    }
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
      case "home":
        return (
          <Home
            onSelect={handleSelectComponent}
            announcements={announcements}
            handleAdd={handleAdd}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        );
      case "slots":
        return (
          <Slots
            onSelect={handleSelectComponent}
            mySlots={mySlots}
            selectedFloor={selectedFloor}
            setSelectedFloor={setSelectedFloor}
            handleSlotClick={handleSlotClick}
          />
        );
      case "account":
        return (
          <Account
            onSelect={handleSelectComponent}
            adminData={adminData}
            updatePassword={updatePassword}
            rushedDay={rushedDay}
            rushedHour={rushedHour}
          />
        );
      default:
        return (
          <Home
            onSelect={handleSelectComponent}
            announcements={announcements}
            handleAdd={handleAdd}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        );
    }
  };

  return (
    <main className="overflow-y-scroll ">
      <ToastContainer />
      {console.log(typeof adminData)}
      {!(adminData == null) ? (
        <>
          {renderComponent()}
          <AdminBottomBar
            onSelect={handleSelectComponent}
            activeTab={selectedComponent}
          />
        </>
      ) : (
        <Login loginAsAdmin={loginAsAdmin} />
      )}
    </main>
  );
};

export default AdminDashboard;
