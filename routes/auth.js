import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
const router = express.Router();

// index (home)
router.get("/", (req,res)=>{
  res.render("index");
});

// signup page
router.get("/signup", (req,res)=> res.render("signup"));

// signup POST
router.post("/signup", async (req,res)=>{
  const { email, password, displayName } = req.body;
  if(!email || !password) return res.render("signup", { error: "Email et mot de passe requis" });
  try{
    const existing = await User.findOne({ email });
    if(existing) return res.render("signup", { error: "Email déjà utilisé" });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ email, passwordHash: hash, displayName });
    // Create default free panel for the user (500MB demo) in DB (external creation optional)
    user.panels.push({ name: `${displayName||email}-free`, plan: "free", memoryMB: 500, locked: false });
    await user.save();
    req.session.user = { id: user._id, email: user.email };
    return res.redirect("/dashboard");
  }catch(e){
    console.error(e);
    return res.render("signup", { error: "Erreur serveur" });
  }
});

// login page
router.get("/login", (req,res)=> res.render("login"));

// login POST
router.post("/login", async (req,res)=>{
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.render("login", { error: "Identifiants incorrects" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if(!ok) return res.render("login", { error: "Identifiants incorrects" });
  req.session.user = { id: user._id, email: user.email };
  res.redirect("/dashboard");
});

// logout
router.get("/logout", (req,res)=>{
  req.session.destroy(()=> res.redirect("/"));
});

export default router;