// migrations/20231010123456_create_committee_table.js
exports.up = function (knex) {
  return knex.schema.createTable("committee", (table) => {
    table.increments("committee_id").primary();
    table.string("committee_name").notNullable();
    table.string("committee_type").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("committee");
};
