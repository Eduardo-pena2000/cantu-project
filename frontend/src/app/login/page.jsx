import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { LoginForm } from "@/components/forms/login-form";

export default async function Page() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  );
}
