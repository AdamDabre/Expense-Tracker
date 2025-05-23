const Income = require("../models/income");
const xlsx = require("xlsx");

module.exports = {
  // Add a new income
  addIncome: async (req, res) => {
    const userId = req.user.id;

    try {
      const { icon, source, amount, date } = req.body;

      if (!icon || !source || !amount || !date) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const newIncome = new Income({
        userId,
        icon,
        source,
        amount,
        date: new Date(date),
      });
      await newIncome.save();
      res.status(200).json(newIncome);
    } catch (error) {
      console.error("Error adding income", error);
      res.status(500).json({ message: "Server Error" });
    }
  },

  // Get all incomes for a user
  getAllIncome: async (req, res) => {
    const userId = req.user.id;

    try {
      const income = await Income.find({ userId }).sort({ date: -1 });
      res.json(income);
    } catch (error) {
      console.error("Error getting all income", error);
      res.status(500).json({ message: "Server Error" });
    }
  },

  // Delete an income
  deleteIncome: async (req, res) => {
    try {
      await Income.findByIdAndDelete(req.params.id);
      res.json({ message: "Income deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  },

  // Download incomes as an Excel file
  downloadIncomeExcel: async (req, res) => {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    try {
      let filter = { userId };
      let dateLabel = "All Dates";
      if (startDate && endDate) {
        filter.date = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
        dateLabel = `From ${startDate} to ${endDate}`;
      }

      const income = await Income.find(filter).sort({ date: -1 });

      // Prepare data for excel
      const data = income.map((item) => ({
        Source: item.source,
        Amount: item.amount,
        Date: item.date,
      }));

      // Add date range info as the first row
      const headerRow = [{ Source: dateLabel, Amount: "", Date: "" }];
      const finalData = headerRow.concat(data);

      const wb = xlsx.utils.book_new();
      const ws = xlsx.utils.json_to_sheet(finalData, { skipHeader: false });

      // Set column widths
      ws["!cols"] = [
        { wch: 30 }, // Source/date range column width
        { wch: 15 }, // Amount column width
        { wch: 25 }, // Date column width
      ];
      xlsx.utils.book_append_sheet(wb, ws, "Income");

      // Filename with date range
      let filename = "income_details";
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
