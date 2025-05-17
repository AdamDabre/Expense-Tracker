const express = require("express");
const router = express.Router();

const {
  addIncome,
  getAllIncome,
  deleteIncome,
  downloadIncomeExcel,
} = require("../controllers/incomeController");

const { protect } = require("../middleware/authMiddleware");

// Post request to add a new income
router.post("/add", protect, addIncome);

// Get request to fetch all incomes
router.get("/get", protect, getAllIncome);

// Get request to download incomes as an Excel file
router.get("dowloadexcel", protect, downloadIncomeExcel);

// Delete request to delete an income
router.delete("/:id", protect, deleteIncome);

module.exports = router;
