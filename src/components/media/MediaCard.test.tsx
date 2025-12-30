import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils/testUtils';
import MediaCard from './MediaCard';
import { MediaItem } from '@/services/tmdb';

const mockMediaItem: MediaItem = {
  id: 1,
  title: 'Test Movie',
  poster_path: '/test-poster.jpg',
  backdrop_path: '/test-backdrop.jpg',
  overview: 'Test overview',
  vote_average: 8.5,
  release_date: '2024-01-01',
  genre_ids: [1, 2],
  media_type: 'movie',
};

describe('MediaCard', () => {
  it('renders movie card with title', () => {
    render(<MediaCard item={mockMediaItem} />);
    
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
  });

  it('renders TV show card with name', () => {
    const tvShow: MediaItem = {
      ...mockMediaItem,
      name: 'Test TV Show',
      title: undefined,
      first_air_date: '2024-01-01',
      media_type: 'tv',
    };
    
    render(<MediaCard item={tvShow} />);
    
    expect(screen.getByText('Test TV Show')).toBeInTheDocument();
  });

  it('displays rating', () => {
    render(<MediaCard item={mockMediaItem} />);
    
    expect(screen.getByText('8.5')).toBeInTheDocument();
  });

  it('renders link to media details page', () => {
    render(<MediaCard item={mockMediaItem} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/movie/1');
  });
});

