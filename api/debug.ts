import { VercelRequest, VercelResponse } from "@vercel/node";

export default async (req: VercelRequest, res: VercelResponse) => {
  res.json({
    mongodbUri: process.env.MONGODB_URI ? "✅ SET" : "❌ NOT SET",
    nodeEnv: process.env.NODE_ENV,
    allEnvKeys: Object.keys(process.env).filter(k => k.includes('MONGO') || k.includes('mongo'))
  });
};
