// migrations/20231010123457_create_applicant_table.js
exports.up = function (knex) {
  return knex.schema.createTable("applicant", (table) => {
    table.increments("applicant_id").primary();
    table.integer("user_id").notNullable();
    table.string("contract_status").notNullable();
    table.string("applicant_category").notNullable();
    table.date("notification_date").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("applicant");
};
