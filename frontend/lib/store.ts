import { create } from 'zustand';

interface PlayerState {
  currentTime: number;
  isPlaying: boolean;
  duration: number;
  activeSegmentId: number | null;
  setCurrentTime: (time: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setDuration: (duration: number) => void;
  setActiveSegmentId: (id: number | null) => void;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  company: string;
  phone: string;
  timezone: string;
  language: string;
  avatarUrl: string | null;
  avatarType: 'photo' | 'initial' | 'blank' | 'blank-neutral';
}

interface UIState {
  searchQuery: string;
  transcriptSearchQuery: string;
  sidebarOpen: boolean;
  isCreateModalOpen: boolean;
  isLiveCaptureOpen: boolean;
  isUpgradeModalOpen: boolean;
  isAccountModalOpen: boolean;
  mobileMenuOpen: boolean;
  upgradeModalFeature: string;
  isPremium: boolean;
  createModalInitialTab: 'schedule' | 'upload';
  userProfile: UserProfile;
  setSearchQuery: (query: string) => void;
  setTranscriptSearchQuery: (query: string) => void;
  setSidebarOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setIsCreateModalOpen: (open: boolean, initialTab?: 'schedule' | 'upload') => void;
  setIsLiveCaptureOpen: (open: boolean) => void;
  setIsUpgradeModalOpen: (open: boolean) => void;
  setIsAccountModalOpen: (open: boolean) => void;
  setUpgradeModalFeature: (feature: string) => void;
  setIsPremium: (premium: boolean) => void;
  setUserProfile: (profile: Partial<UserProfile>) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentTime: 0,
  isPlaying: false,
  duration: 0,
  activeSegmentId: null,
  setCurrentTime: (time) => set({ currentTime: time }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setDuration: (duration) => set({ duration }),
  setActiveSegmentId: (id) => set({ activeSegmentId: id }),
}));

export const useUIStore = create<UIState>((set) => ({
  searchQuery: '',
  transcriptSearchQuery: '',
  sidebarOpen: true,
  isCreateModalOpen: false,
  isLiveCaptureOpen: false,
  isUpgradeModalOpen: false,
  isAccountModalOpen: false,
  mobileMenuOpen: false,
  upgradeModalFeature: 'Live Capture',
  isPremium: false,
  createModalInitialTab: 'schedule',
  userProfile: {
    name: 'Alex Vance',
    email: 'alex.vance@company.com',
    role: 'Lead Product Architect',
    company: 'Fireflies Workspace',
    phone: '+1 (555) 234-5678',
    timezone: 'UTC-05:00 (Eastern Time)',
    language: 'English (US)',
    avatarUrl: null,
    avatarType: 'blank', // Default to blank photo as requested
  },
  setSearchQuery: (query) => set({ searchQuery: query }),
  setTranscriptSearchQuery: (query) => set({ transcriptSearchQuery: query }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setIsCreateModalOpen: (open, initialTab) => set({
    isCreateModalOpen: open,
    ...(initialTab ? { createModalInitialTab: initialTab } : {})
  }),
  setIsLiveCaptureOpen: (open) => set({ isLiveCaptureOpen: open }),
  setIsUpgradeModalOpen: (open) => set({ isUpgradeModalOpen: open }),
  setIsAccountModalOpen: (open) => set({ isAccountModalOpen: open }),
  setUpgradeModalFeature: (feature) => set({ upgradeModalFeature: feature }),
  setIsPremium: (premium) => set({ isPremium: premium }),
  setUserProfile: (profile) => set((state) => ({
    userProfile: { ...state.userProfile, ...profile }
  })),
}));
