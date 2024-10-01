import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/page1"],
  // matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
