import { connectDB, Entry, MenuItem, Settings } from "./_db.js";

export default async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("Connecting to MongoDB...");
    await connectDB();
    console.log("Connected!");

    const entries = await Entry.find().sort({ date: -1 });
    const menuItems = await MenuItem.find();
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings({
        wheatRatePerStudent: 0.1,
        riceRatePerStudent: 0.1,
        milkRatePerStudent: 0.15,
        foodCostRate: 6.78,
        milkCostRate: 9.6,
        fruitCostRate: 4,
      });
      await settings.save();
    }

    res.json({ entries, menuItems, settings });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};
