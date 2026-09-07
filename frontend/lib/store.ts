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
  setSearchQuery: (query: string) => void;
  setTranscriptSearchQuery: (query: string) => void;
  setSidebarOpen: (open: boolean) => void;
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
  setSearchQuery: (query) => set({ searchQuery: query }),
  setTranscriptSearchQuery: (query) => set({ transcriptSearchQuery: query }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
