import { noteApi } from "./api";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";

export interface RegisterCredentials {
  email: string;
  password: string;
  username?: string;
  userName?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  avatar?: string;
}

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

export interface CreateNoteDto {
  title: string;
  content: string;
  tag: NoteTag;
}

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search = "",
  tag,
}: FetchNotesParams = {}): Promise<FetchNotesResponse> => {
  const { data } = await noteApi.get<FetchNotesResponse>("/notes", {
    params: { page, perPage, search, tag },
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await noteApi.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (newNote: CreateNoteDto): Promise<Note> => {
  const { data } = await noteApi.post<Note>("/notes", newNote);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await noteApi.delete<Note>(`/notes/${id}`);
  return data;
};

export const register = async (
  credentials: RegisterCredentials,
): Promise<User> => {
  const payload = {
    email: credentials.email,
    password: credentials.password,
  };

  const { data } = await noteApi.post<User>("/auth/register", payload);
  return data;
};

export const login = async (credentials: LoginCredentials): Promise<User> => {
  const { data } = await noteApi.post<User>("/auth/login", credentials);
  return data;
};

export const logout = async (): Promise<void> => {
  await noteApi.post("/auth/logout");
};

export const checkSession = async () => {
  try {
    const res = await noteApi.get("/auth/session");
    return res.data;
  } catch {
    return null;
  }
};

export const getMe = async () => {
  try {
    const res = await noteApi.get("/users/me");
    return res.data;
  } catch {
    return null;
  }
};

export const updateMe = async (dto: UpdateUserDto): Promise<User> => {
  const { data } = await noteApi.patch<User>("/users/me", dto);
  return data;
};
