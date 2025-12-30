import { Skeleton } from "@/components/ui/skeleton";
import MediaCardSkeleton from "./MediaCardSkeleton";
import { useIsMobile } from "@/hooks/use-mobile";

interface MediaRowSkeletonProps {
  title?: string;
}

const MediaRowSkeleton: React.FC<MediaRowSkeletonProps> = ({ title }) => {
  const isMobile = useIsMobile();
  const cardWidth = isMobile ? "w-[130px]" : "w-[160px] md:w-[200px]";

  return (
    <div className="my-6 md:my-8">
      {title && (
        <div className="mb-3 md:mb-4 px-4 md:px-0">
          <Skeleton className="h-7 w-48 rounded" />
        </div>
      )}
      <div className="flex overflow-x-auto gap-3 md:gap-4 pb-4 scrollbar-none snap-x pl-4 md:pl-0">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className={`flex-none snap-start ${cardWidth}`}>
            <MediaCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaRowSkeleton;

