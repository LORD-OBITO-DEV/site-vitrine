import express from "express";
import User from "../models/User.js";
import axios from "axios";
const router = express.Router();

function ensureAuth(req,res,next){
  if(req.session.user && req.session.user.id) return next();
  return res.redirect("/login");
}

/* Public pages */
router.get("/about", (req,res) => res.render("about"));
router.get("/contact", (req,res) => res.render("contact"));
router.get("/privacy", (req,res) => res.render("privacy"));
router.get("/cookies", (req,res) => res.render("cookies"));
router.get("/terms", (req,res) => res.render("terms"));
router.get("/plans", (req,res) => res.render("plans"));

/* Dashboard */
router.get("/dashboard", ensureAuth, async (req,res)=>{
  const user = await User.findById(req.session.user.id).lean();
  res.render("dashboard", { user });
});

/* Show ad page (open in new window) */
router.get("/show-ad", ensureAuth, (req,res)=>{
  // show-ad.ejs contains the adsterra script
  res.render("show-ad");
});

/* Optional: API call to create real panel on Pterodactyl (server-side)
   This is a simple example: you should adapt payload to your Pterodactyl setup.
*/
router.post("/create-panel", ensureAuth, async (req,res)=>{
  const { name, memoryMB, plan } = req.body;
  const pteroUrl = process.env.PTERO_API_URL;
  const key = process.env.PTERO_API_KEY;
  if(!pteroUrl || !key) return res.status(500).json({ error: "Pterodactyl not configured" });

  try{
    // Example payload - adjust to your Pterodactyl version
    const payload = {
      name,
      memory: memoryMB,
      // ... other required fields for your Ptero endpoint
    };
    const r = await axios.post(`${pteroUrl}/api/application/servers`, payload, {
      headers: { Authorization: `Bearer ${key}`, "Content-Type":"application/json" }
    });
    // store external id in user's panels (example)
    const user = await User.findById(req.session.user.id);
    user.panels.push({ name, plan, memoryMB, external_id: r.data.data.id });
    await user.save();
    res.json({ ok: true, server: r.data });
  }catch(e){
    console.error(e.response?.data || e.message);
    res.status(500).json({ error: "Erreur création panel" });
  }
});

export default router;