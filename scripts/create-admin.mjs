// ব্যবহার: npm run create-admin -- admin@example.com 'StrongPass123' "Admin Name"
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const [email, password, name = "Admin"] = process.argv.slice(2);
if (!email || !password) {
  console.error("Usage: npm run create-admin -- <email> <password> [name]");
  process.exit(1);
}
await mongoose.connect(process.env.MONGODB_URI);
const Admin = mongoose.models.Admin || mongoose.model("Admin", new mongoose.Schema({ name: String, email: { type: String, unique: true, lowercase: true }, password: String }, { timestamps: true }));
const hash = await bcrypt.hash(password, 12);
await Admin.findOneAndUpdate({ email: email.toLowerCase() }, { name, email, password: hash }, { upsert: true });
console.log("Admin ready:", email);
await mongoose.disconnect();
