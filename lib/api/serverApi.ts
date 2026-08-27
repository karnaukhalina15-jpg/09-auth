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

export const checkSession = async (
  cookieHeader?: string,
): Promise<User | null> => {
  try {
    const cookie = cookieHeader ?? (await cookies()).toString();

    const { data } = await noteApi.get<User>("/auth/session", {
      headers: {
        Cookie: cookie,
      },
    });

    return data;
  } catch {
    return null;
  }
};
export const checkServerSession = async () => {
  try {
    const cookieStore = await cookies();

    // Передаємо куки поточного запиту далі на бекенд
    const response = await noteApi.get("/auth/session", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    // Повертаємо повний Axios response (із заголовками response.headers)
    return response;
  } catch (error) {
    console.error("checkServerSession error:", error);
    return null;
  }
};
