import { Skeleton } from "@/components/ui/skeleton";
import MediaCardSkeleton from "./MediaCardSkeleton";

const MediaGridSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
      {Array.from({ length: 20 }).map((_, index) => (
        <MediaCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default MediaGridSkeleton;

