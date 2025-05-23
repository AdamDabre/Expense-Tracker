import React, { useState, useEffect } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";
import ExpenseList from "../../components/Expense/ExpenseList";
import DownloadOverlay from "../../components/DownloadOverlay";

const Expense = () => {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddExpenseModel, setOpenAddExpenseModel] = useState(false);
  const [showDownloadOverlay, setShowDownloadOverlay] = useState(false);

  // Get All Expense Details
  const fetchExpenseDetails = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
      );

      if (response.data) {
        setExpenseData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Expense
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;

    // Validation Checks
    if (!category.trim()) {
      toast.error("Category is required");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greather than 0.");
      return;
    }

    if (!date) {
      toast.error("Date is required.");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      });

      setOpenAddExpenseModel(false);
      toast.success("Expense added successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error adding expense: ",
        error.response?.data?.message || error.message
      );
    }
  };

  // Delete Expense
  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense details deleted successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error deleting expense: ",
        error.response?.data?.message || error.message
      );
    }
  };

  // Updated download handler
  const handleDownloadExpenseDetails = async ({
    startDate,
    endDate,
    period,
  }) => {
    try {
      let params = [];
      let filename = "expense_details";
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
        `${API_PATHS.EXPENSE.DOWNLOAD_EXPENSE}${query}`,
        { responseType: "blob" }
      );
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
      toast.success("Expense download started successfully");
    } catch (error) {
      console.error("Error downloading expense data:", error.message);
      toast.error(
        error.response?.data?.message ||
          "Failed to download expense details. Please try again"
      );
    }
  };

  useEffect(() => {
    fetchExpenseDetails();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        {/* Download overlay */}
        <DownloadOverlay
          open={showDownloadOverlay}
          onClose={() => setShowDownloadOverlay(false)}
          onDownload={handleDownloadExpenseDetails}
        />
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <ExpenseOverview
              transactions={expenseData}
              onAddExpense={() => setOpenAddExpenseModel(true)}
            />
          </div>
        </div>
        <ExpenseList
          transactions={expenseData}
          onDelete={(id) => {
            setOpenDeleteAlert({ show: true, data: id });
          }}
          onDownload={() => setShowDownloadOverlay(true)}
        />
        <Modal
          isOpen={openAddExpenseModel}
          onClose={() => setOpenAddExpenseModel(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense}></AddExpenseForm>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
