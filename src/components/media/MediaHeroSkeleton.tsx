import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const MediaHeroSkeleton: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="relative min-h-[80vh] md:min-h-screen flex items-end overflow-hidden">
      {/* Background skeleton */}
      <div className="absolute inset-0 z-0">
        <Skeleton className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
      </div>

      {/* Content skeleton */}
      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10 w-full">
        <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-8">
          {/* Poster skeleton */}
          <div className={cn(
            "w-1/2 md:w-1/4 lg:max-w-xs mx-auto md:mx-0 glass-morphism rounded-lg overflow-hidden",
            isMobile ? "max-w-[180px]" : ""
          )}>
            <Skeleton className="aspect-[2/3] w-full" />
          </div>

          {/* Details skeleton */}
          <div className="max-w-2xl w-full">
            {/* Title */}
            <Skeleton className="h-10 md:h-12 lg:h-14 w-3/4 mb-2 rounded" />
            
            {/* Metadata badges */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3 md:mb-4">
              <Skeleton className="h-6 w-16 rounded-md" />
              <Skeleton className="h-6 w-20 rounded-md" />
              <Skeleton className="h-6 w-16 rounded-md" />
              <Skeleton className="h-6 w-20 rounded-md" />
            </div>

            {/* Overview */}
            <div className="space-y-2 mb-4 md:mb-6">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 pb-4 md:pb-0">
              <Skeleton className="h-10 md:h-12 w-32 rounded-full" />
              <Skeleton className="h-10 md:h-12 w-36 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaHeroSkeleton;

