import React, { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5"; // Import icons
import { RxCross2 } from "react-icons/rx";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";



ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);


function Account({adminData, updatePassword, rushedDay, rushedHour}) {
  console.log(rushedDay)
  const [isEditAccountDetailsOpen, setIsEditAccountDetailsOpen] =
    useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [errors, setErrors] = useState({
    password: "",
    newPassword: "",
  });
  const validatePasswords = () => {
    const newErrors = { password: "", newPassword: "" };
  
    // Define regex for validation
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
  
    // Validate current password
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (!uppercaseRegex.test(password)) {
      newErrors.password = "Password must include at least one uppercase letter.";
    } else if (!lowercaseRegex.test(password)) {
      newErrors.password = "Password must include at least one lowercase letter.";
    } else if (!numberRegex.test(password)) {
      newErrors.password = "Password must include at least one number.";
    } else if (!specialCharRegex.test(password)) {
      newErrors.password = "Password must include at least one special character.";
    } else if (!newPassword) {
      newErrors.newPassword = "Confirm Password is required.";
    } else if (!(password === newPassword)) {
      newErrors.newPassword = "Confirm password must be same password.";
    }
  
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };
  


  const updatePasswordHandler = async (event) => {
    event.preventDefault();
    if (!validatePasswords()) return;

    updatePassword(password);
    setIsEditAccountDetailsOpen(false)
  };

  const [viewMode, setViewMode] = useState("days"); // State for dropdown selection

  // Sample data for days and hours
  const dataByDays = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    datasets: [
      {
        label: "Number of Cars",
        data: [50, 75, 100, 125, 150, 175, 20],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const dataByHours = {
    labels: ["6 AM", "9 AM", "12 PM", "3 PM", "6 PM", "9 PM"],
    datasets: [
      {
        label: "Number of Cars",
        data: [30, 60, 90, 120, 80, 50],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  // Determine which data to display based on the dropdown selection
  const chartData = viewMode === "days" ? dataByDays : dataByHours;

  return (
    <div className="w-full h-screen p-5 bg-gray-100">
      <div className="flex flex-col gap-y-2">
        <p className="text-2xl font-bold text-[#2cc40d]">
          Hi{" "}
          <span className="text-3xl text-[#17502d]">
            {adminData || "Admin"}
          </span>
          ,
        </p>
        <button
          className="w-full py-3 text-center bg-[#2cc40d] text-2xl rounded-lg text-white"
          onClick={() => {
            setIsEditAccountDetailsOpen(true);
          }}
        >
          Edit Account Details
        </button>
        <div className="my-2 text-2xl font-semibold flex flex-col gap-y-2">
          <div className="flex justify-between  items-center">
            <div className="text-[#2cc40d]">Rushed Day:</div>
            <div className="text-[#17502d]">{rushedDay.value}</div>
          </div>
          <div className="flex justify-between  items-center">
            <div className="text-[#2cc40d]">Rushed Hour:</div>
            <div className="text-[#17502d]">{rushedHour.value}</div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h2 className="text-xl font-bold mb-4 md:mb-0">Analytics</h2>
          <select
            className="border border-gray-300 bg-gray-100 rounded-md p-2 w-full md:w-auto overflow-hidden"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
          >
            <option className="bg-white" value="days">Days</option>
            <option value="hours">Hours</option>
          </select>
        </div>
        <div className="relative w-full">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false, // Allows the graph to resize properly
              plugins: {
                legend: {
                  position: "top",
                },
              },
              scales: {
                x: {
                  grid: {
                    display: false, // Optionally hide gridlines for cleaner look
                  },
                },
                y: {
                  ticks: {
                    stepSize: 50, // Adjust step size for better readability
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="flex justify-between text-lg mt-5 text-white text-center font-semibold align-middle">
        <div className="flex-[0_0_calc(50%-0.25rem)] bg-[#2cc40d] py-3 rounded-xl">View Report</div>
        <div className="flex-[0_0_calc(50%-0.25rem)] bg-[#2cc40d] py-3 rounded-xl">Download Report</div>
      </div>
      <div
        className={`fixed top-0 inset-x-0 w-screen h-full   z-50 bg-white text-black transform ${isEditAccountDetailsOpen ? "translate-y-0" : "translate-y-full"
          } transition-transform duration-700 ease-in-out`}
      >
        <div className="w-full h-full">

          <RxCross2
            size={40}
            className="absolute top-5 right-5 mt-5  rounded-full bg-gray-100 p-2"
            onClick={() => {
              setIsEditAccountDetailsOpen(false);
            }}
          />
          <section className="bg-gray-100 flex flex-col items-center justify-around h-full pb-14">
          
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto w-full sm:max-w-md">
              <div className="w-full bg-white rounded-lg shadow dark:border">
                <div className="p-6 space-y-4 sm:space-y-6">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900">
                    Update Password
                  </h1>
                  <form
                    className="space-y-4 sm:space-y-6"
                    onSubmit={updatePasswordHandler}
                    noValidate
                  >
                    <div>
                      <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          id="password"
                          placeholder="••••••••"
                          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-[#17502d] focus:border-[#17502d] block w-full p-2.5"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute bg-none inset-y-0 right-0 pr-3 flex items-center text-gray-700 "
                        >
                          {showPassword ? (
                            <IoEyeOutline size={20} aria-label="Hide password" />
                          ) : (
                            <IoEyeOffOutline
                              size={20}
                              aria-label="Show password"
                            />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-sm bg-red-50 text-red-600 dark:bg-red-900 dark:text-red-400 px-2 py-1 rounded-lg shadow-md">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="password"
                          id="password"
                          placeholder="••••••••"
                          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-[#17502d] focus:border-[#17502d] block w-full p-2.5 "
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute bg-none inset-y-0 right-0 pr-3 flex items-center text-gray-700"
                        >
                          {showNewPassword ? (
                            <IoEyeOutline size={20} aria-label="Hide password" />
                          ) : (
                            <IoEyeOffOutline
                              size={20}
                              aria-label="Show password"
                            />
                          )}
                        </button>
                      </div>
                      {errors.newPassword && (
                        <p className="mt-1 text-sm bg-red-50 text-red-600 dark:bg-red-900 dark:text-red-400 px-2 py-1 rounded-lg shadow-md">
                          {errors.newPassword}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full text-white bg-[#2cc40d] focus:ring-4 focus:outline-none focus:ring-[#2cc40d] font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                    >
                      Update Password
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section></div>

      </div>
    </div>
  );
}

export default Account;
