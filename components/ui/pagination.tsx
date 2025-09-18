import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";
import { Text } from "./text";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function getPageNumbers(currentPage: number, totalPages: number) {
  const delta = 1; // how many pages to show around current
  const pages: (number | string)[] = [];

  // Always include first page
  pages.push(1);

  // Add left ellipsis if needed
  if (currentPage - delta > 2) {
    pages.push("…");
  }

  // Pages around the current page
  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(totalPages - 1, currentPage + delta);
    i++
  ) {
    pages.push(i);
  }

  // Add right ellipsis if needed
  if (currentPage + delta < totalPages - 1) {
    pages.push("…");
  }

  // Always include last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <Button
        variant={"outline"}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-lg border text-sm font-medium flex items-center gap-1
                   disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        <ChevronLeft className="w-4 h-4" />
        Prev
      </Button>

      {/* Page numbers */}
      <div className="flex items-center space-x-1">
        {pages.map((page, idx) =>
          page === "…" ? (
            <span key={idx} className="px-3 py-1 text-gray-500">
              …
            </span>
          ) : (
            <Button
              variant={"outline"}
              key={idx}
              onClick={() => onPageChange(page as number)}
              className={`px-3 py-1 rounded-lg border text-sm font-medium
                ${
                  currentPage === page
                    ? "bg-[#B52221] text-white border-[#F3E7E780]"
                    : "hover:bg-gray-100"
                }`}
            >
              {page}
            </Button>
          )
        )}
      </div>

      <Button
        variant={"outline"}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-lg border text-sm font-medium flex items-center gap-1
                   disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        <Text className="sr-only">Next</Text>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
