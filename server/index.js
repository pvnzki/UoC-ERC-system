import express from "express";
import cors from "cors";
import pool from "./db.js"; // Use import instead of require

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
