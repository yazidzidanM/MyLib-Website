"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLoan = exports.returnBook = exports.getLoans = exports.createLoan = exports.deleteBook = exports.updateBook = exports.getAllBook = exports.addingBook = exports.Login = exports.getAllUsers = exports.registerUser = void 0;
const userModel_1 = require("../models/userModel");
const jwt_1 = require("../utils/jwt");
const bookModel_1 = require("../models/bookModel");
const authValidation_1 = require("../validations/authValidation");
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const eRole = process.env.ROLE;
const eEmail = process.env.EMAIL;
const eUsername = process.env.USERNAME;
const registerUser = async (req, res) => {
    try {
        await authValidation_1.registerSchema.validate(req.body, { abortEarly: false });
        const { username, name, email, password } = req.body;
        const existingUser = await (0, userModel_1.getUserByEmail)(email);
        if (existingUser) {
            return res.status(401).json({ message: "Email already in use" });
        }
        await (0, userModel_1.createUser)({ username, name, email, password });
        res.status(200).json({ message: "account has been created",
            data: {
                username: username,
                name: name,
            },
            redirect: "/MyLIb/user/dashboard"
        });
    }
    catch (error) {
        if (error.name === "ValidationError") {
            const validationErrors = error.inner.map((e) => e.message);
            return res.status(400).json({ errors: validationErrors });
        }
        console.error(error);
        res.status(500).json({ message: "something wrong with server" });
    }
};
exports.registerUser = registerUser;
const getAllUsers = async (req, res) => {
    try {
        const users = await (0, userModel_1.getUsers)();
        res.status(200).json({
            message: "list of all users",
            total: users.length,
            data: users,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "something wrong with getUser",
            error,
        });
    }
};
exports.getAllUsers = getAllUsers;
const Login = async (req, res) => {
    const { identifier, password } = req.body;
    try {
        const userCredential = await (0, userModel_1.getLogin)(identifier);
        if (!userCredential) {
            return res.status(401).json({ message: "account has not exist" });
        }
        const validatePass = await bcrypt_1.default.compare(password, userCredential.password);
        if (!validatePass) {
            return res.status(401).json({ message: "something wrong" });
        }
        if (userCredential.role === eRole &&
            (userCredential.email === eEmail ||
                userCredential.username === eUsername)) {
            const token = await (0, jwt_1.generateToken)({
                id: userCredential.id,
                role: userCredential.role,
            });
            res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 2 * 60 * 60 * 1000,
            });
            return res.status(200).json({
                message: "success login as Admin",
                redirect: "/MyLIb/admin/dashboard",
            });
        }
        return res.status(200).json({
            message: "success login",
            redirect: "/MyLIb/user/dashboard",
            username: userCredential.username
        });
    }
    catch (error) {
        res.status(500).json({
            message: "something wrong with getLogin",
            error,
        });
    }
};
exports.Login = Login;
//book
const addingBook = async (req, res) => {
    const { title, author, publisher, year, genre, synopsis, rating, coverUrl } = req.body;
    try {
        await bookModel_1.bukuModel.create({
            title,
            author,
            publisher,
            year,
            genre,
            synopsis,
            rating,
            coverUrl,
        });
        res.status(200).json({
            message: "Book has been added",
            data: {
                title,
                author,
                publisher,
                year,
                genre,
                synopsis,
                rating,
                coverUrl,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            message: "something wrong with server",
            error,
        });
    }
};
exports.addingBook = addingBook;
const getAllBook = async (req, res) => {
    const semuaBuku = await bookModel_1.bukuModel.find();
    try {
        res.status(200).json({
            message: "📚 list of all books",
            total: semuaBuku.length,
            data: semuaBuku,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "cannot gel all data of books",
            error,
        });
    }
};
exports.getAllBook = getAllBook;
const updateBook = async (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    try {
        const updated = await bookModel_1.bukuModel.findByIdAndUpdate(id, newData, {
            new: true,
        });
        if (!updated) {
            return res.status(404).json({ message: "book has not exist" });
        }
        res.status(200).json({
            message: "Book has been updated",
            data: updated,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "edt book has been failed",
            error,
        });
    }
};
exports.updateBook = updateBook;
const deleteBook = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await bookModel_1.bukuModel.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: "book has not exist" });
        }
        res.status(200).json({
            message: "Book has been deleted",
            data: deleted,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "delete book has been failed",
            error,
        });
    }
};
exports.deleteBook = deleteBook;
const createLoan = async (req, res) => {
    try {
        const { name, username, book, tanggal_pinjaman, tanggal_pengembalian, deadline_pengembalian, status, data_book } = req.body;
        if (!name || !username || !book || !tanggal_pinjaman || !deadline_pengembalian || !status) {
            return res.status(400).json({ error: 'please input all data' });
        }
        const datas_book = JSON.stringify(data_book);
        const insertId = await (0, userModel_1.loanBook)({
            name,
            username,
            book,
            tanggal_pinjaman,
            tanggal_pengembalian,
            deadline_pengembalian,
            status,
            datas_book
        });
        res.status(201).json({ message: 'loan has been created', id: insertId });
    }
    catch (error) {
        console.error('Error make loan : ', error);
        res.status(500).json({ error: 'something wrong when to try make loan' });
    }
};
exports.createLoan = createLoan;
const getLoans = async (req, res) => {
    try {
        const { username } = req.query;
        const data = username
            ? await (0, userModel_1.getPeminjamanByUsername)(username)
            : await (0, userModel_1.getAllPeminjaman)();
        const books = await bookModel_1.bukuModel.find();
        const mergedData = data.map((item) => {
            const matchedBook = books.find((b) => String(b._id) === String(item.book));
            return {
                ...item,
                book_title: matchedBook ? matchedBook.title : "Book has not exist",
                cover_url: matchedBook ? matchedBook.coverUrl : null,
                author: matchedBook ? matchedBook.author : null,
            };
        });
        const now = new Date();
        mergedData.forEach((item) => {
            if (item.status === "dipinjam" &&
                new Date(item.deadline_pengembalian) < now) {
                item.status = "terlambat";
            }
        });
        res.status(200).json({ success: true, data: mergedData });
    }
    catch (error) {
        console.error("Error when try to take data of loans:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getLoans = getLoans;
const returnBook = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const tanggal_pengembalian = new Date().toISOString().slice(0, 19).replace("T", " ");
        console.log(tanggal_pengembalian);
        const all = await (0, userModel_1.getAllPeminjaman)();
        const pinjaman = all.find((item) => item.id == id);
        if (!pinjaman) {
            return res
                .status(404)
                .json({ message: "cannot find data of loan." });
        }
        const pengembalianDate = new Date((tanggal_pengembalian ?? new Date().toISOString().split("T")[0]));
        const deadlineDate = new Date(pinjaman.deadline_pengembalian);
        const status = pengembalianDate <= deadlineDate ? "dikembalikan" : "terlambat";
        await (0, userModel_1.updatePeminjaman)(tanggal_pengembalian, status, id);
        res.json({ message: `Buku telah ${status}.`, status });
    }
    catch (error) {
        console.error("Error when try to return the book:", error);
        res.status(500).json({ message: error.message });
    }
};
exports.returnBook = returnBook;
const deleteLoan = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await (0, userModel_1.deletePeminjaman)(id);
        res.json({ message: "history of loan has been deleted." });
    }
    catch (error) {
        console.error("Error delete loan:", error);
        res.status(500).json({ message: "delete loan data has been failed." });
    }
};
exports.deleteLoan = deleteLoan;
//# sourceMappingURL=authController.js.map