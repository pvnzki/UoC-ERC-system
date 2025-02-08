// migrations/20231010123502_create_review_payment_table.js
exports.up = function (knex) {
  return knex.schema.createTable("review_payment", (table) => {
    table.increments("payment_id").primary();
    table.integer("explicitUrl_id").notNullable();
    table.decimal("amount", 10, 2).notNullable();
    table.string("payment_status").notNullable();
    table.string("payment_reference").notNullable();
    table.date("payment_date").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("review_payment");
};
