/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("users", (tbl) => {
      tbl.increments();
      tbl.string("email").unique().notNullable();
      tbl.string("password").notNullable();
      tbl.timestamps(true, true);
    })
    .createTable("contacts", (tbl) => {
      tbl.increments();
      tbl.string("firstname", 255).notNullable();
      tbl.string("lastname", 255).notNullable();
      tbl.string("phone_number", 255).notNullable().unique();
      tbl
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      tbl.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("contacts").dropTableIfExists("users");
};
