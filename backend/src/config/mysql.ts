import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const host = process.env.MYSQL_HOST!;
const user = process.env.MYSQL_USER!;
const password = process.env.MYSQL_PASSWORD!;
const database = process.env.MYSQL_DB!;

const mysqlDB = mysql.createPool({
  host: host,
  user: user,
  password: password,
  database: database,
  port: Number(process.env.MYSQL_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000,
});

mysqlDB
  .getConnection()
  .then((connection) => {
    console.log("mysqlDB : Connected");
    connection.release();
  })
  .catch((err) => {
    console.error("mysqlDB : Connection Error: ", err);
  });

export default mysqlDB;
