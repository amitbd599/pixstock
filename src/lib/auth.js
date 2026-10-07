import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { connectDB } from "./db";
import Admin from "@/models/Admin";

export const authOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: "/admin/login" },
  providers: [
    CredentialsProvider({
      name: "Admin",
      credentials: { email: {}, password: {} },
      async authorize(c) {
        if (!c?.email || !c?.password) return null;
        await connectDB();
        const admin = await Admin.findOne({ email: c.email.toLowerCase().trim() });
        if (!admin || !(await bcrypt.compare(c.password, admin.password))) return null;
        return { id: admin._id.toString(), email: admin.email, name: admin.name };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user.id = token.id;
      return session;
    },
  },
};

export const getAdminSession = () => getServerSession(authOptions);

export async function requireAdmin() {
  const s = await getAdminSession();
  if (!s) throw new Error("Unauthorized");
  return s;
}
