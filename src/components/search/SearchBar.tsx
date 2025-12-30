
import React, { useState, useEffect, useRef } from "react";
import { X, Search, Film, Tv } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { searchMedia, MediaItem, getImageUrl } from "@/services/tmdb";
import LazyImage from "@/components/ui/LazyImage";

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      // Prevent background scrolling and ensure blur effect
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.height = "100%";
      
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      // Restore background scrolling
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
      setQuery("");
      setResults([]);
    }
    
    return () => {
      // Cleanup on unmount
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.length > 2) {
        setLoading(true);
        try {
          // Fetch all pages of results
          let allResults: MediaItem[] = [];
          let page = 1;
          let hasMore = true;
          
          while (hasMore && page <= 5) { // Limit to 5 pages to avoid too many requests
            const data = await searchMedia(query, page);
            const filtered = data.results.filter(item => 
              (item.media_type === "movie" || item.media_type === "tv") && 
              (item.poster_path || item.backdrop_path)
            );
            allResults = [...allResults, ...filtered];
            
            hasMore = page < data.total_pages && filtered.length > 0;
            page++;
          }
          
          setResults(allResults);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleItemClick = (item: MediaItem) => {
    navigate(`/${item.media_type}/${item.id}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md backdrop-saturate-150 flex flex-col animate-fade-in">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="glass-morphism flex items-center rounded-full w-full max-w-2xl mx-auto overflow-hidden px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20">
            <Search className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for movies, TV shows..."
              className="bg-transparent border-none outline-none flex-1 text-foreground placeholder-muted-foreground"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button onClick={() => setQuery("")} className="flex-shrink-0">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            )}
          </div>
          <button 
            onClick={onClose}
            className="ml-4 p-2 glass-morphism rounded-full hover:bg-white/10 transition-colors bg-white/10 backdrop-blur-xl border border-white/20"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto max-h-[70vh] overflow-y-auto scrollbar-none">
            {query.length > 0 && (
              <div className="mb-4">
                {results.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    {query.length < 3 
                      ? "Type at least 3 characters to search" 
                      : "No results found"}
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {results.map((item) => (
                      <div 
                        key={`${item.media_type}-${item.id}`}
                        onClick={() => handleItemClick(item)}
                        className="glass-morphism rounded-lg overflow-hidden cursor-pointer bg-white/5 backdrop-blur-xl border border-white/10 transition-transform duration-300 hover:scale-[1.02] hover:-translate-y-1 group"
                      >
                        <div className="aspect-[2/3] relative overflow-hidden">
                          <LazyImage
                            src={getImageUrl(item.poster_path || item.backdrop_path, "w500")}
                            alt={item.title || item.name || "Search result"}
                            aspectRatio="2/3"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 glass-morphism rounded-full px-2 py-1 text-xs flex items-center bg-black/60 backdrop-blur-sm z-10">
                            {item.media_type === "movie" 
                              ? <Film className="h-3 w-3 mr-1 flex-shrink-0" /> 
                              : <Tv className="h-3 w-3 mr-1 flex-shrink-0" />}
                            <span className="whitespace-nowrap">{item.media_type === "movie" ? "Movie" : "TV"}</span>
                          </div>
                        </div>
                        <div className="p-3 min-h-[60px]">
                          <h3 className="font-semibold text-sm truncate mb-1 leading-tight min-h-[1.5rem] flex items-center">
                            <span className="truncate w-full">{item.title || item.name || "Untitled"}</span>
                          </h3>
                          <p className="text-xs text-muted-foreground truncate leading-tight min-h-[1rem]">
                            {item.release_date?.substring(0, 4) || item.first_air_date?.substring(0, 4) || "Unknown"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
