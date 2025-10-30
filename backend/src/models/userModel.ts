import mysqlDB from '../config/mysql'
import { RowDataPacket, ResultSetHeader } from 'mysql2'
import bcrypt from 'bcrypt'

export interface User extends RowDataPacket {
  id?: number,
  username: string,
  name: string,
  email: string,
  password: string,
  created_At?: Date,
  update_at?: Date
}

export interface UserInput {
  username: string;
  name: string;
  email: string;
  password: string;
}

export type StatusPeminjaman = 'dipinjam' | 'dikembalikan' | 'terlambat';

export interface Peminjaman {
  id?: number;
  name: string;
  username: string;
  book: string;
  tanggal_pinjaman: string; // format: 'YYYY-MM-DD'
  tanggal_pengembalian?: string | null;
  deadline_pengembalian: string;
  status: StatusPeminjaman;
  datas_book: {}
}

export const createUser = async (user: UserInput): Promise<number> => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const [result] = await mysqlDB.execute<ResultSetHeader>(
    "INSERT INTO users (username, name, email, password) VALUES (?, ?, ?, ?)",
    [user.username, user.name, user.email, hashedPassword]
  );
  return result.insertId;
};

export const getLogin = async (identifier: string): Promise<User | null> => {
  const [rows] = await mysqlDB.execute<RowDataPacket[]>(
    "SELECT * FROM users WHERE username = ? OR email = ?",
    [identifier, identifier]
  );
  const data = rows as User[];
  return data.length > 0 ? data[0]! : null;
};

export const updatePeminjaman = async (tanggal_pengembalian:string | null, status: StatusPeminjaman, id:number, ) => {
  await mysqlDB.execute<ResultSetHeader>(
    `UPDATE pinjaman 
    SET tanggal_pengembalian = ?, status = ? 
    WHERE id = ?`,
    [tanggal_pengembalian, status, id],
  );
};

export const loanBook = async (data: Peminjaman): Promise<number> => {
  const [result] = await mysqlDB.execute<ResultSetHeader>(
    `INSERT INTO pinjaman 
     (name, username, book, tanggal_pinjaman, tanggal_pengembalian, deadline_pengembalian, status, datas_book) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.name,
      data.username,
      data.book,
      data.tanggal_pinjaman,
      data.tanggal_pengembalian ?? null,
      data.deadline_pengembalian,
      data.status,
      data.datas_book
    ]
  );
  return result.insertId;
};

export const getPeminjamanByUsername = async (username: string): Promise<Peminjaman[]> => {
  const [rows] = await mysqlDB.execute("SELECT * FROM pinjaman WHERE username = ? ORDER BY id DESC",
    [username]
  );
  return rows as Peminjaman[]
};

//admin only
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const [rows] = await mysqlDB.execute<RowDataPacket[]>(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  const data = rows as User[];
  return data[0] ?? null;
};

export const getUsers = async (): Promise<User[]> => {
  const [rows] = await mysqlDB.execute<RowDataPacket[]>(
    "SELECT * FROM users"
  );
  return rows as User[];
}

export const getAllPeminjaman = async (): Promise<Peminjaman[]> => {
  const [rows] = await mysqlDB.execute<RowDataPacket[]>(
    "SELECT * FROM pinjaman ORDER BY id DESC"
  );
  return rows as Peminjaman[]
};

export const getAllPeminjamanData = async () => {
  const [rows] = await mysqlDB.execute(`
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
  return rows as any[];
};

export const deletePeminjaman = async (id: number) => {
  await mysqlDB.execute(`DELETE FROM pinjaman WHERE id = ?`, [id]);
};
