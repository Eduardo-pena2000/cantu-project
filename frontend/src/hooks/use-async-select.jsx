"use client";

import * as React from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

import { debouncedCallback } from "@/utils";

export function useAsyncSelect({ optionsKey, queryFn, dtoFn, enabled = true }) {
  const [search, setSearch] = React.useState("");
  const queryClient = useQueryClient();

  const observer = React.useRef(null);

  const { data, error, fetchNextPage, hasNextPage, isFetching, isLoading } = useInfiniteQuery({
    queryKey: [optionsKey, search],
    queryFn: ({ pageParam }) => queryFn({ page: pageParam, limit: 10, q: search }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMorePages ? lastPage.pagination.currentPage + 1 : undefined;
    },
    enabled,
  });

  const lastElementRef = React.useCallback(
    (node) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetching, isLoading]
  );

  const flatData = React.useMemo(() => {
    const flattenedData = data?.pages.reduce((acc, page) => {
      if (dtoFn) {
        return [...acc, ...page.data.map((adaptedData) => dtoFn(adaptedData))];
      }
      return [...acc, ...page.data];
    }, []);
    return flattenedData ?? [];
  }, [data]);

  const handleSearch = debouncedCallback(function (newSearch) {
    setSearch(newSearch);
  }, 500);

  function clearSearch() {
    setSearch("");
  }

  function retryFetch() {
    queryClient.invalidateQueries([key, search]);
  }

  return {
    lastElementRef,
    isLoading,
    isFetching,
    error,
    data: flatData,
    search,
    handleSearch,
    clearSearch,
    retryFetch,
  };
}
