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

interface UIState {
  searchQuery: string;
  transcriptSearchQuery: string;
  sidebarOpen: boolean;
  isCreateModalOpen: boolean;
  isLiveCaptureOpen: boolean;
  isUpgradeModalOpen: boolean;
  upgradeModalFeature: string;
  isPremium: boolean;
  createModalInitialTab: 'schedule' | 'upload';
  setSearchQuery: (query: string) => void;
  setTranscriptSearchQuery: (query: string) => void;
  setSidebarOpen: (open: boolean) => void;
  setIsCreateModalOpen: (open: boolean, initialTab?: 'schedule' | 'upload') => void;
  setIsLiveCaptureOpen: (open: boolean) => void;
  setIsUpgradeModalOpen: (open: boolean) => void;
  setUpgradeModalFeature: (feature: string) => void;
  setIsPremium: (premium: boolean) => void;
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
  upgradeModalFeature: 'Live Capture',
  isPremium: false,
  createModalInitialTab: 'schedule',
  setSearchQuery: (query) => set({ searchQuery: query }),
  setTranscriptSearchQuery: (query) => set({ transcriptSearchQuery: query }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setIsCreateModalOpen: (open, initialTab) => set({
    isCreateModalOpen: open,
    ...(initialTab ? { createModalInitialTab: initialTab } : {})
  }),
  setIsLiveCaptureOpen: (open) => set({ isLiveCaptureOpen: open }),
  setIsUpgradeModalOpen: (open) => set({ isUpgradeModalOpen: open }),
  setUpgradeModalFeature: (feature) => set({ upgradeModalFeature: feature }),
  setIsPremium: (premium) => set({ isPremium: premium }),
}));
