"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import DataError from "@/components/page-error";

export default function Error({ error, reset }) {
  const router = useRouter();

  function handleRetry() {
    React.startTransition(() => {
      router.refresh();
      reset();
    });
  }

  return <DataError error={error} onRetry={handleRetry} />;
}
