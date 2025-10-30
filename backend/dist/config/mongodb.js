"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoDBURL = process.env.MONGO_DATABASE_URL || "";
const MongoDbName = process.env.MONGODB_NAME || "";
const mongoDB = async () => {
    try {
        await mongoose_1.default.connect(mongoDBURL, {
            dbName: MongoDbName,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 15000,
            serverSelectionTimeoutMS: 5000
        });
        return "connected";
    }
    catch (error) {
        console.error("MongoDB connection failed ❌");
        console.error(error);
        throw error;
    }
};
exports.default = mongoDB;
//# sourceMappingURL=mongodb.js.map