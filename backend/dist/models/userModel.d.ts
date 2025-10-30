import { RowDataPacket } from 'mysql2';
export interface User extends RowDataPacket {
    id?: number;
    username: string;
    name: string;
    email: string;
    password: string;
    created_At?: Date;
    update_at?: Date;
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
    tanggal_pinjaman: string;
    tanggal_pengembalian?: string | null;
    deadline_pengembalian: string;
    status: StatusPeminjaman;
    datas_book: {};
}
export declare const createUser: (user: UserInput) => Promise<number>;
export declare const getLogin: (identifier: string) => Promise<User | null>;
export declare const updatePeminjaman: (tanggal_pengembalian: string | null, status: StatusPeminjaman, id: number) => Promise<void>;
export declare const loanBook: (data: Peminjaman) => Promise<number>;
export declare const getPeminjamanByUsername: (username: string) => Promise<Peminjaman[]>;
export declare const getUserByEmail: (email: string) => Promise<User | null>;
export declare const getUsers: () => Promise<User[]>;
export declare const getAllPeminjaman: () => Promise<Peminjaman[]>;
export declare const getAllPeminjamanData: () => Promise<any[]>;
export declare const deletePeminjaman: (id: number) => Promise<void>;
//# sourceMappingURL=userModel.d.ts.map