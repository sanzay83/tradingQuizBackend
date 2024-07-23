require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const mysql = require("mysql2");

const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const promisePool = pool.promise();

// Test database connection
promisePool
  .query("SELECT 1")
  .then(() => console.log("Database connected!"))
  .catch((err) => console.error("Database connection failed:", err));

// Define routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/items", async (req, res) => {
  const { id, question, answer, buysell } = req.body;
  try {
    const [result] = await promisePool.execute(
      "INSERT INTO tradingquiz (id, question, answer, buysell) VALUES (?, ?, ?, ?)",
      [id, question, answer, buysell]
    );
    res.json({ message: "Item added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add item" });
  }
});

app.get("/items", async (req, res) => {
  try {
    const [rows] = await promisePool.execute("SELECT * FROM tradingquiz");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve items" });
  }
});

app.delete("/items/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await promisePool.execute(
      "DELETE FROM tradingquiz WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "item not found" });
    }
    res.json({ message: "Item deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete item" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
