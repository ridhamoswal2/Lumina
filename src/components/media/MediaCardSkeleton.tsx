import { Skeleton } from "@/components/ui/skeleton";

interface MediaCardSkeletonProps {
  className?: string;
}

const MediaCardSkeleton: React.FC<MediaCardSkeletonProps> = ({ className }) => {
  return (
    <div className={className}>
      <Skeleton className="aspect-[2/3] w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4 mt-2 rounded" />
      <Skeleton className="h-3 w-1/2 mt-1 rounded" />
    </div>
  );
};

export default MediaCardSkeleton;

