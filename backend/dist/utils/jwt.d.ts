import jwt from 'jsonwebtoken';
export declare const generateToken: (payload: object) => Promise<string>;
export declare const verifydToken: (token: string) => string | jwt.JwtPayload | null;
//# sourceMappingURL=jwt.d.ts.map