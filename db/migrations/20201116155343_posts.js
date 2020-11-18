exports.up = function(knex, Promise) {
  return knex.schema.createTable("posts", table => {
    table.increments();
    table.string("title").defaultsTo("");
    table.text("ref_key").defaultsTo("");
    table.text("image").defaultsTo("");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("posts");
};
