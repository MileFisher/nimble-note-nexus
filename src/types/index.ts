
export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  isVerified: boolean;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  defaultNoteColor: string;
}

export interface Label {
  id: string;
  name: string;
  userId: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  isPasswordProtected: boolean;
  createdAt: Date;
  updatedAt: Date;
  color: string;
  userId: string;
  labelIds: string[];
  images?: string[];
  sharedWith?: SharedUser[];
}

export interface SharedUser {
  userId: string;
  email: string;
  displayName: string;
  permission: 'read' | 'edit';
}

export type ViewMode = 'grid' | 'list';
