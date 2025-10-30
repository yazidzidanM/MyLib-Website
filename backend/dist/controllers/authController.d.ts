import { Request, Response } from "express";
export declare const registerUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllUsers: (req: Request, res: Response) => Promise<void>;
export declare const Login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const addingBook: (req: Request, res: Response) => Promise<void>;
export declare const getAllBook: (req: Request, res: Response) => Promise<void>;
export declare const updateBook: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteBook: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createLoan: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getLoans: (req: Request, res: Response) => Promise<void>;
export declare const returnBook: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteLoan: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=authController.d.ts.map