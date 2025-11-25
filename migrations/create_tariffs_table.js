module.exports.up = async function(knex) {
  await knex.schema.createTable('tariffs', (table) => {
    table.increments('id').primary();
    table.string('dt_till_max');
    table.jsonb('warehouse_list');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

module.exports.down = async function(knex) {
  await knex.schema.dropTable('tariffs');
};