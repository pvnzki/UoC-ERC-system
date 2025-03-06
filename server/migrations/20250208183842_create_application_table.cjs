exports.up = function (knex) {
  return knex.schema.createTable("application", (table) => {
    table.increments("application_id").primary(); // Primary key for the application table
    table
      .integer("applicant_id")
      .notNullable()
      .references("applicant_id")
      .inTable("applicant"); // Foreign key to applicant table
    table.string("research_type").notNullable();
    table.string("application_type").notNullable();
    table.string("status").notNullable();
    table.date("submission_date").notNullable();
    table.boolean("link_updated").defaultTo(false);
    table.boolean("registration").defaultTo(false);
    table.date("ready_date");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("application");
};
