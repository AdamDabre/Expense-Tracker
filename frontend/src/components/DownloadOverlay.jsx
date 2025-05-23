import React, { useState } from "react";

const periods = [
  { label: "Last 1 Month", value: 1 },
  { label: "Last 3 Months", value: 3 },
  { label: "Last 6 Months", value: 6 },
  { label: "Last 12 Months", value: 12 },
];

const DownloadOverlay = ({ open, onClose, onDownload }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [period, setPeriod] = useState("");

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
    setStartDate("");
    setEndDate("");
  };

  const handleDateChange = (setter) => (e) => {
    setter(e.target.value);
    setPeriod("");
  };

  const handleDownload = () => {
    onDownload({ startDate, endDate, period });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Semi-transparent background */}
      <div className="absolute inset-0 bg-black/20"></div>
      {/* Modal box */}
      <div className="relative bg-white rounded-lg p-6 w-full max-w-xs shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Download Options</h3>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Period</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={period}
            onChange={handlePeriodChange}
          >
            <option value="">Select period</option>
            {periods.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            Or pick dates
          </label>
          <input
            type="date"
            className="w-full border rounded px-2 py-1 mb-2"
            value={startDate}
            onChange={handleDateChange(setStartDate)}
            disabled={!!period}
          />
          <input
            type="date"
            className="w-full border rounded px-2 py-1"
            value={endDate}
            onChange={handleDateChange(setEndDate)}
            disabled={!!period}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 rounded bg-primary text-white"
            onClick={handleDownload}
            disabled={(!startDate || !endDate) && !period}
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadOverlay;
