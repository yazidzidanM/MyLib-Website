"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const host = process.env.MYSQL_HOST;
const user = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;
const database = process.env.MYSQL_DATABASE;
const mysqlDB = promise_1.default.createPool({
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
exports.default = mysqlDB;
//# sourceMappingURL=mysql.js.map