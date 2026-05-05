import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { LoginForm } from "@/components/forms/login-form";
import Link from "next/link";
import { MonitorPlay } from "lucide-react";

export default async function Page() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <main className="flex min-h-svh w-full items-center justify-center bg-gradient-to-br from-[oklch(0.27_0.08_250)] via-[oklch(0.33_0.10_250)] to-[oklch(0.22_0.07_250)] p-6 md:p-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
      <div className="w-full max-w-sm relative z-10">
        <LoginForm />
        <div className="mt-8 text-center">
          <Link 
            href="/tv-dashboard" 
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm transition-all border border-white/10"
          >
            <MonitorPlay className="w-4 h-4" />
            Pantalla TV de Tiendas
          </Link>
        </div>
      </div>
    </main>
  );
}
