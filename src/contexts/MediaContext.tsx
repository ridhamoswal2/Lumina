
import React, { createContext, useState, useContext, ReactNode } from "react";
import { MediaItem, MediaType, getGenres, Genre } from "../services/tmdb";
import { WatchlistItem, getWatchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } from "../services/watchlist";
import { toast } from "sonner";

interface MediaContextType {
  watchlist: WatchlistItem[];
  genres: Record<MediaType, Genre[]>;
  loadingGenres: boolean;
  addToWatchlist: (item: MediaItem) => void;
  removeFromWatchlist: (id: number) => void;
  isInWatchlist: (id: number) => boolean;
  refreshWatchlist: () => void;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider = ({ children }: { children: ReactNode }) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(getWatchlist());
  const [genres, setGenres] = useState<Record<MediaType, Genre[]>>({ movie: [], tv: [] });
  const [loadingGenres, setLoadingGenres] = useState<boolean>(true);

  // Fetch genres when component mounts
  React.useEffect(() => {
    const fetchAllGenres = async () => {
      try {
        setLoadingGenres(true);
        
        // Try to get genres from localStorage first
        const cachedGenres = localStorage.getItem('genres');
        if (cachedGenres) {
          const parsedGenres = JSON.parse(cachedGenres);
          setGenres(parsedGenres);
          setLoadingGenres(false);
        }
        
        // Fetch fresh data regardless of cache
        const [movieGenres, tvGenres] = await Promise.all([
          getGenres("movie"),
          getGenres("tv")
        ]);
        
        const newGenres = {
          movie: movieGenres.genres,
          tv: tvGenres.genres
        };
        
        // Update state and cache
        setGenres(newGenres);
        localStorage.setItem('genres', JSON.stringify(newGenres));
      } catch (error) {
        console.error("Error fetching genres:", error);
        toast.error("Failed to load genres. Please refresh the page.");
        
        // Try to use cached data if available
        const cachedGenres = localStorage.getItem('genres');
        if (cachedGenres) {
          setGenres(JSON.parse(cachedGenres));
        }
      } finally {
        setLoadingGenres(false);
      }
    };
    
    fetchAllGenres();
  }, []);

  // Refresh watchlist from localStorage
  const refreshWatchlist = () => {
    setWatchlist(getWatchlist());
  };

  // Add item to watchlist with UI feedback
  const handleAddToWatchlist = (item: MediaItem) => {
    addToWatchlist(item);
    refreshWatchlist();
    toast.success(`Added ${item.title || item.name} to watchlist`);
  };

  // Remove item from watchlist with UI feedback
  const handleRemoveFromWatchlist = (id: number) => {
    const item = watchlist.find(item => item.id === id);
    removeFromWatchlist(id);
    refreshWatchlist();
    
    if (item) {
      toast.success(`Removed ${item.title || item.name} from watchlist`);
    }
  };

  return (
    <MediaContext.Provider
      value={{
        watchlist,
        genres,
        loadingGenres,
        addToWatchlist: handleAddToWatchlist,
        removeFromWatchlist: handleRemoveFromWatchlist,
        isInWatchlist,
        refreshWatchlist
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

export const useMedia = () => {
  const context = useContext(MediaContext);
  if (context === undefined) {
    throw new Error("useMedia must be used within a MediaProvider");
  }
  return context;
};
