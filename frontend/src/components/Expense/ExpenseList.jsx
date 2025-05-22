import React from "react";
import { LuDownload, LuPlus } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from "moment";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

const IncomeList = ({ transactions, onDelete, onDownload, onReAddIncome }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Income Sources</h5>

        <button className="card-btn" onClick={onDownload}>
          <LuDownload className="text-base" /> Download
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {transactions?.map((income) => (
          <div className="flex items-center gap-2" key={income._id}>
            <div className="flex-1">
              <TransactionInfoCard
                key={income._id}
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
