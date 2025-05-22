import React from "react";
import { useUserAuth } from "../../hooks/useUserAuth";

const Expense = () => {
  useUserAuth();
  return <div>Expense</div>;
};

export default Expense;
