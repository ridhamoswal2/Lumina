import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPersonDetails, getPersonCredits, Person, PersonCredits, getImageUrl, MediaItem } from "@/services/tmdb";
import { handleError } from "@/utils/errorHandler";
import LazyImage from "@/components/ui/LazyImage";
import MediaRow from "@/components/media/MediaRow";
import { Skeleton } from "@/components/ui/skeleton";

const PersonPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [person, setPerson] = useState<Person | null>(null);
  const [credits, setCredits] = useState<PersonCredits | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const results = await Promise.allSettled([
          getPersonDetails(parseInt(id)),
          getPersonCredits(parseInt(id))
        ]);

        if (results[0].status === "fulfilled") {
          setPerson(results[0].value);
        } else {
          console.error("Failed to load person details:", results[0].reason);
          handleError(results[0].reason, "Failed to load person details");
        }

        if (results[1].status === "fulfilled") {
          setCredits(results[1].value);
        } else {
          console.error("Failed to load person credits:", results[1].reason);
          setCredits(null);
        }
      } catch (error) {
        handleError(error, "Failed to load person details");
      } finally {
        setLoading(false);
      }
    };

    fetchPersonData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading || !person) {
    return (
      <div className="min-h-screen pt-20 pb-16">
        <div className="container mx-auto px-4">
          <Skeleton className="h-12 w-32 mb-8 rounded" />
          <div className="flex flex-col md:flex-row gap-8">
            <Skeleton className="w-64 h-96 rounded-lg" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-10 w-3/4 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Combine and sort credits by popularity/release date
  const allCredits: MediaItem[] = [
    ...credits?.cast.map(item => ({
      id: item.id,
      title: item.title,
      name: item.name,
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
      overview: "",
      vote_average: item.vote_average,
      release_date: item.release_date,
      first_air_date: item.first_air_date,
      media_type: item.media_type,
      genre_ids: []
    })) || [],
    ...credits?.crew.map(item => ({
      id: item.id,
      title: item.title,
      name: item.name,
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
      overview: "",
      vote_average: item.vote_average,
      release_date: item.release_date,
      first_air_date: item.first_air_date,
      media_type: item.media_type,
      genre_ids: []
    })) || []
  ].filter((item, index, self) => 
    index === self.findIndex(t => t.id === item.id && t.media_type === item.media_type)
  ).sort((a, b) => {
    const dateA = a.release_date || a.first_air_date || "";
    const dateB = b.release_date || b.first_air_date || "";
    return dateB.localeCompare(dateA);
  });

  const movies = allCredits.filter(item => item.media_type === "movie");
  const tvShows = allCredits.filter(item => item.media_type === "tv");

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <Button 
          variant="ghost" 
          className="mb-6 rounded-full"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-64 h-96 rounded-lg overflow-hidden glass-morphism">
              {person.profile_path ? (
                <LazyImage
                  src={getImageUrl(person.profile_path, "w500")}
                  alt={person.name}
                  aspectRatio="2/3"
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No image</span>
                </div>
              )}
            </div>
          </div>

          {/* Person Info */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              {person.name}
            </h1>

            <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
              {person.birthday && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(person.birthday).toLocaleDateString()}</span>
                </div>
              )}
              {person.place_of_birth && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{person.place_of_birth}</span>
                </div>
              )}
            </div>

            {person.biography && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Biography</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {person.biography}
                </p>
              </div>
            )}

            <div className="glass-morphism rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Known For</h3>
              <p className="text-muted-foreground">{person.known_for_department}</p>
            </div>
          </div>
        </div>

        {/* Movies */}
        {movies.length > 0 && (
          <div className="mb-12">
            <MediaRow 
              title={`Movies (${movies.length})`}
              items={movies}
            />
          </div>
        )}

        {/* TV Shows */}
        {tvShows.length > 0 && (
          <div className="mb-12">
            <MediaRow 
              title={`TV Shows (${tvShows.length})`}
              items={tvShows}
            />
          </div>
        )}

        {allCredits.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No credits available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonPage;

