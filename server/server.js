import express from "express"; 
import dotenv, { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import {connectDB} from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import complaintRouter from "./routes/complaintRoutes.js";


dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 4000; 

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use("/api/auth", userRouter);
app.use("/api/complaint", complaintRouter)


try {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`server is running on PORT: ${PORT}`);
  });
} catch (error) {
  console.error("DB connection failed:", error.message);
}

// website is in construction