import React from "react";
import { LuTrendingUpDown } from "react-icons/lu";
import BAR_GRAPH from "../../assets/images/bar-graph.png";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      <section className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
        <h2 className="text-lg font-medium text-black"> Express Tracker </h2>
        {children}
      </section>

      <section className="md:block w-[40vw] h-screen bg-violet-50 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative">
        {" "}
        <div className="w-48 h-48 rounded-[40px] bg-purple-600 absolute -top-7 -left-5 z-0"></div>
        <div className="w-48 h-56 rounded-[40px] border-[20px] border-fuchsia-600 absolute top-[30%] -right-10"></div>
        <div className="w-48 h-48 rounded-[40px] bg-violet-500 absolute -bottom-7 -left-5"></div>
        <StatsInfoCard
          label="Tracking your Income and Expenses"
          value="430,000"
          color="bg-primary"
          icon={<LuTrendingUpDown />}
        ></StatsInfoCard>
        <img
          src={BAR_GRAPH}
          className="w-64 lg:w-w[90%] absolute bottom-10 shadow-blue-400/15"
        />
      </section>
    </div>
  );
};

export default AuthLayout;

const StatsInfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex items-center gap-6 bg-white p-4 rounded-xl shadow-md shadow-purple-400/10 border-gray-200/50 relative z-10">
      {" "}
      <div
        className={`w-12 h-12 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}
      >
        {icon}
      </div>
      <div>
        <div className="text-xs text-gray-500 mb-1">{label}</div>
        <span className="text-[20px]">{value}</span>
      </div>
    </div>
  );
};
