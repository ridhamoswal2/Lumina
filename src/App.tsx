import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MediaProvider } from "./contexts/MediaContext";
import { Suspense } from "react";
import LoadingScreen from "./components/ui/loading";
import Navbar from "./components/layout/Navbar";
import HomePage from "./pages/HomePage";
import MoviesPage from "./pages/MoviesPage";
import TVShowsPage from "./pages/TVShowsPage";
import MediaDetailsPage from "./pages/MediaDetailsPage";
import WatchlistPage from "./pages/WatchlistPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import NotFound from "./pages/NotFound";
import { useIsMobile } from "./hooks/use-mobile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 300000, // 5 minutes
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});

const AppContent = () => {
  const isMobile = useIsMobile();
  
  return (
    <BrowserRouter>
      <Navbar />
      <main className={`min-h-screen ${isMobile ? "pt-16 pb-20" : ""}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/tv" element={<TVShowsPage />} />
          <Route path="/movie/:id" element={<MediaDetailsPage />} />
          <Route path="/tv/:id" element={<MediaDetailsPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MediaProvider>
        <Suspense fallback={<LoadingScreen />}>
          <AppContent />
        </Suspense>
        <Sonner />
        <Toaster />
      </MediaProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
