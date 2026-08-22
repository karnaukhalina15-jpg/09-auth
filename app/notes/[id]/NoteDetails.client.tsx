"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import css from "./NoteDetails.module.css";

export default function NoteDetailsClient() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();

  const { data: note, isLoading } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id!),
    enabled: Boolean(id),
    refetchOnMount: false,
  });

  const handleClickBack = () => {
    router.back();
  };

  if (isLoading) {
    return <div className={css.loading}>Loading...</div>;
  }

  return (
    <main className={css.main}>
      <div className={css.container}>
        <div className={css.item}>
          <button
            type="button"
            className={css.backBtn}
            onClick={handleClickBack}
          >
            ← Back
          </button>

          <div className={css.post}>
            <div className={css.wrapper}>
              <div className={css.header}>
                <h2>{note?.title}</h2>
              </div>

              <p className={css.content}>
                {note?.content || "No content available."}
              </p>
            </div>

            {note?.tag && <p className={css.user}>Tag: {note.tag}</p>}
          </div>
        </div>
      </div>
    </main>
  );
}
