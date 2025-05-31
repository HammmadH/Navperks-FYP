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
import { method } from "lodash";
import { carNames } from "../BookSlot";
import car1 from "../../assets/SEDAN.jpeg";
import car2 from "../../assets/SUV2.jpeg";
import car3 from "../../assets/HATCHBACK.jpeg";
import car4 from "../../assets/PICKUP.jpeg";
import { simpleDecrypt } from "../../datasafety";
import { simpleEncrypt } from "../../datasafety";

const initialSlots = [
  {
    floor: "COCIS",
    slots: [
      { id: 1, code: "CS-S1", isFree: false },
      { id: 2, code: "CS-S2", isFree: false },
      { id: 3, code: "CS-S3", isFree: false },
      { id: 4, code: "CS-S4", isFree: false },
      { id: 5, code: "CS-S5", isFree: false },
      { id: 6, code: "CS-S6", isFree: false },
    ],
  },
  {
    floor: "COMS",
    slots: [
      { id: 7, code: "CM-S1", isFree: false },
      { id: 8, code: "CM-S2", isFree: false },
      { id: 9, code: "CM-S3", isFree: false },
      { id: 10, code: "CM-S4", isFree: false },
      { id: 11, code: "CM-S5", isFree: false },
      { id: 12, code: "CM-S6", isFree: false },
    ],
  },
];

