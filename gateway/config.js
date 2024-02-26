const dotEnv = require("dotenv");

if (process.env.NODE_ENV !== "prod") {
  const configFile = `./.env.${process.env.NODE_ENV}`;
 
  dotEnv.config({ path: configFile });
} else {
   
  dotEnv.config();
}

module.exports = {
  PORT: process.env.PORT,
  DB_PORT:process.env.DB_PORT,
  DB_USER:process.env.DB_USER,
  DB_PASSWORD:process.env.DB_PASSWORD,
  DB_CONNECTION:process.env.DB_CONNECTION,
  APP_SECRET:process.env.APP_SECRET,
  SCHEMA:process.env.SCHEMA
};
