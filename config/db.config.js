module.exports = {
  HOST: 'localhost',
  USER: 'admin',
  PASSWORD: 'admin',
  DB: 'todo',
  PORT: 5432,
  DIALECT: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}