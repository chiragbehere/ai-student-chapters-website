// This site is deliberately static: all public content lives in fallback.ts.
// Keeping the familiar hook API means the page components stay simple while no
// network request, backend key, or Supabase client is required at runtime.
import type { TeamMember, Event, GalleryItem, Session, FAQ, Tool, ChatbotQA } from '../lib/database.types';
import {
  fallbackEvents, fallbackLeaders, fallbackMembers, fallbackGalleryImages,
  fallbackGalleryVideos, fallbackSessions, fallbackFaqPage, fallbackFaqAbout,
  fallbackTools, fallbackChatbotQA, fallbackUgWinners, fallbackPgWinners,
} from '../data/fallback';

const local = <T,>(data: T) => ({ data, loading: false, error: null });

export function useTeamLeaders() { return local<TeamMember[]>(fallbackLeaders); }
export function useTeamMembers() { return local<TeamMember[]>(fallbackMembers); }
export function useEvents() { return local<Event[]>(fallbackEvents); }
export function useGalleryImages() { return local<GalleryItem[]>(fallbackGalleryImages); }
export function useGalleryVideos() { return local<GalleryItem[]>(fallbackGalleryVideos); }
export function useSessions() { return local<Session[]>(fallbackSessions); }
export function useFaqs(page: 'faq' | 'about' = 'faq') { return local<FAQ[]>(page === 'faq' ? fallbackFaqPage : fallbackFaqAbout); }
export function useTools() { return local<Tool[]>(fallbackTools); }
export function useChatbotQA() { return local<ChatbotQA[]>(fallbackChatbotQA); }

type WinnerDisplay = { team: string; rank: string; prize?: string; medalKey: string; category?: string; members: { name: string; class: string }[] };
export function useEventWinners(category: 'UG' | 'PG') { return local<WinnerDisplay[]>(category === 'UG' ? fallbackUgWinners : fallbackPgWinners); }
export function useAllEventWinners() {
  return local<Record<number, WinnerDisplay[]>>({
    1: [...fallbackUgWinners.map(w => ({ ...w, category: 'UG' })), ...fallbackPgWinners.map(w => ({ ...w, category: 'PG' }))],
  });
}
export function useAllEventTimelines() { return local<Record<number, unknown[]>>({}); }
export function useSiteSetting(key: string, defaultValue: string) { return local(key === 'tools_password' ? 'member@aisc' : defaultValue); }
