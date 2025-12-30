
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
        
        // Fetch all data in parallel
        const [
          trendingRes,
          popularMoviesRes,
          popularTVRes,
          topRatedMoviesRes,
          nowPlayingRes
        ] = await Promise.all([
          getTrending("all", "day"),
          getPopularMovies(),
          getPopularTVShows(),
          getTopRated("movie"),
          getNowPlayingMovies()
        ]);

        // Set featured item from trending
        if (trendingRes.results.length > 0) {
          // Pick a random trending item with a backdrop
          const filteredItems = trendingRes.results.filter(item => item.backdrop_path);
          const randomIndex = Math.floor(Math.random() * Math.min(5, filteredItems.length));
          setFeaturedItem(filteredItems[randomIndex] || trendingRes.results[0]);
        }

        setTrending(trendingRes.results);
        setPopularMovies(popularMoviesRes.results);
        setPopularTVShows(popularTVRes.results);
        setTopRatedMovies(topRatedMoviesRes.results);
        setNowPlaying(nowPlayingRes.results);
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
