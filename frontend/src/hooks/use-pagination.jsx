"use client";

import * as React from "react";

export function usePagination() {
  const [page, setPage] = React.useState(1);

  const containerRef = React.useRef(null);

  function resetScroll() {
    if (containerRef.current !== null) {
      const rect = containerRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const absoluteTop = rect.top + scrollTop + 60;

      window.scrollTo({ behavior: "smooth", top: absoluteTop });
    }
  }

  function handlePreviousPage() {
    setPage((prevState) => Math.max(1, prevState - 1));
    resetScroll();
  }

  function handleNextPage({ totalPages }) {
    setPage((prevState) => Math.min(totalPages, prevState + 1));
    resetScroll();
  }

  function handleChangePage({ totalPages, newPage }) {
    if (newPage === page) return;

    if (newPage > page) {
      setPage(Math.min(totalPages, newPage));
    }

    if (newPage < page) {
      setPage(Math.max(1, newPage));
    }

    resetScroll();
  }

  function handleResetPagination() {
    setPage(1);
  }

  return {
    page,
    handlePreviousPage,
    handleNextPage,
    handleChangePage,
    handleResetPagination,
    containerRef,
  };
}
