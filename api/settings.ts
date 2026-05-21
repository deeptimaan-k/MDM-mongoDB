import { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDB, Settings } from "./_db";

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();

    const updated = await Settings.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update settings" });
  }
};
