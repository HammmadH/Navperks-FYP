import React, { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5"; // Import icons
import Logo from "../../assets/Logo.jpg";
    

function Login({loginAsAdmin}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ username: "", password: "" });

  const validateForm = () => {
    const newErrors = { username: "", password: "" };
    if (!username) {
      newErrors.email = "Email is required.";
    } 
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const LoginHandler = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    loginAsAdmin({username, password})
    
   
  };

  return (
    <section className="bg-white min-h-screen flex items-center justify-center">
     
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto w-full sm:max-w-md">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-black ">
          <img className="w-8 h-8 mr-2" src={Logo} alt="logo" />
          Navperks
        </a>
        <div className="w-full bg-white rounded-lg shadow ">
          <div className="p-6 space-y-4 sm:space-y-6">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-black ">
              Sign in to your account
            </h1>
            <form className="space-y-4 sm:space-y-6" onSubmit={LoginHandler} noValidate>
              {/* Email Field */}
              <div>
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 ">
                  Your Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-[#17502d] focus:border-[#17502d] block w-full p-2.5"
                  placeholder="Enter Your Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {errors.username && (
                  <p className="mt-1 text-sm bg-red-50 text-red-600  px-2 py-1 rounded-lg shadow-md">
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-[#17502d] focus:border-[#17502d] block w-full p-2.5 "
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
                      <IoEyeOffOutline size={20} aria-label="Show password" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm bg-red-50 text-red-600 px-2 py-1 rounded-lg shadow-md">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full text-white bg-[#2cc40d]  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
