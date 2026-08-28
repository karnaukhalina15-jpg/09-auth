import { cookies } from "next/headers";
import { noteApi } from "./api";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: NoteTag;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  params: FetchNotesParams = {},
): Promise<FetchNotesResponse> => {
  const cookieStore = await cookies();

  const { data } = await noteApi.get<FetchNotesResponse>("/notes", {
    headers: {
      Cookie: cookieStore.toString(),
    },
    params: {
      page: params.page ?? 1,
      perPage: params.perPage ?? 12,
      search: params.search ?? "",
      tag: params.tag,
    },
  });

  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();

  const { data } = await noteApi.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return data;
};
export const getMe = async (): Promise<User | null> => {
  try {
    // Зчитуємо кукі з серверного контексту
    const cookieStore = await cookies();

    const { data } = await noteApi.get<User>("/users/me", {
      headers: {
        Cookie: cookieStore.toString(), // ⬅️ Прокидаємо кукі в заголовок
      },
    });

    return data;
  } catch {
    return null;
  }
};

export const checkSession = async () => {
  const cookieStore = await cookies();

  const response = await noteApi.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response;
};
export const checkServerSession = async () => {
  // Дістаємо поточні cookie
  const cookieStore = await cookies();
  const res = await noteApi.get("/auth/session", {
    headers: {
      // передаємо кукі далі
      Cookie: cookieStore.toString(),
    },
  });
  // Повертаємо повний респонс, щоб proxy мав доступ до нових cookie
  return res;
};
