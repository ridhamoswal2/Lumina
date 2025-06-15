
import React, { useState } from "react";
import { Play, Info, Heart, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DetailedMediaItem, getImageUrl } from "@/services/tmdb";
import { useMedia } from "@/contexts/MediaContext";
import { useIsMobile } from "@/hooks/use-mobile";
import ServerSelector from "./ServerSelector";

interface MediaHeroProps {
  item: DetailedMediaItem;
  mediaType: "movie" | "tv";
  selectedSeason?: number;
  selectedEpisode?: number;
  showPlayer?: boolean;
  selectedServerUrl?: string;
  onPlayerClose?: () => void;
  onServerSelect?: (serverUrl: string) => void;
}

const MediaHero: React.FC<MediaHeroProps> = ({ 
  item, 
  mediaType, 
  selectedSeason = 1, 
  selectedEpisode = 1,
  showPlayer = false,
  selectedServerUrl = "",
  onPlayerClose,
  onServerSelect
}) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useMedia();
  const inWatchlist = isInWatchlist(item.id);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showServerSelector, setShowServerSelector] = useState(false);
  const isMobile = useIsMobile();
  
  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(item.id);
    } else {
      addToWatchlist({...item, media_type: mediaType});
    }
  };
  
  // Find trailer or teaser
  const trailer = item.videos?.results.find(
    (video) => video.type === "Trailer" || video.type === "Teaser"
  );
  
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleWatchNow = () => {
    setShowServerSelector(true);
  };

  const handleServerSelectLocal = (serverUrl: string) => {
    console.log("MediaHero: Server selected with URL:", serverUrl);
    setShowServerSelector(false);
    
    // Use parent callback if provided, otherwise handle locally
    if (onServerSelect) {
      onServerSelect(serverUrl);
    } else {
      // This shouldn't happen in the current implementation
      console.log("No onServerSelect callback provided");
    }
  };
  
  return (
    <div className="relative min-h-[80vh] md:min-h-screen flex items-end overflow-hidden">
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={getImageUrl(item.backdrop_path || item.poster_path, "original") || "/placeholder.svg"}
          alt={item.title || item.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10 w-full">
        <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-8">
          {/* Poster */}
          <div className={cn(
            "w-1/2 md:w-1/4 lg:max-w-xs mx-auto md:mx-0 glass-morphism rounded-lg overflow-hidden",
            isMobile ? "max-w-[180px]" : ""
          )}>
            <img
              src={getImageUrl(item.poster_path, "w500") || "/placeholder.svg"}
              alt={item.title || item.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Details */}
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient mb-2">
              {item.title || item.name}
            </h1>
            
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
              <span className="glass-morphism px-2 py-1 rounded-md">
                {item.release_date?.substring(0, 4) || 
                 item.first_air_date?.substring(0, 4) || 
                 "TBA"}
              </span>
              
              {mediaType === "movie" && item.runtime && (
                <span className="glass-morphism px-2 py-1 rounded-md">
                  {formatRuntime(item.runtime)}
                </span>
              )}
              
              {item.vote_average > 0 && (
                <span className="glass-morphism px-2 py-1 rounded-md flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1">{item.vote_average.toFixed(1)}</span>
                </span>
              )}
              
              {item.genres.slice(0, isMobile ? 2 : undefined).map((genre) => (
                <span key={genre.id} className="glass-morphism px-2 py-1 rounded-md">
                  {genre.name}
                </span>
              ))}
            </div>
            
            {/* Overview */}
            <p className="text-sm md:text-base opacity-90 mb-4 md:mb-6 line-clamp-3 md:line-clamp-none">
              {item.overview}
            </p>
            
            {/* Buttons */}
            <div className="flex flex-wrap gap-3 pb-4 md:pb-0">
              <Button 
                size={isMobile ? "sm" : "lg"} 
                className="rounded-full"
                onClick={handleWatchNow}
              >
                <Play className="h-4 w-4 mr-2" />
                Watch Now
              </Button>
              
              {trailer && (
                <Button 
                  variant="outline" 
                  size={isMobile ? "sm" : "lg"} 
                  className="rounded-full"
                  onClick={() => setShowTrailer(true)}
                >
                  <Info className="h-4 w-4 mr-2" />
                  {isMobile ? "Trailer" : "Watch Trailer"}
                </Button>
              )}
              
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "rounded-full",
                  inWatchlist && "text-primary border-primary"
                )}
                onClick={handleWatchlistToggle}
              >
                <Heart className={cn("h-4 w-4", inWatchlist && "fill-current")} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Server Selector Modal */}
      <ServerSelector
        isOpen={showServerSelector}
        onClose={() => setShowServerSelector(false)}
        onServerSelect={handleServerSelectLocal}
        item={item}
        mediaType={mediaType}
        season={selectedSeason}
        episode={selectedEpisode}
      />
      
      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video">
            <Button
              variant="outline"
              size="icon"
              className="absolute -top-14 right-0 rounded-full bg-black/70 text-white border-white/20 hover:bg-black/90 z-10"
              onClick={() => setShowTrailer(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Trailer"
            />
          </div>
        </div>
      )}

      {/* Player Modal */}
      {showPlayer && selectedServerUrl && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl aspect-video">
            <Button
              variant="outline"
              size="icon"
              className="absolute -top-12 right-0 rounded-full bg-white/10 text-white border-white/20 hover:bg-white/20 z-10"
              onClick={onPlayerClose}
            >
              <X className="h-5 w-5" />
            </Button>
            <iframe
              src={selectedServerUrl}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="no-referrer"
              title={`Watch ${item.title || item.name}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaHero;
