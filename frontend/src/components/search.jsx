"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { debouncedCallback } from "@/utils/debounce.util";

import { Input } from "@/components/ui/input";

export function Search({ className, placeholder }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleSearch = debouncedCallback(function (e) {
    const params = new URLSearchParams(searchParams);

    params.set("page", "1");
    if (e.target.value) {
      params.set("q", e.target.value);
    } else {
      params.delete("q");
    }

    replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <div className={cn("w-full h-10 relative flex items-center", className)}>
      <SearchIcon className="scale-75 absolute top-0 left-2 translate-y-2/6" />
      <Input
        className="pl-9"
        placeholder={placeholder}
        onChange={handleSearch}
        defaultValue={searchParams.get("q")?.toString() ?? ""}
      />
    </div>
  );
}
