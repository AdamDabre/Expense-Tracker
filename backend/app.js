require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const app = express();

// Middleware to handle CORS
app.use[
  cors({
    origin: process.env.CLIENT_URL || "*",
    method: ["GET", "PUT", "DELETE", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
];

app.use(express.json()); // Middleware to parse JSON requests

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/expense", expenseRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000; // Default port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Start the server (listening on the specified port)
