"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePeminjaman = exports.getAllPeminjamanData = exports.getAllPeminjaman = exports.getUsers = exports.getUserByEmail = exports.getPeminjamanByUsername = exports.loanBook = exports.updatePeminjaman = exports.getLogin = exports.createUser = void 0;
const mysql_1 = __importDefault(require("../config/mysql"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUser = async (user) => {
    const hashedPassword = await bcrypt_1.default.hash(user.password, 10);
    const [result] = await mysql_1.default.execute("INSERT INTO users (username, name, email, password) VALUES (?, ?, ?, ?)", [user.username, user.name, user.email, hashedPassword]);
    return result.insertId;
};
exports.createUser = createUser;
const getLogin = async (identifier) => {
    const [rows] = await mysql_1.default.execute("SELECT * FROM users WHERE username = ? OR email = ?", [identifier, identifier]);
    const data = rows;
    return data.length > 0 ? data[0] : null;
};
exports.getLogin = getLogin;
const updatePeminjaman = async (tanggal_pengembalian, status, id) => {
    await mysql_1.default.execute(`UPDATE pinjaman 
    SET tanggal_pengembalian = ?, status = ? 
    WHERE id = ?`, [tanggal_pengembalian, status, id]);
};
exports.updatePeminjaman = updatePeminjaman;
const loanBook = async (data) => {
    const [result] = await mysql_1.default.execute(`INSERT INTO pinjaman 
     (name, username, book, tanggal_pinjaman, tanggal_pengembalian, deadline_pengembalian, status, datas_book) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
        data.name,
        data.username,
        data.book,
        data.tanggal_pinjaman,
        data.tanggal_pengembalian ?? null,
        data.deadline_pengembalian,
        data.status,
        data.datas_book
    ]);
    return result.insertId;
};
exports.loanBook = loanBook;
const getPeminjamanByUsername = async (username) => {
    const [rows] = await mysql_1.default.execute("SELECT * FROM pinjaman WHERE username = ? ORDER BY id DESC", [username]);
    return rows;
};
exports.getPeminjamanByUsername = getPeminjamanByUsername;
//admin only
const getUserByEmail = async (email) => {
    const [rows] = await mysql_1.default.execute("SELECT * FROM users WHERE email = ?", [email]);
    const data = rows;
    return data[0] ?? null;
};
exports.getUserByEmail = getUserByEmail;
const getUsers = async () => {
    const [rows] = await mysql_1.default.execute("SELECT * FROM users");
    return rows;
};
exports.getUsers = getUsers;
const getAllPeminjaman = async () => {
    const [rows] = await mysql_1.default.execute("SELECT * FROM pinjaman ORDER BY id DESC");
    return rows;
};
exports.getAllPeminjaman = getAllPeminjaman;
const getAllPeminjamanData = async () => {
    const [rows] = await mysql_1.default.execute(`
    SELECT 
      id,
      username,
      book,
      tanggal_pinjaman,
      tanggal_pengembalian,
      deadline_pengembalian,
      status
    FROM pinjaman
    ORDER BY id DESC
  `);
    return rows;
};
exports.getAllPeminjamanData = getAllPeminjamanData;
const deletePeminjaman = async (id) => {
    await mysql_1.default.execute(`DELETE FROM pinjaman WHERE id = ?`, [id]);
};
exports.deletePeminjaman = deletePeminjaman;
//# sourceMappingURL=userModel.js.map