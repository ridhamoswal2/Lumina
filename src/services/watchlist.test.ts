import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
} from './watchlist';
import { MediaItem } from './tmdb';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('watchlist service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const mockMediaItem: MediaItem = {
    id: 1,
    title: 'Test Movie',
    poster_path: '/test.jpg',
    backdrop_path: '/test-backdrop.jpg',
    overview: 'Test',
    vote_average: 8.5,
    release_date: '2024-01-01',
    genre_ids: [1],
    media_type: 'movie',
  };

  it('should return empty array when watchlist is empty', () => {
    const watchlist = getWatchlist();
    expect(watchlist).toEqual([]);
  });

  it('should add item to watchlist', () => {
    addToWatchlist(mockMediaItem);
    const watchlist = getWatchlist();
    
    expect(watchlist).toHaveLength(1);
    expect(watchlist[0].id).toBe(1);
    expect(watchlist[0].title).toBe('Test Movie');
    expect(watchlist[0].addedAt).toBeDefined();
  });

  it('should not add duplicate items', () => {
    addToWatchlist(mockMediaItem);
    addToWatchlist(mockMediaItem);
    
    const watchlist = getWatchlist();
    expect(watchlist).toHaveLength(1);
  });

  it('should remove item from watchlist', () => {
    addToWatchlist(mockMediaItem);
    removeFromWatchlist(1);
    
    const watchlist = getWatchlist();
    expect(watchlist).toHaveLength(0);
  });

  it('should check if item is in watchlist', () => {
    expect(isInWatchlist(1)).toBe(false);
    
    addToWatchlist(mockMediaItem);
    expect(isInWatchlist(1)).toBe(true);
  });
});

