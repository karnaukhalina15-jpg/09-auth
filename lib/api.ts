import axios, { AxiosError } from "axios";
import { type Note, type NoteTag } from "../types/note";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DraftNote {
  title: string;
  content: string;
  tag: string;
}

export type ApiError = AxiosError<{ error: string }>;

const initialDraft: DraftNote = {
  title: "",
  content: "",
  tag: "Todo",
};

interface NoteStore {
  draft: DraftNote;
  setDraft: (note: Partial<DraftNote>) => void;
  clearDraft: () => void;
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (newFields) =>
        set((state) => ({
          draft: { ...state.draft, ...newFields },
        })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "note-draft-storage",
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
);

const nextServer = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});
export const getNotes = async (categoryId?: string) => {
  const res = await nextServer.get<NoteListResponse>("/notes", {
    params: { categoryId },
  });
  return res.data;
};
export interface NoteListResponse {
  categoryId: number;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: NoteTag;
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
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const { data } = await nextServer.get<FetchNotesResponse>("/notes", {
    params: { page, perPage, search, tag },
  });
  return data;
};
export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await nextServer.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (newNote: CreateNoteDto): Promise<Note> => {
  const { data } = await nextServer.post<Note>("/notes", newNote);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await nextServer.delete<Note>(`/notes/${id}`);
  return data;
};

export type RegisterCredentials = {
  email: string;
  password: string;
  username: string;
};

export type User = {
  id: string;
  email: string;
  userName?: string;
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
};

export const register = async (data: RegisterCredentials) => {
  const res = await nextServer.post<User>("/auth/register", data);
  return res.data;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<User>("/auth/login", data);
  return res.data;
};
type CheckSession = {
  success: boolean;
};

export const CheckSession = async () => {
  const res = await nextServer.get<CheckSessionRequest>("/auth/session");
  return res.data.success;
};

export const getMe = async () => {
  const { data } = await nextServer.get<User>("/auth/me");
  return data;
};

type CheckSessionRequest = {
  success: boolean;
};

export const CheckSessionRequest = async () => {
  const res = await nextServer.get<CheckSessionRequest>("/auth/session");
  return res.data.success;
};
