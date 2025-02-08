const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "Mt202161534#",
  host: "localhost",
  port: 5432,
  database: "ercuoc",
});

module.exports = pool;
