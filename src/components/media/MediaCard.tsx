
import React from "react";
import { Link } from "react-router-dom";
import { Heart, Play, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { MediaItem, getImageUrl, MediaType } from "@/services/tmdb";
import { useMedia } from "@/contexts/MediaContext";
import { useIsMobile } from "@/hooks/use-mobile";
import LazyImage from "@/components/ui/LazyImage";

interface MediaCardProps {
  item: MediaItem;
  className?: string;
  showTitle?: boolean;
  disableHover?: boolean;
}

const MediaCard: React.FC<MediaCardProps> = ({ 
  item, 
  className, 
  showTitle = true,
  disableHover = false
}) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useMedia();
  const inWatchlist = isInWatchlist(item.id);
  const mediaType = item.media_type || (item.first_air_date ? "tv" : "movie") as MediaType;
  const isMobile = useIsMobile();
  
  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWatchlist) {
      removeFromWatchlist(item.id);
    } else {
      addToWatchlist({...item, media_type: mediaType});
    }
  };
  
  return (
    <Link 
      to={`/${mediaType}/${item.id}`} 
      className={cn(
        "block relative rounded-lg overflow-hidden group",
        !disableHover && "transition-all duration-300 hover:scale-[1.03] hover:shadow-xl",
        className
      )}
      style={{ transformOrigin: 'center' }}
    >
      <div className="aspect-[2/3] relative overflow-hidden">
        <LazyImage
          src={getImageUrl(item.poster_path, "w500")}
          alt={item.title || item.name || "Media poster"}
          aspectRatio="2/3"
          className="w-full h-full"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-2 md:p-3 w-full">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 flex-shrink-0" />
                <span className="text-xs md:text-sm font-medium whitespace-nowrap">
                  {(item.vote_average != null ? item.vote_average : 0).toFixed(1)}
                </span>
              </div>
              <button 
                onClick={handleWatchlistToggle} 
                className={cn(
                  "p-1.5 md:p-2 rounded-full transition-colors flex-shrink-0 z-10",
                  inWatchlist 
                    ? "bg-primary/20 text-primary" 
                    : "bg-black/60 text-white hover:bg-primary/20 hover:text-primary backdrop-blur-sm"
                )}
                aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
              >
                <Heart className={cn("h-3 w-3 md:h-4 md:w-4", inWatchlist && "fill-current")} />
              </button>
            </div>
            
            <button className="w-full py-1.5 md:py-2 bg-primary text-primary-foreground rounded-md flex items-center justify-center text-xs md:text-sm font-medium hover:bg-primary/90 transition-colors">
              <Play className="h-3 w-3 md:h-4 md:w-4 mr-1.5 flex-shrink-0" />
              <span className="truncate">Watch</span>
            </button>
          </div>
        </div>
      </div>
      
      {showTitle && (
        <div className="mt-2 px-1 pb-1">
          <h3 className="font-medium text-xs md:text-sm truncate mb-1 leading-tight min-h-[1.5rem] flex items-center">
            <span className="truncate w-full">{item.title || item.name || "Untitled"}</span>
          </h3>
          <p className="text-[10px] md:text-xs text-muted-foreground truncate leading-tight min-h-[1rem]">
            {item.release_date?.substring(0, 4) || item.first_air_date?.substring(0, 4) || "TBA"}
          </p>
        </div>
      )}
    </Link>
  );
};

export default MediaCard;
