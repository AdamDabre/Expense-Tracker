const Income = require("../models/income");
const Expense = require("../models/expense");
const { Types } = require("mongoose");

// Helper to aggregate totals
async function getTotal(model, userObjectId) {
  const result = await model.aggregate([
    { $match: { userId: userObjectId } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  return result[0]?.total || 0;
}

// Helper to fetch transactions in a period and sum
async function getTransactionsAndTotal(model, userId, days) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const transactions = await model
    .find({
      userId,
      date: { $gte: since },
    })
    .sort({ date: -1 });
  const total = transactions.reduce((sum, txn) => sum + txn.amount, 0);
  return { total, transactions };
}

// Helper to get recent transactions
async function getRecentTransactions(userId, limit = 5) {
  const incomes = await Income.find({ userId }).sort({ date: -1 }).limit(limit);
  const expenses = await Expense.find({ userId })
    .sort({ date: -1 })
    .limit(limit);

  const transactions = [
    ...incomes.map((txn) => ({ ...txn.toObject(), type: "income" })),
    ...expenses.map((txn) => ({ ...txn.toObject(), type: "expense" })),
  ];
  return transactions.sort((a, b) => b.date - a.date).slice(0, limit);
}

module.exports = {
  getDashboardData: async (req, res) => {
    try {
      const userId = req.user.id;
      const userObjectId = new Types.ObjectId(String(userId));

      const [totalIncome, totalExpense] = await Promise.all([
        getTotal(Income, userObjectId),
        getTotal(Expense, userObjectId),
      ]);

      const {
        total: incomeLast60Days,
        transactions: last60DaysIncomeTransactions,
      } = await getTransactionsAndTotal(Income, userId, 60);

      const {
        total: expensesLast30Days,
        transactions: last30DaysExpenseTransactions,
      } = await getTransactionsAndTotal(Expense, userId, 30);

      const recentTransactions = await getRecentTransactions(userId);

      res.json({
        totalBalance: totalIncome - totalExpense,
        totalIncome,
        totalExpenses: totalExpense,
        last30DaysExpenses: {
          total: expensesLast30Days,
          transactions: last30DaysExpenseTransactions,
        },
        last60DaysIncome: {
          total: incomeLast60Days,
          transactions: last60DaysIncomeTransactions,
        },
        recentTransactions,
      });
    } catch (error) {
      console.log("Error getting dashboard data", error);
      res.status(500).json({ message: "Server Error" });
    }
  },
};
