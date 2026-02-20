import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MediaProvider } from "./contexts/MediaContext";
import { Suspense, useState, useEffect } from "react";
import LoadingScreen from "./components/ui/loading";
import ErrorBoundary from "./components/ErrorBoundary";
import NetworkErrorRecovery from "./components/NetworkErrorRecovery";
import Navbar from "./components/layout/Navbar";
import HomePage from "./pages/HomePage";
import MoviesPage from "./pages/MoviesPage";
import TVShowsPage from "./pages/TVShowsPage";
import MediaDetailsPage from "./pages/MediaDetailsPage";
import PersonPage from "./pages/PersonPage";
import WatchlistPage from "./pages/WatchlistPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import NotFound from "./pages/NotFound";
import { useIsMobile } from "./hooks/use-mobile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3, // Increased retry attempts
      staleTime: 300000, // 5 minutes
      gcTime: 600000, // 10 minutes (formerly cacheTime)
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      // Better error handling
      throwOnError: false,
      networkMode: "always",
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
          <Route path="/person/:id" element={<PersonPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

const AppWithErrorRecovery = () => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    // Clear all queries and refetch
    queryClient.clear();
    // Force a page reload to reset all state
    window.location.reload();
  };

  return (
    <ErrorBoundary fallback={<NetworkErrorRecovery onRetry={handleRetry} isRetrying={isRetrying} />}>
      <Suspense fallback={<LoadingScreen />}>
        <AppContent />
      </Suspense>
    </ErrorBoundary>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MediaProvider>
          <ErrorBoundary>
            <AppWithErrorRecovery />
          </ErrorBoundary>
          <Sonner />
          <Toaster />
        </MediaProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
