export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  db_name: process.env.DB_NAME,
  db_password: process.env.DB_PASSWORD,
  db_username: process.env.DB_USERNAME,
  db_host: process.env.DB_HOST,
  db_port: parseInt(process.env.DB_PORT, 10) || 5432,
  jwt_access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
  jwt_refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
  jwt_access_token_expiration: process.env.JWT_ACCESS_TOKEN_EXPIRATION_MS,
  jwt_refresh_token_expiration: process.env.JWT_REFRESH_TOKEN_EXPIRATION_MS,
});
