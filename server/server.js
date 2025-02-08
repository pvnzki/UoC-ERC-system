import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import knex from "knex";
import { Model } from "objection";
import applicantRoutes from "./routes/applicant.routes.js";
import knexConfig from "./knexfile.cjs";

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Knex
const db = knex(knexConfig.development);

// Bind all Models to the Knex instance
Model.knex(db);

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/applicant", applicantRoutes);

// Function to run migrations
async function runMigrations() {
  try {
    await db.migrate.latest();
    console.log("Database migrations ran successfully");
  } catch (error) {
    console.error("Error running migrations:", error);
  }
}

// Run migrations and start the server
runMigrations().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
