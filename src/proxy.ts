if (!process.env.AUTH_SECRET) {
  process.env.AUTH_SECRET = "temp_secret_for_installer_so_nextauth_doesnt_crash";
}
import { auth } from "@/auth";

// Next.js 16 Proxy Convention using the unified Auth instance
export const proxy = auth((req: any) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  // --- INSTALLER LOGIC ---
  const isInstalled = process.env.DATABASE_URL && process.env.DATABASE_URL.length > 5;
  const isInstallRoute = nextUrl.pathname.startsWith('/install');
  const isApiInstallRoute = nextUrl.pathname.startsWith('/api/installer');

  if (!isInstalled && !isInstallRoute && !isApiInstallRoute) {
    return Response.redirect(new URL('/install', nextUrl));
  }
  if (isInstalled && isInstallRoute) {
    return Response.redirect(new URL('/', nextUrl));
  }
  // -----------------------

  // Protect dashboard routes
  if (nextUrl.pathname.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      console.log("Unauthenticated access to dashboard. Redirecting to /login.");
      return Response.redirect(new URL("/login", nextUrl));
    }
  }

  // Redirect logged-in users away from the login page
  if (nextUrl.pathname.startsWith("/login")) {
    if (isLoggedIn) {
      console.log("Authenticated user on login page. Redirecting to /dashboard.");
      return Response.redirect(new URL("/dashboard", nextUrl));
    }
  }

  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
