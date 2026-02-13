"use server";

import { signIn } from "@/auth";

export async function signin({ email, password }) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    return { error: error.message };
  }
}
