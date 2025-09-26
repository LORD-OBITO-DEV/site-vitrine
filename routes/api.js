import express from "express";
import User from "../models/User.js";
import axios from "axios";
const router = express.Router();

function ensureAuth(req,res,next){
  if(req.session.user && req.session.user.id) return next();
  return res.status(401).json({ error: "Not authenticated" });
}

// reward endpoint: front calls this after the 30s timer
router.post("/reward", ensureAuth, async (req,res)=>{
  const { points } = req.body;
  const user = await User.findById(req.session.user.id);
  if(!user) return res.status(404).json({ error: "User not found" });
  user.points = (user.points||0) + (parseInt(points) || 0);
  await user.save();
  return res.json({ ok:true, points: user.points });
});

// buy panel with points
router.post("/buy-panel", ensureAuth, async (req,res)=>{
  const { plan, memoryMB, name } = req.body;
  const costPoints = { "1gb":20, "2gb":40, "4gb":80, "unlimited":150 }[plan] || 0;
  const user = await User.findById(req.session.user.id);
  if(user.points < costPoints) return res.status(400).json({ error:"Pas assez de points" });

  // deduct
  user.points -= costPoints;
  // create a panel record locally; optionally call Pterodactyl API to create server
  user.panels.push({ name: name || `panel-${Date.now()}`, plan, memoryMB, locked:false });
  await user.save();

  // Optionally call Pterodactyl admin API here (see /create-panel in dashboard routes)
  return res.json({ ok:true, points: user.points, panels: user.panels });
});

export default router;