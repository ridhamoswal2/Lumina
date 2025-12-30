
import React from "react";
import { MediaItem } from "@/services/tmdb";
import MediaCard from "./MediaCard";
import MediaGridSkeleton from "./MediaGridSkeleton";

interface MediaGridProps {
  items: MediaItem[];
  loading?: boolean;
  emptyMessage?: string;
}

const MediaGrid: React.FC<MediaGridProps> = ({ 
  items, 
  loading = false,
  emptyMessage = "No items found" 
}) => {
  return (
    <div className="w-full">
      {loading ? (
        <MediaGridSkeleton />
      ) : items.length === 0 ? (
        <div className="text-center py-12 md:py-20">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {items.map((item) => (
            <MediaCard 
              key={`${item.id}-${item.media_type || "unknown"}`} 
              item={item} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaGrid;
