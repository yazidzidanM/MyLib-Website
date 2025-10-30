"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const mysql_1 = __importDefault(require("./config/mysql"));
const mongodb_1 = __importDefault(require("./config/mongodb"));
const auth_1 = __importDefault(require("./routes/auth"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://127.0.0.1:5500",
    credentials: true,
}));
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true }));
const frontendPath = path_1.default.join(__dirname, "../../frontend");
app.use("/public", express_1.default.static(path_1.default.join(frontendPath, "public")));
app.use("/components", express_1.default.static(path_1.default.join(frontendPath, "components")));
app.use("/styles", express_1.default.static(path_1.default.join(frontendPath, "styles")));
app.use("/javascripts", express_1.default.static(path_1.default.join(frontendPath, "javascripts")));
app.use("/MyLib", express_1.default.static(frontendPath));
app.use("/MyLib", auth_1.default);
async function main() {
    try {
        const PORT = 5001;
        app.get("/server", (req, res) => {
            res.send("✅ Server is running successfully!");
        });
        mysql_1.default;
        console.log(`MongoDB: ${await (0, mongodb_1.default)()}`);
        app.listen(PORT, () => {
          console.log(`🚀 Server is running on http://localhost:${PORT}`);
          console.log(`📂 Frontend served from: ${frontendPath}`);
        });
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
        if (error instanceof Error) {
            console.error("Message:", error.message);
            console.error("Stack:", error.stack);
        }
    }
}
main();
//# sourceMappingURL=server.js.map