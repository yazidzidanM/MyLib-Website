"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdminToken = void 0;
// src/middleware/auth.middleware.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyAdminToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(403).redirect("/MyLib/");
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "access denied" });
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(403).redirect("/MyLib/");
    }
};
exports.verifyAdminToken = verifyAdminToken;
//# sourceMappingURL=auth.middleware.js.map