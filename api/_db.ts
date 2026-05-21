import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://radiant:radiant@cluster0.pqvvxpj.mongodb.net/?appName=Cluster0";

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

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then(mongoose => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export const Entry = mongoose.models.Entry || mongoose.model("Entry", EntrySchema);
export const MenuItem = mongoose.models.MenuItem || mongoose.model("MenuItem", MenuSchema);
export const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
