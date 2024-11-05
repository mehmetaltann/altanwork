import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";

// Extend the default User type from NextAuth
declare module "next-auth" {
  interface User {
    id: string;
  }

  interface Session {
    user: {
      id: string | unknown;
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
  }
}
