"use client";

import * as React from "react";

import { debouncedCallback } from "@/utils";

export function useSearch({ onSearch = undefined }) {
  const [search, setSearch] = React.useState("");

  const handleSearch = debouncedCallback(function (e) {
    if (onSearch) {
      onSearch();
    }

    setSearch(e.target.value);
  }, 500);

  return {
    search,
    handleSearch,
  };
}
