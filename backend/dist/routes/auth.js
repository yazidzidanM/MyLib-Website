"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
//user
router.post("/register", authController_1.registerUser);
router.post("/login", authController_1.Login);
router.post("/create_loan", authController_1.createLoan);
router.get("/your_loans", authController_1.getLoans);
router.put("/return_book/:id", authController_1.returnBook);
router.delete("/delete_loan/:id", authController_1.deleteLoan);
//admin only
router.get("/users", auth_middleware_1.verifyAdminToken, authController_1.getAllUsers);
router.get("/loans", auth_middleware_1.verifyAdminToken, authController_1.getLoans);
//book
router.post("/add_book", auth_middleware_1.verifyAdminToken, authController_1.addingBook);
router.get("/books", auth_middleware_1.verifyAdminToken, authController_1.getAllBook);
router.get("/rack_books", authController_1.getAllBook);
router.post("/update_book/:id", auth_middleware_1.verifyAdminToken, authController_1.updateBook);
router.delete("/delete_book/:id", auth_middleware_1.verifyAdminToken, authController_1.deleteBook);
const frontendPath = path_1.default.join(__dirname, "../../../frontend");
router.get("/admin/dashboard", (req, res) => {
    res.sendFile(path_1.default.join(frontendPath, "admin/dashboard.html"));
});
router.get("/user/dashboard", (req, res) => {
    res.sendFile(path_1.default.join(frontendPath, "user/dashboard.html"));
});
router.get("/", (req, res) => {
    res.sendFile(path_1.default.join(frontendPath, "login.html"));
});
router.get("/regist", (req, res) => {
    res.sendFile(path_1.default.join(frontendPath, "registerasi.html"));
});
router.get("/:role/:page", async (req, res, next) => {
    const { role } = req.params;
    if (role === "admin") {
        (0, auth_middleware_1.verifyAdminToken)(req, res, (err) => {
            if (err) {
                return res.status(403).json({
                    message: "access denied: token invalid",
                    roledirect: "user"
                });
            }
            next();
        });
    }
    else {
        next();
    }
}, (req, res) => {
    const { role, page } = req.params;
    const filePath = path_1.default.join(frontendPath, role, `${page}.html`);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send("Halaman tidak ditemukan");
        }
    });
});
exports.default = router;
//# sourceMappingURL=auth.js.map