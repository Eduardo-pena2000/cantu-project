import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { LoginForm } from "@/components/forms/login-form";

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
      </div>
    </main>
  );
}
