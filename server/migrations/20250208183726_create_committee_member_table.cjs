// migrations/20231010123458_create_committee_member_table.js
exports.up = function (knex) {
  return knex.schema.createTable("committee_member", (table) => {
    table.increments("member_id").primary();
    table.integer("user_id").notNullable();
    table
      .integer("committee_id")
      .notNullable()
      .references("committee_id")
      .inTable("committee");
    table.string("role").notNullable();
    table.string("ir_scheme").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("committee_member");
};
