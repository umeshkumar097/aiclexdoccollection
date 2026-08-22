import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";

const ADMIN_SECRET = new TextEncoder().encode(
  (process.env.AUTH_SECRET ?? "fallback") + "_superadmin"
);

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("sa_token")?.value;

  let isValid = false;
  if (token) {
    try {
      await jwtVerify(token, ADMIN_SECRET);
      isValid = true;
    } catch {}
  }

  const pathname = "";
  if (!isValid && !pathname.includes("/admin/login")) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {isValid && (
        <nav className="bg-slate-900 text-white px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="font-black text-lg tracking-tight">AICLEX Admin</span>
            <a href="/admin" className="text-slate-300 hover:text-white text-sm font-medium">Dashboard</a>
            <a href="/admin/organizations" className="text-slate-300 hover:text-white text-sm font-medium">Organizations</a>
          </div>
          <span className="text-slate-400 text-sm">Super Admin</span>
        </nav>
      )}
      <main>{children}</main>
    </div>
  );
}
