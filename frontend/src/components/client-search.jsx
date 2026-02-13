"use client";

import * as React from "react";
import { SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";

export function ClientSearch({ className, placeholder, search, onSearch }) {
  return (
    <div className={cn("w-full h-10 relative flex items-center", className)}>
      <SearchIcon className="scale-75 absolute top-0 left-2 translate-y-2/6" />
      <Input className="pl-9" placeholder={placeholder} onChange={onSearch} defaultValue={search} />
    </div>
  );
}
