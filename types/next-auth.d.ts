// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      role?: string;
      name?: string | null; // ✅ أضف السطر ده لو مش موجود
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}
