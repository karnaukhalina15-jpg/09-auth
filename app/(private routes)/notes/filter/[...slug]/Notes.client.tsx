"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import NoteList from "@/components/NoteList/NoteList";
import { fetchNotes } from "@/lib/api/clientApi";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import css from "./NotesPage.module.css";
import Link from "next/link";
import { NoteTag } from "@/types/note";

interface NotesClientProps {
  tag?: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [debouncedQuery] = useDebounce(search, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, debouncedQuery, tag],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 12,
        search: debouncedQuery,
        tag: tag as NoteTag,
      }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  return (
    <main className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />

        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <Link href="/notes/action/create" className={css.createBtn}>
          Create note +
        </Link>
      </header>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Something went wrong!</p>}

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
    </main>
  );
}
