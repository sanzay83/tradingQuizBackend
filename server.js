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
  res.send("Hello Developer, The backend server is running!");
});

app.post("/items", async (req, res) => {
  const { id, question, answer, buysell, difficulty } = req.body;

  try {
    await promisePool.execute(
      `INSERT INTO tradingquiz${difficulty} (id, question, answer, buysell) VALUES (?, ?, ?, ?)`,
      [id, question, answer, buysell]
    );
    res.json({ message: "Item added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add item" });
  }
});

app.get("/easy/items", async (req, res) => {
  try {
    const [rows] = await promisePool.execute("SELECT * FROM tradingquizeasy");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve items" });
  }
});

app.get("/hard/items", async (req, res) => {
  try {
    const [rows] = await promisePool.execute("SELECT * FROM tradingquizhard");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve items" });
  }
});

app.delete("/easy/items/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await promisePool.execute(
      "DELETE FROM tradingquizeasy WHERE id = ?",
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

app.delete("/hard/items/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await promisePool.execute(
      "DELETE FROM tradingquizhard WHERE id = ?",
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

app.get("/study/items/:type", async (req, res) => {
  const { type } = req.params;
  console.log(type);
  try {
    const [rows] = await promisePool.execute(
      "SELECT * FROM `StudyMaterial` WHERE `type`=?",
      [type]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve items" });
  }
});

app.get("/study/items", async (req, res) => {
  try {
    const [rows] = await promisePool.execute("SELECT * FROM StudyMaterial");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve items" });
  }
});

app.post("/study/items", async (req, res) => {
  const {
    title,
    thumbnail,
    exampleimage,
    exampleimage2,
    description,
    type,
    id,
  } = req.body;
  try {
    await promisePool.execute(
      "INSERT INTO StudyMaterial (title, thumbnail, exampleimage, exampleimage2, description, type, id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [title, thumbnail, exampleimage, exampleimage2, description, type, id]
    );
    res.json({ message: "Item added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add item" });
  }
});

app.delete("/study/items/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await promisePool.execute(
      "DELETE FROM StudyMaterial WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "item not found" });
    }
    res.json({ message: "Study Material deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete item" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
