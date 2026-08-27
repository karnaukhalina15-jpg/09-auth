import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NoteDetailsClient from "@/app/(private routes)/notes/[id]/NoteDetails.client";
import { fetchNoteById } from "@/lib/api/serverApi";
import css from "./Modal.module.css";

interface NoteDetailsProps {
  params: Promise<{ id: string }>;
}

export default async function NoteDetailsPage({ params }: NoteDetailsProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <div className={css.backdrop}>
      <div className={css.modal}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <NoteDetailsClient />
        </HydrationBoundary>
      </div>
    </div>
  );
}
