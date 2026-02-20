
import React, { useState, useEffect } from "react";
import FeaturedBanner from "@/components/media/FeaturedBanner";
import FeaturedBannerSkeleton from "@/components/media/FeaturedBannerSkeleton";
import MediaRow from "@/components/media/MediaRow";
import MediaRowSkeleton from "@/components/media/MediaRowSkeleton";
import { 
  getTrending, 
  getPopularMovies, 
  getPopularTVShows, 
  getTopRated,
  getNowPlayingMovies,
  MediaItem
} from "@/services/tmdb";
import { toast } from "sonner";
import { handleError } from "@/utils/errorHandler";

const HomePage: React.FC = () => {
  const [featuredItem, setFeaturedItem] = useState<MediaItem | null>(null);
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [popularMovies, setPopularMovies] = useState<MediaItem[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<MediaItem[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<MediaItem[]>([]);
  const [nowPlaying, setNowPlaying] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel with individual error handling
        // This allows sections to load independently even if one fails
        const results = await Promise.allSettled([
          getTrending("all", "day"),
          getPopularMovies(),
          getPopularTVShows(),
          getTopRated("movie"),
          getNowPlayingMovies()
        ]);

        // Handle each result individually
        if (results[0].status === "fulfilled") {
          const trendingRes = results[0].value;
          if (trendingRes.results.length > 0) {
            const filteredItems = trendingRes.results.filter(item => item.backdrop_path);
            const randomIndex = Math.floor(Math.random() * Math.min(5, filteredItems.length));
            setFeaturedItem(filteredItems[randomIndex] || trendingRes.results[0]);
          }
          setTrending(trendingRes.results);
        } else {
          console.error("Failed to load trending:", results[0].reason);
          setTrending([]);
        }

        if (results[1].status === "fulfilled") {
          setPopularMovies(results[1].value.results);
        } else {
          console.error("Failed to load popular movies:", results[1].reason);
          setPopularMovies([]);
        }

        if (results[2].status === "fulfilled") {
          setPopularTVShows(results[2].value.results);
        } else {
          console.error("Failed to load popular TV shows:", results[2].reason);
          setPopularTVShows([]);
        }

        if (results[3].status === "fulfilled") {
          setTopRatedMovies(results[3].value.results);
        } else {
          console.error("Failed to load top rated movies:", results[3].reason);
          setTopRatedMovies([]);
        }

        if (results[4].status === "fulfilled") {
          setNowPlaying(results[4].value.results);
        } else {
          console.error("Failed to load now playing:", results[4].reason);
          setNowPlaying([]);
        }

        // Show error only if none of the requests succeeded
        const allFailed = results.every(result => result.status === "rejected");
        if (allFailed) {
          const error = results[0].status === "rejected" ? results[0].reason : new Error("Failed to load content");
          handleError(error, "Failed to load home content");
        }
      } catch (error) {
        handleError(error, "Failed to load home content");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div>
      {/* Hero section */}
      {loading ? (
        <FeaturedBannerSkeleton />
      ) : featuredItem && (
        <FeaturedBanner item={featuredItem} />
      )}

      {/* Content rows */}
      <div className="container mx-auto px-4 pb-16">
        {loading ? (
          <>
            <MediaRowSkeleton title="Trending Today" />
            <MediaRowSkeleton title="Popular Movies" />
            <MediaRowSkeleton title="Popular TV Shows" />
            <MediaRowSkeleton title="Top Rated Movies" />
            <MediaRowSkeleton title="Now Playing" />
          </>
        ) : (
          <>
            <MediaRow 
              title="Trending Today" 
              items={trending} 
            />
            
            <MediaRow 
              title="Popular Movies" 
              items={popularMovies} 
            />
            
            <MediaRow 
              title="Popular TV Shows" 
              items={popularTVShows} 
            />
            
            <MediaRow 
              title="Top Rated Movies" 
              items={topRatedMovies} 
            />
            
            <MediaRow 
              title="Now Playing" 
              items={nowPlaying} 
            />
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
