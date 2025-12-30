import React, { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string | null;
  alt: string;
  placeholder?: string;
  className?: string;
  aspectRatio?: "2/3" | "16/9" | "1/1" | "4/3";
  onError?: () => void;
  eager?: boolean; // Load immediately without lazy loading
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder = "/placeholder.svg",
  className,
  aspectRatio,
  onError,
  eager = false,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(eager);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If eager loading is enabled, skip intersection observer
    if (eager) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "50px", // Start loading 50px before the image enters viewport
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [eager]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    if (onError) {
      onError();
    }
  };

  const imageSrc = hasError || !src ? placeholder : src;
  const aspectRatioClass = aspectRatio ? `aspect-${aspectRatio}` : "";

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", aspectRatioClass, className)}
    >
      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      {isInView ? (
        <img
          ref={imgRef}
          src={imageSrc || undefined}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          {...props}
        />
      ) : (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
    </div>
  );
};

export default LazyImage;

