// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import User from '@/models/user'; // تأكد من أنه Model صحيح
import connectDB from '@/lib/DBConection'; // لو عندك دالة connect لقاعدة البيانات

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
      
        await connectDB();

        if (!credentials?.email || !credentials?.password) return null;

        // ❌ كان عندك } زيادة هنا
        const user = await User.findOne({ email: credentials.email }).lean() as {
          _id: any;
          email: string;
          username: string;
          role: string;
          password: string;
        } | null;

        if (!user) return null;

        // ❌ في خطأ إملائي: passwrod → ✅ hashedPassword (أو الاسم الصحيح)
        const isPasswordCorrect = await compare(credentials.password, user.password);

        if (!isPasswordCorrect) return null;

        return {
          id: user._id.toString(), // 🔄 تأكد ترجع id كـ string
          email: user.email,
          name: user.username,
          role: user.role, // ✅ لو عندك role
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.name = (user as any).name || (user as any).username || "";
      }
      return token;
    },
   async session({ session, token }) {
  session.user = {
    ...session.user,
    id: token.id as string,
    role: token.role as string,
    name: token.name as string,
  };
  return session;
}

  },

  secret: process.env.NEXTAUTH_SECRET,
};
