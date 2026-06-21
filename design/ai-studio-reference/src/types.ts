export interface TranscriptItem {
  time: string;
  text: string;
  speaker?: string;
}

export interface Recording {
  id: string;
  title: string;
  duration: string;
  description: string;
  thumbnail: string;
  isNew?: boolean;
  isHd?: boolean;
  author?: string;
  authorAvatar?: string;
  createdAt: string;
  category: string;
  privacy: 'public' | 'draft' | 'locked' | 'live';
  transcript?: TranscriptItem[];
}

export interface WorkspacePreferences {
  defaultVideoQuality: string;
  autoGenerateSOPs: boolean;
  showCursorHighlighting: boolean;
  workspaceName: string;
  billingPlan: string;
}

export interface UserProfile {
  displayName: string;
  email: string;
  role: string;
  activeWorkspace: string;
  isProUser?: boolean;
  avatarUrl: string;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
  status?: string; // e.g. "Pending"
}
