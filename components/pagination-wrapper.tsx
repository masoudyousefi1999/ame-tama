import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function PaginationWrapper({
  page,
  totalPages,
  onPageChange,
  loading = false,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}) {
  if (totalPages <= 1) return null;
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pageNumbers.push(i);
    } else if (
      (i === page - 2 && page > 3) ||
      (i === page + 2 && page < totalPages - 2)
    ) {
      pageNumbers.push("ellipsis");
    }
  }
  let lastWasEllipsis = false;

  return (
    <div className="relative">
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(page - 1)}
              aria-disabled={page === 1}
              tabIndex={page === 1 ? -1 : 0}
              href="#"
              className={
                page === 1 ? "pointer-events-none opacity-50 ml-2" : ""
              }
            />
          </PaginationItem>
          {pageNumbers.map((num, idx) => {
            if (num === "ellipsis") {
              if (lastWasEllipsis) return null;
              lastWasEllipsis = true;
              return (
                <PaginationItem key={`ellipsis-${idx}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            lastWasEllipsis = false;
            return (
              <PaginationItem key={num}>
                <PaginationLink
                  isActive={num === page}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(Number(num));
                  }}
                >
                  {num}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(page + 1)}
              aria-disabled={page === totalPages}
              tabIndex={page === totalPages ? -1 : 0}
              href="#"
              className={
                page === totalPages ? "pointer-events-none opacity-50 mr-2" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-black/40 z-10 rounded-lg">
          <LoadingSpinner size="md" />
        </div>
      )}
    </div>
  );
}
