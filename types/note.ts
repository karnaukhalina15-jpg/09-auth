export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
}

export type AuthResponse = {
  email: string;
  password: string;
  userName: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type CheckSessionRequest = {
  success: boolean;
};
