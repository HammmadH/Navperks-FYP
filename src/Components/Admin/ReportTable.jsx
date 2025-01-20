import React, { useState, useEffect, useMemo } from "react";
import { format, parseISO, differenceInSeconds } from "date-fns";
import { FaSort, FaSortUp, FaSortDown, FaFileExport, FaSync, FaEye, FaCompressAlt, FaExpandAlt, FaTimes, FaSearchPlus, FaSearchMinus } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";

const TransactionTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: "timeIn", direction: "desc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isCompact, setIsCompact] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  useEffect(() => {
    const generateDummyData = () => {
      const dummyData = Array.from({ length: 100 }, (_, index) => {
        const timeIn = new Date(Date.now() - Math.random() * 86400000);
        const timeOut = new Date(timeIn.getTime() + Math.random() * 43200000);
        return {
          sNo: index + 1,
          id: `TRX${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
          ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          carNumber: `AB${Math.floor(Math.random() * 99)}CD${Math.floor(Math.random() * 9999)}`,
          date: timeIn.toISOString(),
          timeIn: timeIn.toISOString(),
          timeOut: timeOut.toISOString(),
        };
      });
      setData(dummyData);
      setLoading(false);
    };

    generateDummyData();
  }, []);

  const calculateDuration = (timeIn, timeOut) => {
    const seconds = Math.max(0, differenceInSeconds(parseISO(timeOut), parseISO(timeIn)));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      if (["timeIn", "timeOut", "date"].includes(sortConfig.key)) {
        return sortConfig.direction === "asc"
          ? new Date(a[sortConfig.key]) - new Date(b[sortConfig.key])
          : new Date(b[sortConfig.key]) - new Date(a[sortConfig.key]);
      }
      return sortConfig.direction === "asc"
        ? String(a[sortConfig.key]).localeCompare(String(b[sortConfig.key]))
        : String(b[sortConfig.key]).localeCompare(String(a[sortConfig.key]));
    });

    return sorted.filter((item) => {
      const searchMatch = Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );

      const dateMatch =
        (!dateRange.start ||
          new Date(item.timeIn) >= new Date(dateRange.start)) &&
        (!dateRange.end || new Date(item.timeOut) <= new Date(dateRange.end));

      return searchMatch && dateMatch;
    });
  }, [data, sortConfig, searchTerm, dateRange]);

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key
          ? prev.direction === "asc"
            ? "desc"
            : "asc"
          : "asc",
    }));
  };

  const exportToCSV = () => {
    const headers = ["S.No.", "ID", "IP Address", "Car Number", "Date", "Time In", "Time Out", "Duration"];
    const csvData = [
      headers.join(","),
      ...sortedData.map((row) =>
        [
          row.sNo,
          row.id,
          row.ipAddress,
          row.carNumber,
          format(parseISO(row.date), "MMM dd, yyyy"),
          format(parseISO(row.timeIn), "HH:mm:ss"),
          format(parseISO(row.timeOut), "HH:mm:ss"),
          calculateDuration(row.timeIn, row.timeOut),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getTableCellClass = () => {
    return `${isCompact ? "py-2 px-4" : "py-4 px-6"} whitespace-nowrap`;
  };

  return (
    <div className="p-4 bg-background min-h-screen">
      <div className="relative">
        <button className="absolute top-0 right-0 p-2 hover:bg-muted rounded-full transition-colors">
          <FaTimes className="text-accent-foreground" />
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring w-full sm:w-auto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <input
            type="datetime-local"
            className="px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring w-full sm:w-auto"
            value={dateRange.start}
            onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
          />
          <input
            type="datetime-local"
            className="px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring w-full sm:w-auto"
            value={dateRange.end}
            onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setZoomLevel((prev) => Math.min(prev + 10, 150))}
            className="p-2 rounded-md hover:bg-muted transition-colors"
            aria-label="Zoom in"
          >
            <FaSearchPlus />
          </button>
          <button
            onClick={() => setZoomLevel((prev) => Math.max(prev - 10, 50))}
            className="p-2 rounded-md hover:bg-muted transition-colors"
            aria-label="Zoom out"
          >
            <FaSearchMinus />
          </button>
          <button
            onClick={() => setIsCompact(!isCompact)}
            className="p-2 rounded-md hover:bg-muted transition-colors"
            aria-label={isCompact ? "Expand view" : "Compact view"}
          >
            {isCompact ? <FaExpandAlt /> : <FaCompressAlt />}
          </button>
          <button
            onClick={exportToCSV}
            className="p-2 rounded-md hover:bg-muted transition-colors"
            aria-label="Export to CSV"
          >
            <FaFileExport />
          </button>
          <button
            onClick={() => window.location.reload()}
            className="p-2 rounded-md hover:bg-muted transition-colors"
            aria-label="Refresh table"
          >
            <FaSync />
          </button>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <div className="max-h-[70vh] overflow-y-auto scrollbar-hide">
          <table className="w-full bg-card" style={{ zoom: `${zoomLevel}%` }}>
            <thead className="sticky top-0 bg-secondary z-10">
              <tr>
                {[
                  { key: "sNo", label: "S.No." },
                  { key: "id", label: "ID" },
                  { key: "ipAddress", label: "IP Address" },
                  { key: "carNumber", label: "Car Number" },
                  { key: "date", label: "Date" },
                  { key: "timeIn", label: "Time In" },
                  { key: "timeOut", label: "Time Out" },
                  { key: "duration", label: "Duration" },
                ].map((column) => (
                  <th
                    key={column.key}
                    onClick={() => handleSort(column.key)}
                    className={getTableCellClass() + " text-left font-heading cursor-pointer hover:bg-muted transition-colors"}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {sortConfig.key === column.key ? (
                        sortConfig.direction === "asc" ? (
                          <FaSortUp />
                        ) : (
                          <FaSortDown />
                        )
                      ) : (
                        <FaSort className="text-muted-foreground" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    No records found
                  </td>
                </tr>
              ) : (
                paginatedData.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className={getTableCellClass() + " font-mono"}>{row.sNo}</td>
                    <td className={getTableCellClass() + " font-mono"}>{row.id}</td>
                    <td className={getTableCellClass() + " font-mono"}>{row.ipAddress}</td>
                    <td className={getTableCellClass()}>{row.carNumber}</td>
                    <td className={getTableCellClass()}>{format(parseISO(row.date), "MMM dd, yyyy")}</td>
                    <td className={getTableCellClass()}>{format(parseISO(row.timeIn), "HH:mm:ss")}</td>
                    <td className={getTableCellClass()}>{format(parseISO(row.timeOut), "HH:mm:ss")}</td>
                    <td className={getTableCellClass()}>{calculateDuration(row.timeIn, row.timeOut)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm text-accent-foreground">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} entries
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          width: 0px;
          height: 0px;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default TransactionTable;