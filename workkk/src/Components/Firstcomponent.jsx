import Logo from "../assets/Logo.jpg";

export default function FirstComponent() {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100">
      <img
        src={Logo}
        alt="logo"
        className="animate-bounce-smooth w-96 h-96"
      />
    </div>
  );
}
