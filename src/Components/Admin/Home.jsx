import { useState, useEffect } from "react";
import Logo from "../../assets/Logo.jpg";
import { RxCross2 } from "react-icons/rx";
import { IoMdAdd } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function Home({ onSelect, announcements, handleAdd, handleEdit, handleDelete }) {

  const [isAnnouncementContainerOpen, setIsAnnouncementContainerOpen] =
    useState(false);
  const [work, setWork] = useState("add");
  const [initialAnnouncement, setInitialAnnouncement] = useState("")
  const [openTooltip, setOpenTooltip] = useState(null);
  const [id, setId] = useState(0)

  const handleTooltipToggle = (id) => {
    setOpenTooltip(openTooltip === id ? null : id);
  };

  const handleClickOutside = (event) => {
    // Close the tooltip if clicking outside of it
    if (!event.target.closest(".tooltip-container")) {
      setOpenTooltip(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    // Cleanup the event listener
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const submitAnnouncement = (id, announcement) => {
    if (id === 0) {
      handleAdd(announcement)
    } else {
      handleEdit(id, announcement)
    } 
  }

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
            setInitialAnnouncement("")
          }
          }
          className="py-3 px-5 flex items-center gap-x-2 bg-[#2cc40d] text-white rounded-lg"
        >
          Add <IoMdAdd />
        </button></div>
        <div className="py-2">
          {announcements.map((a) => (
            <div className="relative flex items-center justify-between px-5 py-2" key={a.id}>
              {/* Announcement Text */}
              <p className="text-lg text-[#17502d] font-semibold flex-1">
                {a.announcementText}
              </p>
              {/* Three-dot Menu */}
              {openTooltip === a.id && (
                <div className="absolute right-0 z-10 mr-2 w-32 bg-white border border-gray-300 rounded shadow-md">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setIsAnnouncementContainerOpen(true)
                      setWork("edit")
                      setInitialAnnouncement(a.announcement)
                      setId(a.id)
                    }
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                    onClick={() => handleDelete(a.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
              <div className="relative tooltip-container">
                <BsThreeDotsVertical
                  size={30}
                  className="flex-shrink-0 pl-2 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the event from bubbling to the document listener
                    handleTooltipToggle(a.id);
                  }}
                />

              </div>
            </div>
          ))}
        </div>


      </div>
      <Announcement isOpen={isAnnouncementContainerOpen} setIsAnnouncementContainerOpen={setIsAnnouncementContainerOpen} work={work} initialAnnouncement={initialAnnouncement} submitAnnouncement={submitAnnouncement} id={id}/>
    </div>
  );
}
const Announcement = ({
  isOpen,
  setIsAnnouncementContainerOpen,
  work,
  submitAnnouncement,
  initialAnnouncement,
  id = 0,
}) => {
  const [announcement, setAnnouncement] = useState(initialAnnouncement);
useEffect(()=>{
  setAnnouncement(initialAnnouncement)
},[isOpen])
  return (
    <div
      className={`fixed bottom-0 right-0 w-full sm:w-1/2 h-3/5 z-50 bg-white text-black transform ${isOpen ? "translate-y-0" : "translate-y-full"
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
                    setIsAnnouncementContainerOpen(false)
                    submitAnnouncement(id , announcement); // Pass the announcement text
                  }}
                  noValidate
                >
                  <div>
                    {/* Textarea for Announcement */}
                    <textarea
                      rows={4}
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-[#17502d] focus:border-[#17502d] block w-full p-2.5"
                      placeholder= "Your Announcement Goes Here"
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

