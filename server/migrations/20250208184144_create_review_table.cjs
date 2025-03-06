exports.up = function (knex) {
  return knex.schema.createTable("review", (table) => {
    table.increments("review_id").primary();
    table
      .integer("application_id")
      .notNullable()
      .references("application_id")
      .inTable("application");
    table
      .integer("reviewer_id")
      .notNullable()
      .references("user_id")
      .inTable("user");
    table.text("comments");
    table.string("outcome").notNullable();
    table.date("review_date").notNullable();
    table.date("data_date").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("review");
};
