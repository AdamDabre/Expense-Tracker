const Expense = require("../models/expense");
const xlsx = require("xlsx");

module.exports = {
  // Add a new expense
  addExpense: async (req, res) => {
    const userId = req.user.id;

    try {
      const { icon, category, amount, date } = req.body;

      if (!icon || !category || !amount || !date) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const newExpense = new Expense({
        userId,
        icon,
        category,
        amount,
        date: new Date(date),
      });
      await newExpense.save();
      res.status(200).json(newExpense);
    } catch (error) {
      console.error("Error adding expense", error);
      res.status(500).json({ message: "Server Error" });
    }
  },

  // Get all expenses for a user
  getAllExpense: async (req, res) => {
    const userId = req.user.id;

    try {
      const expense = await Expense.find({ userId }).sort({ date: -1 });
      res.json(expense);
    } catch (error) {
      console.error("Error getting all expense", error);
      res.status(500).json({ message: "Server Error" });
    }
  },

  // Delete an expense
  deleteExpense: async (req, res) => {
    try {
      await Expense.findByIdAndDelete(req.params.id);
      res.json({ message: "Expense deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  },

  // Download expenses as an Excel file
  downloadExpenseExcel: async (req, res) => {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    let filter = { userId };
    let dateLabel = "All Dates";
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
      dateLabel = `From ${startDate} to ${endDate}`;
    }

    try {
      const expense = await Expense.find(filter).sort({ date: -1 });

      // Prepare data for excel
      const data = expense.map((item) => ({
        Category: item.category,
        Amount: item.amount,
        Date: item.date,
      }));

      // Add date range info as the first row
      const headerRow = [{ Category: dateLabel, Amount: "", Date: "" }];
      const finalData = headerRow.concat(data);

      const wb = xlsx.utils.book_new();
      const ws = xlsx.utils.json_to_sheet(finalData, { skipHeader: false });
      // Set column widths
      ws["!cols"] = [
        { wch: 30 }, // Category/date range column width
        { wch: 15 }, // Amount column width
        { wch: 25 }, // Date column width
      ];

      xlsx.utils.book_append_sheet(wb, ws, "Expense");

      // Filename with date range
      let filename = "expense_details";
      if (startDate && endDate) {
        filename += `_${startDate}_to_${endDate}`;
      }
      filename += ".xlsx";

      xlsx.writeFile(wb, filename);
      res.download(filename);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  },
};
