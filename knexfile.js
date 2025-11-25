module.exports = {
  client: 'pg',
  connection: {
    host: 'postgres', 
    user: 'postgres',
    password: 'postgres',
    database: 'postgres', 
  },
  migrations: {
    directory: './migrations',
  },
};