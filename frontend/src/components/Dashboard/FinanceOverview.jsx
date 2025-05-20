import React from "react";
import CustomPieChart from "../Charts/CustomPieChart";

export const FinanceOverview = ({
    totalBalance,
    totalIncome,
    totalExpense,
    colors,
}) => {
    const balanceData = [
        { name: "Total Balance", amount: totalBalance },
        { name: "Total Expense", amount: totalExpense },
        { name: "Total Income", amount: totalIncome },
    ];

    return (
        <div className="">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Financial Overview</h5>
            </div>

            <CustomPieChart
                data={balanceData}
                label="Total Balance"
                totalAmount={`$${totalBalance}`}
                colors={colors}
                showTextAnchor
            ></CustomPieChart>
        </div>
    );
};

export default FinanceOverview;
