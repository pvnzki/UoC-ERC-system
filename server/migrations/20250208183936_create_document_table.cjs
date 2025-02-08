exports.up = function (knex) {
  return knex.schema.createTable("document", (table) => {
    table.increments("document_id").primary();
    table
      .integer("application_id")
      .notNullable()
      .references("application_id")
      .inTable("application");
    table.string("document_type", 100).notNullable();
    table.string("file_path", 255).notNullable();
    table.timestamp("upload_date").defaultTo(knex.fn.now());
    table.boolean("is_mandatory").defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("document");
};
