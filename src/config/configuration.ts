export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  db_name: process.env.DB_NAME,
  db_password: process.env.DB_PASSWORD,
  db_username: process.env.DB_USERNAME,
  db_host: process.env.DB_HOST,
  db_port: parseInt(process.env.DB_PORT, 10) || 5432,
});
