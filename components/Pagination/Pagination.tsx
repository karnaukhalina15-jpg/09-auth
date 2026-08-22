import ReactPaginate from "react-paginate";
import css from "@/components/Pagination/Pagination.module.css";

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (selectedPage: number) => void;
}

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationProps) {
  return (
    <nav aria-label="Pagination">
      <ReactPaginate
        forcePage={currentPage - 1}
        pageCount={pageCount}
        onPageChange={(event: { selected: number }) =>
          onPageChange(event.selected + 1)
        }
        containerClassName={css.pagination}
        activeClassName={css.active}
        pageClassName={css.pageItem}
        pageLinkClassName={css.pageLink}
        previousClassName={css.pageItem}
        previousLinkClassName={css.pageLink}
        nextClassName={css.pageItem}
        nextLinkClassName={css.pageLink}
        breakClassName={css.pageItem}
        breakLinkClassName={css.pageLink}
        previousLabel="<"
        nextLabel=">"
      />
    </nav>
  );
}
