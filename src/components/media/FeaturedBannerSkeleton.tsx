import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const FeaturedBannerSkeleton: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "relative w-full overflow-hidden mb-4 md:mb-6",
      isMobile ? "min-h-[40vh]" : "min-h-[50vh] md:min-h-[60vh] lg:min-h-[80vh]"
    )}>
      {/* Background skeleton */}
      <div className="absolute inset-0">
        <Skeleton className="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
      </div>
      
      {/* Content skeleton */}
      <div className={cn(
        "container mx-auto absolute bottom-0 left-0 right-0",
        isMobile ? "px-4 pb-6" : "px-4 pb-12 md:pb-16 lg:pb-24"
      )}>
        <div className={cn("max-w-2xl", isMobile && "max-w-full")}>
          {/* Title */}
          <Skeleton className={cn(
            "mb-2",
            isMobile ? "h-8 w-3/4" : "h-12 md:h-16 lg:h-20 w-2/3"
          )} />
          
          {/* Metadata */}
          <div className={cn(
            "flex items-center mb-2",
            isMobile ? "space-x-2" : "space-x-3 md:space-x-4 mb-4"
          )}>
            <Skeleton className={cn(isMobile ? "h-4 w-12" : "h-5 w-16")} />
            <Skeleton className={cn(isMobile ? "h-4 w-16" : "h-5 w-20")} />
          </div>
          
          {/* Overview */}
          <div className={cn(
            "space-y-2 mb-3",
            isMobile ? "" : "md:mb-6"
          )}>
            <Skeleton className={cn(
              isMobile ? "h-3 w-full" : "h-4 w-full"
            )} />
            <Skeleton className={cn(
              isMobile ? "h-3 w-5/6" : "h-4 w-5/6"
            )} />
            <Skeleton className={cn(
              isMobile ? "h-3 w-4/6 hidden" : "h-4 w-4/6"
            )} />
          </div>
          
          {/* Buttons */}
          <div className={cn(
            "flex flex-wrap",
            isMobile ? "gap-2" : "gap-3"
          )}>
            <Skeleton className={cn(
              isMobile ? "h-8 w-24" : "h-10 w-32"
            )} />
            <Skeleton className={cn(
              isMobile ? "h-8 w-20" : "h-10 w-28"
            )} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedBannerSkeleton;

