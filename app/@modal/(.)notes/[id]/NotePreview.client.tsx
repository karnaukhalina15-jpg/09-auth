"use client";

import { useQuery } from "@tanstack/react-query";
import Modal from "@/components/Modal/Modal";
import { fetchNoteById } from "@/lib/api/clientApi";
import { useParams, useRouter } from "next/navigation";

import css from "./NotePreview.module.css";

export default function NotePreviewClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal isOpen={true} onClose={handleClose}>
      <button className={css.backBtn} onClick={handleClose}>
        ← Back
      </button>

      {isLoading && <p>Loading note...</p>}
      {isError && <p>Failed to load note details.</p>}

      {note && (
        <div className={css.note}>
          <div className={css.wrapper}>
            <div className={css.header}>
              <h2>{note.title}</h2>
            </div>
            <p className={css.content}>{note.content}</p>
          </div>
          {note.tag && <span className={css.tag}>{note.tag}</span>}
        </div>
      )}
    </Modal>
  );
}
