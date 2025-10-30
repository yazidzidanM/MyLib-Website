"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifydToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
const generateToken = async (payload) => {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};
exports.generateToken = generateToken;
const verifydToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (err) {
        return null;
    }
};
exports.verifydToken = verifydToken;
//# sourceMappingURL=jwt.js.map