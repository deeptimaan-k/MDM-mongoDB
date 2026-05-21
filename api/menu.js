import { connectDB, MenuItem } from "./_db.js";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();

    const { menuItems } = req.body;
    await MenuItem.deleteMany({});
    const updated = await MenuItem.insertMany(menuItems);
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update menu items" });
  }
};
