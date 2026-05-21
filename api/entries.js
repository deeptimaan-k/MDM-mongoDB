import { connectDB, Entry } from "./_db.js";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();

    const { entry } = req.body;
    const newEntry = new Entry(entry);
    await newEntry.save();
    res.json(newEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save entry" });
  }
};
