import NextAuth from "next-auth/next";
import { NextAuthOptions } from "next-auth";
import { options } from "./options";

const handler = NextAuth(options as NextAuthOptions);

export { handler as GET, handler as POST };
