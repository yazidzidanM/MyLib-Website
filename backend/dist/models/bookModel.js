"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bukuModel = exports.bukuSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.bukuSchema = new Schema({
    id: {
        type: Schema.Types.Number,
    },
    title: {
        type: Schema.Types.String,
    },
    author: {
        type: Schema.Types.String,
    },
    publisher: {
        type: Schema.Types.String,
    },
    year: {
        type: Schema.Types.Number,
    },
    genre: [{
            type: Schema.Types.String,
        }],
    synopsis: {
        type: Schema.Types.String,
    },
    rating: {
        type: Schema.Types.Number,
    },
    coverUrl: {
        type: Schema.Types.String,
    },
}, {
    timestamps: true,
});
exports.bukuModel = mongoose_1.default.model("Buku", exports.bukuSchema);
//# sourceMappingURL=bookModel.js.map