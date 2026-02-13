"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { cn } from "@/lib/utils";

export function ClientPagination({
  className,
  totalPages,
  currentPage,
  onPreviousPage,
  onNextPage,
  onChangePage,
}) {
  if (totalPages <= 1) {
    return null;
  }

  function generatePages() {
    const pages = [];
    const delta = 2; // Number of pages visible on the sides

    if (totalPages <= 5) {
      // If there are few pages, we show all of them
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Pages around the current
      const start = Math.max(1, currentPage - delta);
      const end = Math.min(totalPages, currentPage + delta);
      /* for (let i = start - delta; i < start; i++) {
        pages.push(i)
      } */
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      /* for (let i = end + delta; i < start; i++) {
        pages.push(i)
      } */
    }

    return pages;
  }

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={onPreviousPage}
            asButton
            disabled={currentPage <= 1}
            className={cn(currentPage <= 1 && "pointer-events-none opacity-50")}
          />
        </PaginationItem>
        {generatePages().map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => onChangePage({ totalPages, newPage: page })}
              asButton
              isActive={page === currentPage}
              disabled={page === currentPage}
              className={cn(page === currentPage && "pointer-events-none")}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            onClick={() => onNextPage({ totalPages })}
            asButton
            disabled={currentPage >= totalPages}
            className={cn(currentPage >= totalPages && "pointer-events-none opacity-50")}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
