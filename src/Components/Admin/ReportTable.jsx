import React, { useState, useMemo, useEffect } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  Save,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";

const hideScrollbarClass = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
    width:0;
    height: 0
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const ReportTale = ({ data, isOpen, setIsOpen, setDownload, getAnalytics }) => {
  const [sortColumn, setSortColumn] = useState("reservationId");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    reservationId: "",
    slotCode: "",
    carType: "",
    startDate: "",
    endDate: "",
    minDuration: "",
    maxDuration: "",
  });

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString();
  };

  const calculateDuration = (timeIn, timeOut) => {
    if (!timeOut) return "Ongoing";
    const duration = new Date(timeOut).getTime() - new Date(timeIn).getTime();
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn])
        return sortDirection === "asc" ? -1 : 1;
      if (a[sortColumn] > b[sortColumn])
        return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  const filteredData = useMemo(() => {
    return sortedData.filter((item) => {
      const matchesSearch = Object.values(item).some(
        (val) =>
          val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchesAdvancedFilters =
        (!advancedFilters.reservationId ||
          item.reservationId
            .toString()
            .includes(advancedFilters.reservationId)) &&
        (!advancedFilters.carType ||
          item.carType.toLowerCase().includes(advancedFilters.carType)) &&
        (!advancedFilters.slotCode ||
          item.slotCode
            .toLowerCase()
            .includes(advancedFilters.slotCode.toLowerCase())) &&
        (!advancedFilters.startDate ||
          new Date(item.reservedTime) >= new Date(advancedFilters.startDate)) &&
        (!advancedFilters.endDate ||
          new Date(item.reservedTime) <= new Date(advancedFilters.endDate)) &&
        (!advancedFilters.minDuration ||
          calculateDuration(item.reservedTime, item.releasedTime) >=
            advancedFilters.minDuration) &&
        (!advancedFilters.maxDuration ||
          calculateDuration(item.reservedTime, item.releasedTime) <=
            advancedFilters.maxDuration);

      return matchesSearch && matchesAdvancedFilters;
    });
  }, [sortedData, searchTerm, advancedFilters]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    return filteredData.slice(startIndex, startIndex + recordsPerPage);
  }, [filteredData, currentPage, recordsPerPage]);

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleAdvancedFilterChange = (e) => {
    setAdvancedFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    const csvContent = [
      [
        "S.No.",
        "Reservation Id",
        "Slot Code",
        "Car Type",
        "Car Speed",
        "Date",
        "Time In",
        "Time Out",
        "Duration",
      ],
      ...filteredData.map((item, index) => [
        index + 1,
        item.reservationId,
        item.slotCode,
        item.carType,
        item.carSpeed ? item.carSpeed : "0",
        formatDate(item.reservedTime),
        formatTime(item.reservedTime),
        item.releasedTime ? formatTime(item.releasedTime) : "Ongoing",
        item.releasedTime
          ? calculateDuration(item.reservedTime, item.releasedTime)
          : "Ongoing",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "reservations.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  useEffect(() => {
    setDownload({ handleSave });
  }, [handleSave]);

  return (
    <>
      <style>{hideScrollbarClass}</style>
      <div
        className={`fixed top-0 inset-x-0 w-screen h-full   z-[99] bg-white text-black transform ${
          isOpen ? "translate-y-0" : "translate-y-full"
        } transition-transform duration-700 ease-in-out`}
      >
        <div className="w-full bg-white shadow-lg rounded-lg min-h-screen overflow-hidden">
          {/* Header */}
          <div className="p-4">
            <div className="flex   flex-col md:flex-row justify-between items-center mb-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">
                Reservations
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700 absolute top-2 right-2"
                onClick={() => setIsOpen(false)}
              >
                <X className="p-2 rounded-full bg-gray-100" size={35} />
              </button>
            </div>
            {/* Search and Filters */}
            <div className=" flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search reservations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <button
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <Filter className="h-5 w-5 inline-block mr-2" />
                Advanced Search
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setZoomLevel((prev) => Math.min(prev + 10, 200))
                  }
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <ZoomIn className="h-5 w-5" />
                </button>
                <button
                  onClick={() =>
                    setZoomLevel((prev) => Math.max(prev - 10, 50))
                  }
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <ZoomOut className="h-5 w-5" />
                </button>
                <button
                  onClick={handleSave}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <Save className="h-5 w-5" />
                </button>
                <button
                  onClick={() => getAnalytics()}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <RotateCw className="h-5 w-5" />
                </button>
              </div>
            </div>
            {/* Advanced Search */}
            {showAdvancedSearch && (
              <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="reservationId"
                  placeholder="Reservation ID"
                  value={advancedFilters.reservationId}
                  onChange={handleAdvancedFilterChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="slotCode"
                  placeholder="Slot Code"
                  value={advancedFilters.slotCode}
                  onChange={handleAdvancedFilterChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="datetime-local"
                  name="startDate"
                  value={advancedFilters.startDate}
                  onChange={handleAdvancedFilterChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="datetime-local"
                  name="endDate"
                  value={advancedFilters.endDate}
                  onChange={handleAdvancedFilterChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="minDuration"
                  placeholder="Min Duration (e.g., 1h 30m)"
                  value={advancedFilters.minDuration}
                  onChange={handleAdvancedFilterChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="maxDuration"
                  placeholder="Max Duration (e.g., 5h 0m)"
                  value={advancedFilters.maxDuration}
                  onChange={handleAdvancedFilterChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            {/* Table */}
            <div className="overflow-x-scroll">
              <div
                style={{ zoom: `${zoomLevel}%` }}
                className="overflow-x-scroll hide-scrollbar"
              >
                <table className="min-w-full divide-y divide-gray-200 table-fixed">
                  <thead className="bg-gray-50">
                    <tr className="flex">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%] flex-shrink-0">
                        S.No.
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%] flex-shrink-0 cursor-pointer"
                        onClick={() => handleSort("reservationId")}
                      >
                        Reservation Id
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%] flex-shrink-0 cursor-pointer"
                        onClick={() => handleSort("slotCode")}
                      >
                        Slot Code
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%] flex-shrink-0 cursor-pointer"
                        onClick={() => handleSort("slotCode")}
                      >
                        Car Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%] flex-shrink-0 cursor-pointer">
                        Car Speed
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%] flex-shrink-0 cursor-pointer"
                        onClick={() => handleSort("reservedTime")}
                      >
                        Date
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%] flex-shrink-0 cursor-pointer"
                        onClick={() => handleSort("reservedTime")}
                      >
                        Time In
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%] flex-shrink-0 cursor-pointer"
                        onClick={() => handleSort("releasedTime")}
                      >
                        Time Out
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%] flex-shrink-0">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className="bg-whiteoverflow-y-auto hide-scrollbar"
                    style={{
                      maxHeight: "calc(100vh - 300px)",
                      display: "block",
                    }}
                  >
                    {paginatedData.map((reservation, index) => (
                      <tr
                        key={reservation.reservationId}
                        className="hover:bg-gray-50 flex"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-[10%] flex-shrink-0">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-[15%] flex-shrink-0">
                          {reservation.reservationId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-[15%] flex-shrink-0">
                          {reservation.slotCode}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-[15%] flex-shrink-0">
                          {reservation.carType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-[15%] flex-shrink-0">
                          {reservation.carSpeed ? reservation.carSpeed : "0"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-[15%] flex-shrink-0">
                          {formatDate(reservation.reservedTime)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-[15%] flex-shrink-0">
                          {formatTime(reservation.reservedTime)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-[15%] flex-shrink-0">
                          {reservation.releasedTime
                            ? formatTime(reservation.releasedTime)
                            : "Ongoing"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-[15%] flex-shrink-0">
                          {calculateDuration(
                            reservation.reservedTime,
                            reservation.releasedTime
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Pagination */}
            <div className="flex justify-between items-center -mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportTale;
