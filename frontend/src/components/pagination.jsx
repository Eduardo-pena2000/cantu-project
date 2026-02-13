"use client";

import { usePathname, useSearchParams } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { cn } from "@/lib/utils";

export function CustomPagination({ className, totalPages }) {
  if (totalPages <= 1) {
    return null;
  }

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") ?? 1);

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

  function createPageURL(page) {
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    return `${pathname}?${params}`;
  }

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={createPageURL(Math.max(1, currentPage - 1))}
            aria-disabled={currentPage <= 1}
            tabIndex={currentPage <= 1 ? -1 : undefined}
            className={cn(currentPage <= 1 && "pointer-events-none opacity-50")}
          />
        </PaginationItem>
        {generatePages().map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={createPageURL(page)}
              isActive={page === currentPage}
              className={cn(page === currentPage && "pointer-events-none")}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href={createPageURL(Math.min(totalPages, currentPage + 1))}
            aria-disabled={currentPage >= totalPages}
            tabIndex={currentPage >= 1 ? -1 : undefined}
            className={cn(currentPage >= totalPages && "pointer-events-none opacity-50")}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
