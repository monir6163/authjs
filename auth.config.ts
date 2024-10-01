import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import prisma from "./lib/prisma";
import { signInSchema } from "./lib/zod";

import bcryptjs from "bcryptjs";
import { NextAuthConfig } from "next-auth";
import { authRoutes, publicRoutes } from "./lib/routes";

export default {
  providers: [
    Github,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        let user = null;

        // validate credentials
        const parsedCredentials = signInSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          console.error("Invalid credentials:", parsedCredentials.error.errors);
          return null;
        }
        // get user

        user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user) {
          console.log("Invalid credentials");
          return null;
        }

        if (!user.password) {
          console.log(
            "User has no password. They probably signed up with an oauth provider."
          );
          return null;
        }

        const isPasswordValid = await bcryptjs.compare(
          credentials.password as string,
          user.password
        );
        if (!isPasswordValid) {
          console.log("Invalid password");
          return null;
        }

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      },
    }),
  ],
  callbacks: {
    //role based authorization
    // authorized({ request: { nextUrl }, auth }) {
    //     const isLoggedIn = !!auth?.user;
    //     const { pathname } = nextUrl;
    //     const role = auth?.user.role || 'user';
    //     if (pathname.startsWith('/auth/signin') && isLoggedIn) {
    //         return Response.redirect(new URL('/', nextUrl));
    //     }
    //     if (pathname.startsWith("/page2") && role !== "admin") {
    //         return Response.redirect(new URL('/', nextUrl));
    //     }
    //     return !!auth;
    // },
    authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;
      // Redirect logged-in users away from auth routes
      if (authRoutes.includes(pathname)) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true; // Allow access to auth pages if not logged in
      }
      // Allow access to public routes for all users
      if (publicRoutes.includes(pathname)) {
        return true;
      }

      // Allow access if the user is authenticated
      return isLoggedIn;
    },

    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role as string;
      }
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
} satisfies NextAuthConfig;
