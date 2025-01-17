import { useState, useEffect } from "react";
import Logo from "../../assets/Logo.jpg";
import { RxCross2 } from "react-icons/rx";
import { IoMdAdd } from "react-icons/io";
import { useAdmin } from "../../Context/AdminContext";

export default function Home({ onSelect }) {
  const { announcements, setAnnouncements } = useAdmin();
  const [isAnnouncementContainerOpen, setIsAnnouncementContainerOpen] =
    useState(false);
  const [text, setText] = useState(
    "There is no any event or notice for now in KIET."
  );
  const [work, setWork] = useState(null);

  const handleAdd = (announcement) => {
    alert(announcement)
  }
  const handleEdit = (id) => {
    const announcementToEdit = announcements.find((a) => a.id === id);
    const updatedAnnouncement = prompt(
      "Edit the announcement:",
      announcementToEdit.announcement
    );
    if (updatedAnnouncement) {
      setAnnouncements((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, announcement: updatedAnnouncement } : a
        )
      );
    }
  };

  const handleDelete = (id) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="flex flex-col justify-start overflow-auto w-full h-full bg-white">
      <div className="flex flex-col -mt-5 justify-start items-center bg-none border-b-black ">
        <img className="w-3/5" src={Logo} alt="Logo" />
        <span className="font-bold text-3xl -mt-2">Admin Dashboard</span>
      </div>
      <div className="py-5 mt-10 h-full flex flex-col gap-y-2 my-auto ">
        <div className="flex justify-between items-center px-5"><h1 className="font-bold text-4xl">Hi,</h1> <button
          onClick={() => {
            setIsAnnouncementContainerOpen(true)
            setWork("add")
          }

          }
          className="py-3 px-5 flex items-center gap-x-2 bg-[#2cc40d] text-white rounded-lg"
        >
          Add <IoMdAdd />
        </button></div>
        {announcements
          .sort((a, b) => a.sequence - b.sequence)
          .map((a) => (
            <div className="flex items-center px-5 py-2" key={a.id}>
              {/* Three-dot Menu */}
              <div className="relative group">
                <button className="text-xl text-gray-500 focus:outline-none">
                  •••
                </button>
                {/* Tooltip */}
                <div className="absolute left-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg hidden group-hover:block">
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleEdit(a.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-100"
                    onClick={() => handleDelete(a.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              {/* Announcement Text */}
              <p className="text-lg text-[#17502d] font-semibold ml-3">
                {a.announcement}
              </p>
            </div>
          ))}
      </div>
      <Announcement isOpen={isAnnouncementContainerOpen} setIsAnnouncementContainerOpen={setIsAnnouncementContainerOpen} work={work} submitAnnouncement={handleAdd} />
    </div>
  );
}
const Announcement = ({
  isOpen,
  setIsAnnouncementContainerOpen,
  work = "add", // Defaults to "add" if no mode is passed
  submitAnnouncement,
  initialAnnouncement = "", // For editing, pass the current announcement text
}) => {
  const [announcement, setAnnouncement] = useState("");

  // Reset announcement state when `work`, `initialAnnouncement`, or `isOpen` changes
  useEffect(() => {
    if (isOpen) {
      setAnnouncement(work === "add" ? "" : initialAnnouncement);
    }
  }, [work, initialAnnouncement, isOpen]);

  return (
    <div
      className={`fixed bottom-0 right-0 w-full sm:w-1/2 h-3/5 z-50 bg-white text-black transform ${
        isOpen ? "translate-y-0" : "translate-y-full"
      } transition-transform duration-700 ease-in-out`}
    >
      <div className="w-full h-full py-5 relative">
        {/* Close Button */}
        <RxCross2
          size={40}
          className="absolute top-5 right-5 rounded-full bg-gray-100 p-2 cursor-pointer"
          onClick={() => {
            setIsAnnouncementContainerOpen(false);
          }}
        />
        {/* Form Container */}
        <div className="p-5">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto w-full sm:max-w-md">
            <div className="w-full bg-white rounded-lg shadow">
              <div className="p-6 space-y-4 sm:space-y-6">
                {/* Header */}
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900">
                  {work === "add" ? "Add an Announcement" : "Edit Announcement"}
                </h1>
                {/* Form */}
                <form
                  className="space-y-4 sm:space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault(); // Prevent page reload
                    submitAnnouncement(announcement); // Pass the announcement text
                  }}
                  noValidate
                >
                  <div>
                    {/* Textarea for Announcement */}
                    <textarea
                      rows={4}
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-[#17502d] focus:border-[#17502d] block w-full p-2.5"
                      placeholder="Your Announcement Goes Here"
                      value={announcement}
                      onChange={(e) => setAnnouncement(e.target.value)}
                    ></textarea>
                  </div>
                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full text-white bg-[#2cc40d] focus:ring-4 focus:outline-none focus:ring-[#2cc40d] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    {work === "add" ? "Add Announcement" : "Save Changes"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

