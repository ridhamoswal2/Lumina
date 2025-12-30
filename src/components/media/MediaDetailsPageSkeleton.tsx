import { Skeleton } from "@/components/ui/skeleton";
import MediaHeroSkeleton from "./MediaHeroSkeleton";
import EpisodeSelectorSkeleton from "./EpisodeSelectorSkeleton";
import { useParams } from "react-router-dom";

const MediaDetailsPageSkeleton: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const mediaType = window.location.pathname.includes("/movie/") ? "movie" : "tv";

  return (
    <div>
      {/* Hero skeleton */}
      <MediaHeroSkeleton />
      
      {/* Content skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2">
            {/* Episode selector skeleton for TV shows */}
            {mediaType === "tv" && <EpisodeSelectorSkeleton />}
            
            {/* Overview section */}
            <div className="mb-8">
              <Skeleton className="h-8 w-32 mb-4 rounded" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-5/6 rounded" />
                <Skeleton className="h-4 w-4/6 rounded" />
              </div>
            </div>

            {/* Cast section skeleton */}
            <div>
              <Skeleton className="h-8 w-24 mb-4 rounded" />
              <div className="flex flex-wrap gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="text-center">
                    <Skeleton className="w-24 h-24 rounded-full mb-2" />
                    <Skeleton className="h-4 w-20 mx-auto mb-1 rounded" />
                    <Skeleton className="h-3 w-16 mx-auto rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div>
            <div className="glass-morphism rounded-lg p-6">
              <Skeleton className="h-7 w-20 mb-4 rounded" />
              <div className="space-y-3">
                <div>
                  <Skeleton className="h-4 w-24 mb-2 rounded" />
                  <Skeleton className="h-5 w-32 rounded" />
                </div>
                <div>
                  <Skeleton className="h-4 w-20 mb-2 rounded" />
                  <Skeleton className="h-5 w-24 rounded" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2 rounded" />
                  <Skeleton className="h-5 w-20 rounded" />
                </div>
                <div>
                  <Skeleton className="h-4 w-20 mb-2 rounded" />
                  <Skeleton className="h-5 w-40 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaDetailsPageSkeleton;

