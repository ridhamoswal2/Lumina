import { TMDBError } from "@/utils/errorHandler";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || "";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

if (!API_KEY) {
  console.warn("VITE_TMDB_API_KEY is not set. Please add it to your .env file.");
}

export type MediaType = "movie" | "tv";

export interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: MediaType;
  genre_ids: number[];
}

export interface DetailedMediaItem extends MediaItem {
  runtime?: number;
  episode_run_time?: number[];
  genres: { id: number; name: string }[];
  credits?: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  videos?: {
    results: Video[];
  };
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  profile_path: string | null;
}

export interface Genre {
  id: number;
  name: string;
}

// Helper function to fetch data from the TMDB API with timeout
const fetchFromTMDB = async <T>(endpoint: string, params?: Record<string, string>, timeoutMs: number = 10000): Promise<T> => {
  if (!API_KEY) {
    throw new TMDBError(
      "TMDB API key is not configured. Please set VITE_TMDB_API_KEY in your .env file.",
      undefined,
      "MISSING_API_KEY"
    );
  }

  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    ...params,
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}?${queryParams}`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401) {
        throw new TMDBError(
          "Invalid API key. Please check your VITE_TMDB_API_KEY.",
          response.status,
          "INVALID_API_KEY"
        );
      }
      if (response.status === 429) {
        throw new TMDBError(
          "API rate limit exceeded. Please try again later.",
          response.status,
          "RATE_LIMIT_EXCEEDED"
        );
      }
      if (response.status === 404) {
        throw new TMDBError(
          "Resource not found.",
          response.status,
          "NOT_FOUND"
        );
      }
      if (response.status >= 500) {
        throw new TMDBError(
          "The movie database service is temporarily unavailable. Please try again later.",
          response.status,
          "SERVICE_UNAVAILABLE"
        );
      }
      throw new TMDBError(
        `TMDB API Error: ${response.status} - ${response.statusText}`,
        response.status,
        "API_ERROR"
      );
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof TMDBError) {
      throw error;
    }

    // Handle timeout
    if (error instanceof Error && error.name === "AbortError") {
      throw new TMDBError(
        "Request timeout. The server is taking too long to respond. Please check your internet connection.",
        undefined,
        "TIMEOUT_ERROR"
      );
    }

    // Handle network errors
    if (error instanceof TypeError) {
      if (error.message.includes("fetch") || error.message.includes("NetworkError")) {
        throw new TMDBError(
          "Network error. Please check your internet connection and try again.",
          undefined,
          "NETWORK_ERROR"
        );
      }
    }

    throw new TMDBError(
      error instanceof Error ? error.message : "Unknown error occurred",
      undefined,
      "UNKNOWN_ERROR"
    );
  }
};

// Utility function for handling API requests with retries
const fetchWithRetry = async (url: string, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
};

// Get image URL with specified size
export const getImageUrl = (path: string | null, size: string = "original"): string | null => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Get trending movies and TV shows
export const getTrending = async (mediaType: "all" | MediaType = "all", timeWindow: "day" | "week" = "week") => {
  return fetchFromTMDB<{ results: MediaItem[] }>(`/trending/${mediaType}/${timeWindow}`);
};

// Get popular movies
export const getPopularMovies = async () => {
  return fetchFromTMDB<{ results: MediaItem[] }>("/movie/popular");
};

// Get popular TV shows
export const getPopularTVShows = async () => {
  return fetchFromTMDB<{ results: MediaItem[] }>("/tv/popular");
};

// Get movie or TV show details
export const getMediaDetails = async (mediaType: MediaType, id: number) => {
  return fetchFromTMDB<DetailedMediaItem>(
    `/${mediaType}/${id}`, 
    { append_to_response: "videos,credits" }
  );
};

// Search movies and TV shows
export const searchMedia = async (query: string, page: number = 1) => {
  return fetchFromTMDB<{ results: MediaItem[]; total_results: number; total_pages: number }>(
    "/search/multi", 
    { query, page: page.toString() }
  );
};

// Get movie recommendations
export const getRecommendations = async (mediaType: MediaType, id: number) => {
  return fetchFromTMDB<{ results: MediaItem[] }>(`/${mediaType}/${id}/recommendations`);
};

// Get genres
export const getGenres = async (type: MediaType) => {
  if (!API_KEY) {
    throw new TMDBError(
      "TMDB API key is not configured. Please set VITE_TMDB_API_KEY in your .env file.",
      undefined,
      "MISSING_API_KEY"
    );
  }
  
  try {
    const url = `${BASE_URL}/genre/${type}/list?api_key=${API_KEY}&language=en-US`;
    return await fetchWithRetry(url);
  } catch (error) {
    console.error(`Error fetching ${type} genres:`, error);
    if (error instanceof TMDBError) {
      throw error;
    }
    throw new TMDBError(
      `Failed to fetch ${type} genres`,
      undefined,
      "GENRES_FETCH_ERROR"
    );
  }
};


// Get media by genre
export const getMediaByGenre = async (mediaType: MediaType, genreId: number, page: number = 1) => {
  return fetchFromTMDB<{ results: MediaItem[]; total_results: number; total_pages: number }>(
    `/discover/${mediaType}`, 
    { with_genres: genreId.toString(), page: page.toString() }
  );
};

// Get now playing movies
export const getNowPlayingMovies = async () => {
  return fetchFromTMDB<{ results: MediaItem[] }>("/movie/now_playing");
};

// Get top rated
export const getTopRated = async (mediaType: MediaType) => {
  return fetchFromTMDB<{ results: MediaItem[] }>(`/${mediaType}/top_rated`);
};

// Get upcoming movies
export const getUpcomingMovies = async () => {
  return fetchFromTMDB<{ results: MediaItem[] }>("/movie/upcoming");
};

// Get on the air TV shows
export const getOnTheAirTVShows = async () => {
  return fetchFromTMDB<{ results: MediaItem[] }>("/tv/on_the_air");
};

// Get TV show details with seasons
export const getTVShowDetails = async (id: number) => {
  return fetchFromTMDB<{ seasons: Array<{ id: number; season_number: number; name: string; episode_count: number }> }>(`/tv/${id}`);
};

// Get season details with episodes
export const getSeasonDetails = async (tvShowId: number, seasonNumber: number) => {
  return fetchFromTMDB<{ episodes: Array<{
    id: number;
    episode_number: number;
    name: string;
    overview: string;
    still_path: string | null;
    air_date: string;
    runtime?: number;
  }> }>(`/tv/${tvShowId}/season/${seasonNumber}`);
};

// Person/Cast Member interfaces
export interface Person {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
}

export interface PersonCredits {
  cast: Array<{
    id: number;
    title?: string;
    name?: string;
    character: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date?: string;
    first_air_date?: string;
    vote_average: number;
    media_type: "movie" | "tv";
  }>;
  crew: Array<{
    id: number;
    title?: string;
    name?: string;
    job: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date?: string;
    first_air_date?: string;
    vote_average: number;
    media_type: "movie" | "tv";
  }>;
}

// Get person details
export const getPersonDetails = async (personId: number) => {
  return fetchFromTMDB<Person>(`/person/${personId}`);
};

// Get person movie and TV credits
export const getPersonCredits = async (personId: number) => {
  return fetchFromTMDB<PersonCredits>(`/person/${personId}/combined_credits`);
};
