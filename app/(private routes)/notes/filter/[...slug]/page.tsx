import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import { NoteTag } from "@/types/note";
import type { Metadata } from "next";
type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const currentFilter = slug?.[0] || "all";
  const capitalizedFilter =
    currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1);

  return {
    title: `${capitalizedFilter} Notes | NoteHub`,
    description: `Filter notes by ${capitalizedFilter} status in NoteHub.`,
    openGraph: {
      title: `${capitalizedFilter} Notes | NoteHub`,
      description: `Filter notes by ${capitalizedFilter} status in NoteHub.`,
      url: `https://notehub.com/notes/filter/${currentFilter}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub Filter",
        },
      ],
    },
  };
}

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export default async function NotesFilterPage({ params }: PageProps) {
  const { slug } = await params;

  // Отримуємо значення тегу з масиву slug
  const rawTag = slug?.[0];
  const tag = rawTag === "all" ? undefined : rawTag;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () =>
      fetchNotes({ page: 1, perPage: 12, search: "", tag: tag as NoteTag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
