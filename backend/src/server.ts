import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mysqlDB from "./config/mysql";
import mongoDB from "./config/mongodb";
import authRouter from "./routes/auth";
import cookieParser from "cookie-parser";
import path from "path";
const app = express();

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    credentials: true, 
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
const frontendPath = path.join(__dirname, "../../frontend");
app.use("/public", express.static(path.join(frontendPath, "public")));
app.use("/components", express.static(path.join(frontendPath, "components")));
app.use("/styles", express.static(path.join(frontendPath, "styles")))
app.use("/javascripts", express.static(path.join(frontendPath, "javascripts")))
app.use("/MyLib", express.static(frontendPath));
app.use("/MyLib", authRouter); 

async function main() {
  try {
    const PORT = 5001;

    app.get("/server", (req, res) => {
      res.send("✅ Server is running successfully!");
    });

    mysqlDB;
    console.log(`MongoDB: ${await mongoDB()}`);

    app.listen(PORT, () => {
      console.log(`🚀 Server is running`);
      console.log(`📂 Frontend served from: ${frontendPath}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    if (error instanceof Error) {
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);
    }
  }
}
 
main();
