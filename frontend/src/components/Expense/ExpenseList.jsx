import React from "react";
import { LuDownload, LuPlus } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from "moment";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

const ExpenseList = ({
    transactions,
    onDelete,
    onDownload,
    onReAddExpense,
}) => {
    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Expense Categories</h5>

                <button className="card-btn" onClick={onDownload}>
                    <LuDownload className="text-base" /> Download
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {transactions?.map((expense) => (
                    <div className="flex items-center gap-2" key={expense._id}>
                        <div className="flex-1">
                            <TransactionInfoCard
                                key={expense._id}
                                title={expense.category}
                                icon={expense.icon}
                                date={moment(expense.date).format(
                                    "Do MMM YYYY"
                                )}
                                amount={expense.amount}
                                type="expense"
                                onDelete={() => onDelete(expense._id)}
                            />
                        </div>
                        <button
                            className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors ml-2"
                            onClick={() =>
                                onReAddExpense({
                                    category: expense.category,
                                    amount: expense.amount,
                                    date: new Date(),
                                    icon: expense.icon,
                                })
                            }
                            title="Re-add expense"
                        >
                            <LuPlus className="text-gray-600" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExpenseList;
