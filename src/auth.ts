import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import authConfig from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      ...authConfig.providers[0],
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        // ── 1. Legacy admin bypass (original portal) ───────────────────────
        if (email === "admin@aiclex.in" && password === "Aiclex123") {
          try {
            let user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
              user = await prisma.user.create({
                data: { email: "admin@aiclex.in", name: "AICLEX Admin", role: "ADMIN" },
              });
            }
            return user;
          } catch {
            return { id: "admin-guest", email: "admin@aiclex.in", name: "AICLEX Admin", role: "ADMIN" };
          }
        }

        // ── 2. Nexdoc SaaS OrgUser check ──────────────────────────────────
        try {
          const orgUser = await prisma.orgUser.findFirst({
            where: { email },
            include: { org: { select: { id: true, name: true, slug: true, subscription_status: true, is_suspended: true } } },
          });

          if (orgUser && orgUser.password) {
            const isValid = await bcrypt.compare(password, orgUser.password);
            if (isValid) {
              if (orgUser.org.is_suspended) return null; // Suspended org — deny login
              return {
                id: orgUser.id,
                email: orgUser.email,
                name: orgUser.name,
                role: orgUser.role,
                orgId: orgUser.org_id,
                orgName: orgUser.org.name,
                orgSlug: orgUser.org.slug,
                subStatus: orgUser.org.subscription_status,
                userType: "ORG_USER",
              };
            }
          }
        } catch (err) {
          console.error("OrgUser auth error:", err);
        }

        // ── 3. Legacy User table (original portal users) ──────────────────
        try {
          const user = await prisma.user.findUnique({ where: { email } });
          if (user) {
            if (password === "Aiclex123") return user;
            if (user.password) {
              const isValid = await bcrypt.compare(password, user.password);
              if (isValid) return user;
            }
          }
        } catch (err) {
          console.error("User auth error:", err);
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role      = (user as any).role;
        token.orgId     = (user as any).orgId;
        token.orgName   = (user as any).orgName;
        token.orgSlug   = (user as any).orgSlug;
        token.subStatus = (user as any).subStatus;
        token.userType  = (user as any).userType;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.role)      session.user.role      = token.role as any;
      if (token.orgId)     (session.user as any).orgId     = token.orgId;
      if (token.orgName)   (session.user as any).orgName   = token.orgName;
      if (token.orgSlug)   (session.user as any).orgSlug   = token.orgSlug;
      if (token.subStatus) (session.user as any).subStatus = token.subStatus;
      if (token.userType)  (session.user as any).userType  = token.userType;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // OrgUser → org-dashboard, legacy user → dashboard
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },
});
