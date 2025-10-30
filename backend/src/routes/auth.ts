import express from 'express'
import {
  registerUser,
  getAllUsers,
  Login,

  addingBook,
  getAllBook,
  updateBook,
  deleteBook,
  createLoan,
  getLoans,
  returnBook,
  deleteLoan
} from '../controllers/authController'
import {verifyAdminToken} from '../middlewares/auth.middleware'
import path from "path";
const router = express.Router();

//user
router.post("/register", registerUser)
router.post("/login" ,Login)
router.post("/create_loan", createLoan)
router.get("/your_loans", getLoans)
router.put("/return_book/:id", returnBook)
router.delete("/delete_loan/:id", deleteLoan);

//admin only
router.get("/users", verifyAdminToken ,getAllUsers)
router.get("/loans", verifyAdminToken ,getLoans)

//book
router.post("/add_book", verifyAdminToken ,addingBook)
router.get("/books", verifyAdminToken ,getAllBook)
router.get("/rack_books", getAllBook)
router.post("/update_book/:id", verifyAdminToken ,updateBook)
router.delete("/delete_book/:id", verifyAdminToken ,deleteBook)

const frontendPath = path.join(__dirname, "../../../frontend");

router.get("/admin/dashboard", (req, res) => {
  res.sendFile(path.join(frontendPath, "admin/dashboard.html"));
});
router.get("/user/dashboard", (req, res) => {
  res.sendFile(path.join(frontendPath, "user/dashboard.html"));
});

router.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "login.html"));
});
router.get("/regist", (req, res) => {
  res.sendFile(path.join(frontendPath, "registerasi.html"));
});

router.get("/:role/:page", async (req, res, next) => {
  const { role } = req.params;

  if (role === "admin") {
    verifyAdminToken(req, res, (err) => {
      if (err) {
        return res.status(403).json({ 
          message: "access denied: token invalid",
          roledirect: "user" 
        });
      }
      next();
    });
  } else {
    next();
  }
}, (req, res) => {
  const { role, page } = req.params;
  const filePath = path.join(frontendPath, role, `${page}.html`);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send("Halaman tidak ditemukan");
    }
  });
});

export default router