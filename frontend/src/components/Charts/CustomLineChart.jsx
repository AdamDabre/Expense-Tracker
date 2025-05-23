import React from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

const CustomLineChart = ({ data }) => {
  const CustomToolTip = ({ active, payload }) => {
    if (active && payload.length) {
      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-gray-200">
          <p className="text-xs font-semibold text-teal-700 mb-1">
            {payload[0].payload.category}
          </p>
          <p className="text-sm text-gray-600">
            Amount:{" "}
            <span className="text-sm font-medium text-gray-900">
              ${payload[0].payload.amount}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white">
      <ResponsiveContainer height={300} width="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2ec4b6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#2ec4b6" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="none" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#444" }}
            stroke="none"
          />
          <YAxis tick={{ fontSize: 12, fill: "#444" }} stroke="none" />

          <Tooltip content={<CustomToolTip />} />

          <Area
            type="monotone"
            dataKey="amount"
            stroke="#2ec4b6"
            fill="url(#incomeGradient)"
            strokeWidth={3}
            dot={{ r: 3, fill: "#a7ede4" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;
