require("dotenv").config();

const shared = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: "postgres",
  logging: false,
};

module.exports = {
  development: { ...shared },
  test: { ...shared },
  production: { ...shared },
};
