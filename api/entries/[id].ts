import { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDB, Entry } from "../_db";

export default async (req: VercelRequest, res: VercelResponse) => {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    await connectDB();

    if (req.method === "PUT") {
      const { entry } = req.body;
      const updated = await Entry.findByIdAndUpdate(id, entry, { new: true });
      return res.json(updated);
    } else if (req.method === "DELETE") {
      await Entry.findByIdAndDelete(id);
      return res.json({ success: true });
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process request" });
  }
};
