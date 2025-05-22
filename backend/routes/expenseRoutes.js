const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
    addExpense,
    getAllExpense,
    deleteExpense,
    downloadExpenseExcel,
} = require("../controllers/expenseController");

// Post request to add a new expense
router.post("/add", protect, addExpense);

// Get request to fetch all expenses
router.get("/get", protect, getAllExpense);

// Get request to download expenses as an Excel file
router.get("/downloadExcel", protect, downloadExpenseExcel);

// Delete request to delete an expense
router.delete("/:id", protect, deleteExpense);

module.exports = router;
