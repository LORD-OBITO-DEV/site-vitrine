import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import MongoStore from "connect-mongo";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// DB connect
const MONGO = process.env.MONGO_URI;
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log("MongoDB connected"))
  .catch(err => console.error("Mongo connect err:", err));

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// sessions (store in mongo)
app.use(session({
  secret: process.env.SESSION_SECRET || "change_me",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGO, ttl: 14 * 24 * 60 * 60 })
}));

// make user available in views
app.use((req,res,next)=>{
  res.locals.currentUser = req.session.user || null;
  next();
});

// routes
import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import apiRoutes from "./routes/api.js";

app.use("/", authRoutes);         // /login /signup /logout and index pages
app.use("/", dashboardRoutes);    // /, /about, /contact, /dashboard
app.use("/api", apiRoutes);       // /api/reward, /api/buy-panel etc

// start
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));