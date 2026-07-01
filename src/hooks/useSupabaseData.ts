import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { TeamMember, Event, GalleryItem, Session, FAQ, Tool, ChatbotQA } from '../lib/database.types';
import {
  fallbackEvents,
  fallbackLeaders,
  fallbackMembers,
  fallbackGalleryImages,
  fallbackGalleryVideos,
  fallbackSessions,
  fallbackFaqPage,
  fallbackFaqAbout,
  fallbackTools,
  fallbackChatbotQA,
  fallbackUgWinners,
  fallbackPgWinners,
} from '../data/fallback';

// ─── Generic fetch hook ──────────────────────────────────────
function useSupabaseQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: unknown }>,
  fallback: T,
  deps: unknown[] = []
): { data: T; loading: boolean; error: unknown } {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;

    const fetch = async () => {
      if (!supabase) {
        // Supabase not configured — use fallback
        setData(fallback);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await queryFn();
        if (cancelled) return;

        if (result && result.data) {
          setData(result.data as T);
        } else {
          setData(fallback);
          if (result?.error) setError(result.error);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn('Supabase query failed, using fallback:', err);
          setData(fallback);
          setError(err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}

// ─── Team Members ────────────────────────────────────────────
export function useTeamLeaders() {
  return useSupabaseQuery<TeamMember[]>(
    async () => {
      const res = await supabase!.from('team_members').select('*').eq('is_leader', true).order('sort_order');
      return { data: res.data, error: res.error };
    },
    fallbackLeaders
  );
}

export function useTeamMembers() {
  return useSupabaseQuery<TeamMember[]>(
    async () => {
      const res = await supabase!.from('team_members').select('*').eq('is_leader', false).order('sort_order');
      return { data: res.data, error: res.error };
    },
    fallbackMembers
  );
}

// ─── Events ──────────────────────────────────────────────────
export function useEvents() {
  return useSupabaseQuery<Event[]>(
    async () => {
      const res = await supabase!.from('events').select('*').order('date', { ascending: false });
      return { data: res.data, error: res.error };
    },
    fallbackEvents
  );
}

// ─── Gallery ─────────────────────────────────────────────────
export function useGalleryImages() {
  return useSupabaseQuery<GalleryItem[]>(
    async () => {
      const res = await supabase!.from('gallery').select('*').eq('type', 'image').order('sort_order');
      return { data: res.data, error: res.error };
    },
    fallbackGalleryImages
  );
}

export function useGalleryVideos() {
  return useSupabaseQuery<GalleryItem[]>(
    async () => {
      const res = await supabase!.from('gallery').select('*').eq('type', 'video').order('sort_order');
      return { data: res.data, error: res.error };
    },
    fallbackGalleryVideos
  );
}

// ─── Sessions ────────────────────────────────────────────────
export function useSessions() {
  return useSupabaseQuery<Session[]>(
    async () => {
      const res = await supabase!.from('sessions').select('*').order('sort_order');
      return { data: res.data, error: res.error };
    },
    fallbackSessions
  );
}

// ─── FAQ ─────────────────────────────────────────────────────
export function useFaqs(page: 'faq' | 'about' = 'faq') {
  const fallback = page === 'faq' ? fallbackFaqPage : fallbackFaqAbout;
  return useSupabaseQuery<FAQ[]>(
    async () => {
      const res = await supabase!.from('faqs').select('*').eq('page', page).order('sort_order');
      return { data: res.data, error: res.error };
    },
    fallback,
    [page]
  );
}

// ─── Tools ───────────────────────────────────────────────────
export function useTools() {
  return useSupabaseQuery<Tool[]>(
    async () => {
      const res = await supabase!.from('tools').select('*').order('sort_order');
      return { data: res.data, error: res.error };
    },
    fallbackTools
  );
}

// ─── Chatbot Q&A ─────────────────────────────────────────────
export function useChatbotQA() {
  return useSupabaseQuery<ChatbotQA[]>(
    async () => {
      const res = await supabase!.from('chatbot_qa').select('*').order('sort_order');
      return { data: res.data, error: res.error };
    },
    fallbackChatbotQA
  );
}

// ─── Event Winners (composite) ───────────────────────────────
type WinnerDisplay = {
  team: string;
  rank: string;
  prize?: string;
  medalKey: string;
  category?: string;
  members: { name: string; class: string }[];
};

export function useEventWinners(category: 'UG' | 'PG') {
  const fallback = category === 'UG' ? fallbackUgWinners : fallbackPgWinners;

  return useSupabaseQuery<WinnerDisplay[]>(
    async () => {
      const res = await supabase!
        .from('event_winners')
        .select('*, winner_members(*)')
        .eq('category', category)
        .order('sort_order');

      if (res.error || !res.data) return { data: null, error: res.error };

      const winners: WinnerDisplay[] = (res.data as Record<string, unknown>[]).map((w) => ({
        team: w.team_name as string,
        rank: w.rank as string,
        prize: (w.prize as string) || undefined,
        medalKey: w.medal_key as string,
        members: ((w.winner_members as Array<Record<string, unknown>>) || []).map((m) => ({
          name: m.name as string,
          class: m.class as string,
        })),
      }));

      return { data: winners, error: null };
    },
    fallback,
    [category]
  );
}

export function useAllEventWinners() {
  return useSupabaseQuery<Record<number, WinnerDisplay[]>>(
    async () => {
      const res = await supabase!
        .from('event_winners')
        .select('*, winner_members(*)')
        .order('sort_order');

      if (res.error || !res.data) return { data: null, error: res.error };

      const winnersByEvent: Record<number, WinnerDisplay[]> = {};
      
      (res.data as Record<string, unknown>[]).forEach((w) => {
        const eventId = w.event_id as number;
        if (!winnersByEvent[eventId]) winnersByEvent[eventId] = [];
        
        winnersByEvent[eventId].push({
          team: w.team_name as string,
          rank: w.rank as string,
          prize: (w.prize as string) || undefined,
          medalKey: w.medal_key as string,
          category: w.category as string,
          members: ((w.winner_members as Array<Record<string, unknown>>) || []).map((m) => ({
            name: m.name as string,
            class: m.class as string,
          })),
        });
      });

      return { data: winnersByEvent, error: null };
    },
    {}
  );
}

export function useAllEventTimelines() {
  return useSupabaseQuery<Record<number, any[]>>(
    async () => {
      const res = await supabase!
        .from('event_timeline')
        .select('*')
        .order('sort_order');

      if (res.error || !res.data) return { data: null, error: res.error };

      const timelinesByEvent: Record<number, any[]> = {};
      
      (res.data as Record<string, unknown>[]).forEach((t) => {
        const eventId = t.event_id as number;
        if (!timelinesByEvent[eventId]) timelinesByEvent[eventId] = [];
        timelinesByEvent[eventId].push(t);
      });

      return { data: timelinesByEvent, error: null };
    },
    {}
  );
}

// ─── Site Setting ────────────────────────────────────────────
export function useSiteSetting(key: string, defaultValue: string) {
  return useSupabaseQuery<string>(
    async () => {
      const res = await supabase!
        .from('site_settings')
        .select('value')
        .eq('key', key)
        .single();

      return { data: (res.data as { value: string } | null)?.value ?? null, error: res.error };
    },
    defaultValue,
    [key]
  );
}
