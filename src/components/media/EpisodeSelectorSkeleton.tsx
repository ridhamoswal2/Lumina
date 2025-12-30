import { Skeleton } from "@/components/ui/skeleton";

const EpisodeSelectorSkeleton: React.FC = () => {
  return (
    <div id="episodes-section" className="space-y-6 mb-12">
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-32 rounded" />
        <Skeleton className="h-10 w-48 rounded-md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="glass-morphism rounded-lg overflow-hidden"
          >
            <Skeleton className="aspect-video w-full" />
            <div className="p-4">
              <Skeleton className="h-5 w-3/4 mb-2 rounded" />
              <Skeleton className="h-4 w-full mb-1 rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
              <Skeleton className="h-3 w-24 mt-2 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EpisodeSelectorSkeleton;

