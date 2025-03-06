exports.up = function (knex) {
  return knex.schema.createTable("user", function (table) {
    table.increments("user_id").primary();
    table.string("email", 255).unique().notNullable();
    table.string("name", 255).notNullable();
    table.string("phone", 50);
    table.string("password", 255).notNullable();
    table.string("role", 50).notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.boolean("validity").defaultTo(true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("user");
};
