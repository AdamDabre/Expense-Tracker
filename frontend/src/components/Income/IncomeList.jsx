import React, { useState } from "react";
import { LuDownload, LuPlus } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from "moment";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import DownloadOverlay from "../DownloadOverlay";

const IncomeList = ({ transactions, onDelete, onReAddIncome }) => {
  const [showOverlay, setShowOverlay] = useState(false);

  const handleDownload = async ({ startDate, endDate, period }) => {
    try {
      let params = [];
      let filename = "income_details";
      if (period) {
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - Number(period));
        params.push(`startDate=${start.toISOString().slice(0, 10)}`);
        params.push(`endDate=${end.toISOString().slice(0, 10)}`);
        filename += `_${start.toISOString().slice(0, 10)}_to_${end
          .toISOString()
          .slice(0, 10)}`;
      } else if (startDate && endDate) {
        params.push(`startDate=${startDate}`);
        params.push(`endDate=${endDate}`);
        filename += `_${startDate}_to_${endDate}`;
      }
      filename += ".xlsx";
      const query = params.length ? `?${params.join("&")}` : "";
      const response = await axiosInstance.get(
        `${API_PATHS.INCOME.DOWNLOAD_INCOME}${query}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename); // <-- use dynamic filename
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading income Excel file:", error);
      toast.error("Failed to download income Excel file");
    }
  };

  return (
    <div className="card">
      <DownloadOverlay
        open={showOverlay}
        onClose={() => setShowOverlay(false)}
        onDownload={handleDownload}
      />
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Income Sources</h5>
        <button className="card-btn" onClick={() => setShowOverlay(true)}>
          <LuDownload className="text-base" /> Download
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {transactions?.map((income) => (
          <div className="flex items-center gap-2" key={income._id}>
            <div className="flex-1">
              <TransactionInfoCard
                title={income.source}
                icon={income.icon}
                date={moment(income.date).format("Do MMM YYYY")}
                amount={income.amount}
                type="income"
                onDelete={() => onDelete(income._id)}
              />
            </div>
            <button
              className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors ml-2"
              onClick={() =>
                onReAddIncome({
                  source: income.source,
                  amount: income.amount,
                  date: new Date(),
                  icon: income.icon,
                })
              }
              title="Re-add income"
            >
              <LuPlus className="text-gray-600" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncomeList;