const initialResponse = [
  {
    id: 1,
    announcementText: "There isn't any event or announcement for now in KIET.",
  },
];

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(
    simpleDecrypt(localStorage.getItem(simpleEncrypt("admin"))) || null
  );

  const [selectedComponent, setSelectedComponent] = useState("home");

  const [announcements, setAnnouncements] = useState(initialResponse);

  const [mySlots, setMySlots] = useState(initialSlots);

  const [selectedFloor, setSelectedFloor] = useState(0);

  const [rushedDay, setRushedDay] = useState({
    statisticType: "Rush Day",
    value: "Tuesday",
    reservationCount: 2,
  });
  const [rushedHour, setRushedHour] = useState({
    statisticType: "Rush Hour",
    value: "5 PM",
    reservationCount: 1,
  });

  const [data, setData] = useState([]);

  useEffect(() => {
    if (!(adminData == null)) localStorage.setItem(simpleEncrypt("admin"), simpleEncrypt(adminData));
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
        } else {
          setAnnouncements(initialResponse);
        }
      } else {
        console.log("error");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getAllSlots = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/Reservation/real-time`
    );

    if (response.ok) {
      const slots = await response.json();
      const groupedSlots = slots.reduce((acc, slot) => {
        const floor = slot.slotCode.split("-")[0]; // Extract floor name from slotCode
        const floorIndex = acc.findIndex((item) => item.floor === floor);

        const slotData = {
          id: slot.slotId,
          code: slot.slotCode,
          reserved: !slot.isFree,
        };

        if (floorIndex >= 0) {
          // Add slot to existing floor
          acc[floorIndex].slots.push(slotData);
        } else {
          // Create a new floor group
          acc.push({
            floor: floor,
            slots: [slotData],
          });
        }

        return acc;
      }, []);

      setMySlots(groupedSlots);
    } else {
      setMySlots(initialSlots);
    }
  };

  const calculateRushedData = async () => {
    const rushedData = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/statistics/rush`
    );
    if (rushedData.ok) {
      const data = await rushedData.json();
      const rh = data.find((d) => {
        return d.statisticType === "Rush Hour";
      });
      setRushedHour(rh);
      const rd = data.find((d) => {
        return d.statisticType === "Rush Day";
      });
      setRushedDay(rd);
    } else {
      console.log("first");
    }
  };

  const getAnalytics = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/Reservation/api/reservationsdetails`
    );
    if (response.ok) {
      const data = await response.json();
      setData(data);
    }
  };

  useEffect(() => {
    fetchannouncements();
  }, []);

  useEffect(() => {
    getAllSlots();
  }, []);

  useEffect(() => {
    calculateRushedData();
  }, []);

  useEffect(() => {
    getAnalytics();
  }, []);

  const loginAsAdmin = async (data) => {
    0
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/Admin/api/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          body: JSON.stringify({
            username: data.username,
            password: simpleEncrypt(data.password)
          }),
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
        fetchannouncements();
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
        fetchannouncements();
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
        fetchannouncements();
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

  const bookSlot = async (slot, carNumber, carType) => {
    console.log("book slot", carType);
    let userId = null;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/UserA`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            carNumber,
          }),
        }
      );
      if (response.ok) {
        toast.success("User Registered Successfully", {
          position: "top-right",
        });
        getAnalytics();
        const data = await response.json();
        userId = data.userId;
      } else {
        toast.error("User Not Registered", {
          position: "top-right",
        });
      }

      if (userId != null) {
        const reserveSlot = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/ReservationA`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: 0,
              userAId: userId,
              slotCode: slot.code,
              carType,
            }),
          }
        );
        if (reserveSlot.ok) {
          console.log(reserveSlot);
          toast.success("Slot Reserved Successfully", {
            position: "top-right",
          });
          getAllSlots();
        } else {
          toast.error("Slot cannot be reserved", {
            position: "top-right",
          });
        }
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("An error occurred", {
        position: "top-right",
      });
    }
  };

  const emptySlot = async (reservationid) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/Reservation/${reservationid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: 0,
            userAId: 0,
            slotCode: "string",
            carType: "string",
          }),
        }
      );
      if (response.ok) {
        const message = await response.json();
        // alert(message.message)
        toast.success(`${message.message}`, {
          position: "top-right",
        });
        getAnalytics();
        getAllSlots();
      } else {
        toast.error("Failed to Release Slot", {
          position: "top-right",
        });
      }
    } catch (error) {
      toast.error("failed to Release Slot", {
        position: "top-right",
      });
    }
  };
  const handleSlotClick = (slot) => {
    // console.log(/slot)

    let mycarnames = {};
    carNames.forEach((c, index) => {
      mycarnames[index] = c.name + " " + "(" + c.type + ")";
    });
    // let val1;
    if (slot.reserved) {
      Swal.fire({
        title: "Empty Slot",
        text: "Enter Reservation Id to release the slot:",
        icon: "error",
        input: "text", // Input field for car number
        inputPlaceholder: "Enter Reservation Id",
        showCancelButton: true,
        confirmButtonText: "Empty Slot",
        preConfirm: (ReservationId) => {
          if (!ReservationId) {
            Swal.showValidationMessage("ReservationId is required!");
          }
          return ReservationId; // Return car number to `.then()`
        },
      }).then((result) => {
        if (result.isConfirmed) {
          // val1 = result.value

          emptySlot(result.value);
        }
      });
    } else {
      let value1;
      let userRegistered = false;

      Swal.fire({
        title: "Book Slot",
        text: "Enter your car number to book this slot:",
        input: "text",
        inputPlaceholder: "Enter car number",
        showCancelButton: true,
        confirmButtonText: "Book Slot",
        didOpen: () => {
          const input = Swal.getInput();
          input.setAttribute("autocomplete", "off");
          input.setAttribute("maxlength", "8");
          input.setAttribute("minLength", "6") // Prevent typing after 8 characters

          input.addEventListener("input", () => {
            if (input.value.length > 8) {
              input.value = input.value.slice(0, 8);
            }
          });
        },
        preConfirm: (carNumber) => {
          if (!carNumber) {
            Swal.showValidationMessage("Car number is required!");
          } else if (carNumber.length > 8) {
            Swal.showValidationMessage("Maximum 8 characters are allowed");
          }
          else if (carNumber.length < 6) {
            Swal.showValidationMessage("Minimum 6 characters are allowed");
          }
          return carNumber;
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const carNumberValue = result.value;
          userRegistered = true;

          // Now show the image-based selection
          Swal.fire({
            title: `Reserve Slot ${slot.code}?`,
            html: `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 10px;">
      <div class="car-option" data-value="sedan" style="text-align: center; border: 1px solid #ccc; padding: 10px; cursor: pointer; border-radius: 8px;">
        <img src=${car1} style="width: 100%; height: 90px;" />
        <div style="margin-top: 8px; font-weight: 500;">Sedan</div>
      </div>
      <div class="car-option" data-value="suv" style="text-align: center; border: 1px solid #ccc; padding: 10px; cursor: pointer; border-radius: 8px;">
        <img src=${car2} style="width: 100%; height: 90px;" />
        <div style="margin-top: 8px; font-weight: 500;">Suv</div>
      </div>
      <div class="car-option" data-value="hatchback" style="text-align: center; border: 1px solid #ccc; padding: 10px; cursor: pointer; border-radius: 8px;">
        <img src=${car3} style="width: 100%; height: 90px;" />
        <div style="margin-top: 8px; font-weight: 500;">Hatchback</div>
      </div>
      <div class="car-option" data-value="pickup" style="text-align: center; border: 1px solid #ccc; padding: 10px; cursor: pointer; border-radius: 8px;">
        <img src=${car4} style="width: 100%; height: 90px;" />
        <div style="margin-top: 8px; font-weight: 500;">Pickup</div>
      </div>
    </div>
  `,
            showConfirmButton: false,
            showCancelButton: true,
            didOpen: () => {
              const options =
                Swal.getHtmlContainer().querySelectorAll(".car-option");
              options.forEach((option) =>
                option.addEventListener("click", () => {
                  const selectedType = option.getAttribute("data-value");
                  Swal.close();
                  bookSlot(slot, carNumberValue, selectedType);
                })
              );
            },
          });
        }
      });

      if (userRegistered) {
      }
    }
  };

  const updatePassword = async (data) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/Admin/api/admin/update-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          body: JSON.stringify({
            username: adminData,
            newPassword: simpleEncrypt(data),
          }),
        }
      );
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Password Updated",
          text: "The Password has been successfully updated.",
          confirmButtonText: "OK",
        });
        fetchannouncements();
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

  const handleLogout = () => {
    setAdminData(null);
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
            data={data}
            getAnalytics={getAnalytics}
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
