import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import mongoose from "mongoose";
import cors from "cors";

// MongoDB Connection
const MONGODB_URI = "mongodb+srv://radiant:radiant@cluster0.pqvvxpj.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Schemas
const EntrySchema = new mongoose.Schema({
  date: String,
  presentStudents: Number,
  eatingStudents: Number,
  cumulativeTotal: Number,
  wheatQty: Number,
  riceQty: Number,
  milkQty: Number,
  fruitType: String,
  foodCost: Number,
  fruitCost: Number,
  milkCost: Number,
  totalFoodFruitCost: Number,
  mealType: String,
}, { timestamps: true });

const MenuSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  primaryGrain: String,
  hasMilk: Boolean,
  hasFruit: Boolean,
});

const SettingsSchema = new mongoose.Schema({
  wheatRatePerStudent: Number,
  riceRatePerStudent: Number,
  milkRatePerStudent: Number,
  foodCostRate: Number,
  milkCostRate: Number,
  fruitCostRate: Number,
});

const Entry = mongoose.model("Entry", EntrySchema);
const MenuItem = mongoose.model("MenuItem", MenuSchema);
const Settings = mongoose.model("Settings", SettingsSchema);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/data", async (req, res) => {
    try {
      const entries = await Entry.find().sort({ date: -1 });
      const menuItems = await MenuItem.find();
      let settings = await Settings.findOne();
      
      // Seed default settings if none exist
      if (!settings) {
        settings = new Settings({
          wheatRatePerStudent: 0.100,
          riceRatePerStudent: 0.100,
          milkRatePerStudent: 0.150,
          foodCostRate: 6.78,
          milkCostRate: 9.6,
          fruitCostRate: 4,
        });
        await settings.save();
      }

      res.json({ entries, menuItems, settings });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch data" });
    }
  });

  app.post("/api/entries", async (req, res) => {
    try {
      const { entry } = req.body;
      const newEntry = new Entry(entry);
      await newEntry.save();
      res.json(newEntry);
    } catch (error) {
      res.status(500).json({ error: "Failed to save entry" });
    }
  });

  app.put("/api/entries/:id", async (req, res) => {
    try {
      const { entry } = req.body;
      const updated = await Entry.findByIdAndUpdate(req.params.id, entry, { new: true });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update entry" });
    }
  });

  app.delete("/api/entries/:id", async (req, res) => {
    try {
      await Entry.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete entry" });
    }
  });

  app.post("/api/settings", async (req, res) => {
    try {
      const updated = await Settings.findOneAndUpdate({}, req.body, { upsert: true, new: true });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  app.post("/api/menu", async (req, res) => {
    try {
      const { menuItems } = req.body;
      await MenuItem.deleteMany({});
      const updated = await MenuItem.insertMany(menuItems);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update menu items" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
