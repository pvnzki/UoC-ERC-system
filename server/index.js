import express from "express";
const app = express();
import cors from "cors";

// Middleware
app.use(express.json());
app.use(cors());

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
