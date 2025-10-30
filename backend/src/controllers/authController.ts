import {
  createUser,
  getUserByEmail,
  getUsers,
  getLogin,
  loanBook,
  getAllPeminjaman,
  getPeminjamanByUsername,
  updatePeminjaman,
  deletePeminjaman,
} from "../models/userModel";
import { generateToken } from "../utils/jwt";
import { bukuModel } from "../models/bookModel";
import { Request, Response } from "express";
import { registerSchema } from "../validations/authValidation";
import bcrypt from "bcrypt";
import dotenv from "dotenv"

dotenv.config();

const eRole = process.env.ROLE!
const eEmail = process.env.EMAIL!
const eUsername = process.env.USERNAME!

type TBook = {
  title: String;
  author: String;
  publisher: String;
  year: Number;
  genre: [String];
  synopsis: String;
  rating: Number;
  coverUrl: String;
};

type TLogin = {
  identifier: string;
  password: string;
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    await registerSchema.validate(req.body, { abortEarly: false });

    const { username, name, email, password } = req.body;
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(401).json({ message: "Email already in use" });
    }

    await createUser({ username, name, email, password });
    res.status(200).json({ message: "account has been created",
      data: {
        username: username,
        name: name,
      },
      redirect: "/MyLIb/user/dashboard"
    });

  } catch (error: any) {
    if (error.name === "ValidationError") {
      const validationErrors = error.inner.map((e: any) => e.message);
      return res.status(400).json({ errors: validationErrors });
    }
    console.error(error);
    res.status(500).json({ message: "something wrong with server" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsers();
    res.status(200).json({
      message: "list of all users",
      total: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      message: "something wrong with getUser",
      error,
    });
  }
};

export const Login = async (req: Request, res: Response) => {
  const { identifier, password } = req.body as unknown as TLogin;
  try {
    const userCredential = await getLogin(identifier);

    if (!userCredential) {
      return res.status(401).json({ message: "account has not exist" });
    }

    const validatePass = await bcrypt.compare(
      password,
      userCredential.password
    );

    if (!validatePass) {
      return res.status(401).json({ message: "something wrong" });
    }

    if (
      userCredential.role === eRole &&
      (userCredential.email === eEmail ||
        userCredential.username === eUsername)
    ) {
      const token = await generateToken({
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
  } catch (error) {
    res.status(500).json({
      message: "something wrong with getLogin",
      error,
    });
  }
};

//book
export const addingBook = async (req: Request, res: Response) => {
  const { title, author, publisher, year, genre, synopsis, rating, coverUrl } =
    req.body as unknown as TBook;
  try {
    await bukuModel.create({
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
  } catch (error) {
    res.status(500).json({
      message: "something wrong with server",
      error,
    });
  }
};

export const getAllBook = async (req: Request, res: Response) => {
  const semuaBuku = await bukuModel.find();
  try {
    res.status(200).json({
      message: "📚 list of all books",
      total: semuaBuku.length,
      data: semuaBuku,
    });
  } catch (error) {
    res.status(500).json({
      message: "cannot gel all data of books",
      error,
    });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  const newData = req.body;
  try {
    const updated = await bukuModel.findByIdAndUpdate(id, newData, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "book has not exist" });
    }
    res.status(200).json({
      message: "Book has been updated",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: "edt book has been failed",
      error,
    });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await bukuModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "book has not exist" });
    }
    res.status(200).json({
      message: "Book has been deleted",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({
      message: "delete book has been failed",
      error,
    });
  }
};

export const createLoan = async (req: Request, res: Response) => {
  try {
    const {
      name,
      username,
      book,
      tanggal_pinjaman,
      tanggal_pengembalian,
      deadline_pengembalian,
      status,
      data_book
    } = req.body;

    if (!name || !username || !book || !tanggal_pinjaman || !deadline_pengembalian || !status) {
      return res.status(400).json({ error: 'please input all data' });
    }

    const datas_book = JSON.stringify(data_book)

    const insertId = await loanBook({
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
  } catch (error) {
    console.error('Error make loan : ', error);
    res.status(500).json({ error: 'something wrong when to try make loan' });
  }
};

export const getLoans = async (req: Request, res: Response) => {
  try {
    const { username } = req.query;

    const data = username
      ? await getPeminjamanByUsername(username as string)
      : await getAllPeminjaman();

    const books = await bukuModel.find();

    const mergedData = (data as any[]).map((item) => {
      const matchedBook = books.find(
        (b: any) => String(b._id) === String(item.book)
      );

      return {
        ...item,
        book_title: matchedBook ? matchedBook.title : "Book has not exist",
        cover_url: matchedBook ? matchedBook.coverUrl : null,
        author: matchedBook ? matchedBook.author : null,
      };
    });

    const now = new Date();
    mergedData.forEach((item) => {
      if (
        item.status === "dipinjam" &&
        new Date(item.deadline_pengembalian) < now
      ) {
        item.status = "terlambat";
      }
    });

    res.status(200).json({ success: true, data: mergedData });
  } catch (error: any) {
    console.error("Error when try to take data of loans:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const returnBook = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id!);
    const tanggal_pengembalian = new Date().toISOString().slice(0, 19).replace("T", " ");
    console.log(tanggal_pengembalian)

    const all = await getAllPeminjaman();
    const pinjaman = (all as any[]).find((item) => item.id == id);

    if (!pinjaman) {
      return res
        .status(404)
        .json({ message: "cannot find data of loan." });
    }

    const pengembalianDate = new Date((tanggal_pengembalian ?? new Date().toISOString().split("T")[0]) as string);
    const deadlineDate = new Date(pinjaman.deadline_pengembalian);

    const status = pengembalianDate <= deadlineDate ? "dikembalikan" : "terlambat";

    await updatePeminjaman(tanggal_pengembalian!, status!, id!);

    res.json({ message: `Buku telah ${status}.`, status });
  } catch (error: any) { 
    console.error("Error when try to return the book:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteLoan = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id!);
    await deletePeminjaman(id);
    res.json({ message: "history of loan has been deleted." });
  } catch (error: any) {
    console.error("Error delete loan:", error);
    res.status(500).json({ message: "delete loan data has been failed." });
  }
};
