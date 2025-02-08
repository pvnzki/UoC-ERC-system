import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  password: "Mt202161534#",
  host: "localhost",
  port: 5432,
  database: "ercuoc",
});

export default pool;
