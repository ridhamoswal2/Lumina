# Lumina
# Lumina - Movie & TV Show Streaming Platform

## Project Overview
Build a modern, responsive movie and TV show streaming platform called "Lumina" using React, TypeScript, Vite, and Tailwind CSS. The application should provide a Netflix-like experience with multiple streaming servers, watchlist functionality, and a beautiful glass-morphism UI design.

## Core Features & Pages

### 1. Home Page (`/`)
- **Featured Banner**: Hero section with rotating featured content from trending movies/TV shows
- **Content Rows**: Multiple horizontal scrolling sections:
  - Trending Today
  - Popular Movies
  - Popular TV Shows
  - Top Rated Movies
  - Now Playing Movies
- **Dynamic Content**: All content fetched from TMDB API
- **Responsive Design**: Mobile-first approach with optimized layouts

### 2. Movies Page (`/movies`)
- **Grid Layout**: Responsive movie grid with poster cards
- **Genre Filtering**: Dropdown filter to browse movies by genre
- **Popular Movies**: Default view shows popular movies
- **Genre-based Browsing**: Filter movies by specific genres using TMDB API

### 3. TV Shows Page (`/tv`)
- **Grid Layout**: Responsive TV show grid with poster cards
- **Genre Filtering**: Dropdown filter to browse TV shows by genre
- **Popular Shows**: Default view shows popular TV shows
- **Genre-based Browsing**: Filter shows by specific genres using TMDB API

### 4. Media Details Page (`/movie/:id` & `/tv/:id`)
- **Hero Section**: Large backdrop image with media information
- **Media Information**: Title, release date, runtime, rating, genres, overview
- **Cast & Crew**: Display main cast members with photos
- **Episode Selector** (TV Shows only): Season and episode selection with thumbnails
- **Server Selection**: Multiple streaming server options
- **Embedded Player**: Full-screen video player with server switching
- **Recommendations**: "You May Also Like" section
- **Watchlist Integration**: Add/remove from watchlist functionality

### 5. Watchlist Page (`/watchlist`)
- **Personal Collection**: User's saved movies and TV shows
- **Sorting Options**: Sort by date added, title, or rating
- **Filtering**: Filter by media type (all, movies, TV shows)
- **Local Storage**: Persistent watchlist using browser storage
- **Empty State**: Helpful message and navigation when watchlist is empty

### 6. Search Results Page (`/search`)
- **Search Functionality**: Search movies and TV shows by title
- **Filter Results**: Filter by media type (all, movies, TV shows)
- **Pagination**: Handle large result sets with pagination
- **Real-time Search**: Search as user types in the navigation bar

### 7. 404 Not Found Page
- **Error Handling**: Elegant 404 page with navigation back to home
- **Glass-morphism Design**: Consistent with overall design theme

## Technical Architecture

### API Integration
- **TMDB API**: The Movie Database API for all content
- **API Key**: `08c748f7d51cbcbf3189168114145568`
- **Endpoints Used**:
  - Trending content (`/trending/{media_type}/{time_window}`)
  - Popular movies (`/movie/popular`)
  - Popular TV shows (`/tv/popular`)
  - Media details (`/{media_type}/{id}`)
  - Search (`/search/multi`)
  - Genres (`/genre/{media_type}/list`)
  - Recommendations (`/{media_type}/{id}/recommendations`)
  - Season details (`/tv/{id}/season/{season_number}`)

### Streaming Servers
Implement multiple streaming server options with embedded players:

1. **Server 1**: `https://player.videasy.net/`
   - Movies: `https://player.videasy.net/movie/{id}`
   - TV Shows: `https://player.videasy.net/tv/{id}/{season}/{episode}?nextEpisode=true&episodeSelector=true`

2. **Server 2**: `https://vidsrc.xyz/embed/`
   - Movies: `https://vidsrc.xyz/embed/movie/{id}`
   - TV Shows: `https://vidsrc.xyz/embed/tv/{id}/{season}/{episode}`

3. **Server 3**: `https://vidfast.pro/`
   - Movies: `https://vidfast.pro/movie/{id}?autoPlay=true`
   - TV Shows: `https://vidfast.pro/tv/{id}/{season}/{episode}?autoPlay=true`

4. **Server 4**: `https://anyembed.xyz/`
   - Movies: `https://anyembed.xyz/movie/{id}?server=3`
   - TV Shows: `https://anyembed.xyz/tv/{id}/{season}/{episode}?server=4`

5. **Server 5**: Mixed servers
   - Movies: `https://www.2embed.stream/embed/movie/{id}`
   - TV Shows: `https://vidsrc.me/embed/tv/{id}/{season}/{episode}?server=4`

### State Management
- **React Context**: Global state management for watchlist and genres
- **TanStack Query**: API state management with caching and error handling
- **Local Storage**: Persistent watchlist storage with key `lumina_watchlist`

### UI Components & Design

#### Design System
- **Theme**: Dark theme with glass-morphism effects
- **Colors**: Custom HSL color palette with primary focus on whites and grays
- **Typography**: Inter font family with feature settings
- **Animations**: Custom Tailwind animations for smooth interactions

#### Key UI Components
- **MediaCard**: Reusable card component for movies/TV shows
- **MediaGrid**: Responsive grid layout for content
- **MediaRow**: Horizontal scrolling row for content sections
- **FeaturedBanner**: Hero banner component
- **ServerSelector**: Modal for choosing streaming servers
- **EpisodeSelector**: TV show episode selection interface
- **GenreFilter**: Dropdown for genre-based filtering
- **SearchBar**: Global search functionality
- **Navbar**: Responsive navigation with mobile bottom navigation

#### Glass-Morphism Effects
- **Backdrop Blur**: `backdrop-blur-xl bg-white/5 border border-white/10`
- **Shadow Effects**: Custom shadow utilities
- **Hover Animations**: Scale and translate effects on interaction

### Responsive Design
- **Mobile-First**: Optimized for mobile devices with touch interactions
- **Breakpoints**: Tailwind's responsive breakpoint system
- **Navigation**: Desktop top navigation, mobile bottom navigation
- **Touch Gestures**: Swipe-friendly horizontal scrolling
- **Safe Areas**: iOS safe area handling for modern devices

### Performance Optimizations
- **Code Splitting**: Manual chunks for React and UI vendors
- **Image Optimization**: TMDB image URLs with appropriate sizes
- **Lazy Loading**: Suspense boundaries for route-based code splitting
- **Caching**: TanStack Query for API response caching
- **Error Boundaries**: Graceful error handling throughout the app

## Development Setup

### Dependencies
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.6.2",
    "@tanstack/react-query": "^5.80.7",
    "zod": "^3.25.63",
    "react-hook-form": "@7.57.0",
    "@hookform/resolvers": "^5.1.1",
    "lucide-react": "^0.514.0",
    "sonner": "^2.0.5",
    "date-fns": "^4.1.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.2",
    "next-themes": "^0.4.6"
  }
}
```

### Radix UI Components
Full shadcn/ui component library integration with all Radix UI primitives for:
- Dialogs, Dropdowns, Tooltips
- Form components (Select, Input, Button, etc.)
- Navigation components
- Toast notifications
- Accordion, Tabs, Progress bars
- And 30+ other UI components

### Build Configuration
- **Vite**: Fast build tool with React SWC plugin
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework with custom animations
- **ESLint**: Code linting with React-specific rules
- **Path Aliases**: `@/` alias for clean imports

### File Structure
```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── layout/       # Navigation, filters
│   ├── media/        # Media-specific components
│   └── search/       # Search functionality
├── contexts/         # React Context providers
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── pages/           # Route components
├── services/        # API services (TMDB, watchlist)
└── styles/          # Global CSS
```

## Key Features Implementation

### Watchlist System
- **Add/Remove**: Toggle movies and TV shows in personal watchlist
- **Persistence**: Local storage with JSON serialization
- **Context Integration**: Global state management
- **Toast Notifications**: User feedback for watchlist actions
- **Sorting & Filtering**: Multiple organization options

### Episode Management (TV Shows)
- **Season Selection**: Dropdown for season navigation
- **Episode Grid**: Visual episode selection with thumbnails
- **Episode Details**: Air dates, descriptions, runtime information
- **Auto-navigation**: Smooth scrolling to episode section

### Video Player Integration
- **Server Selection**: Modal with multiple server options
- **Full-screen Player**: Embedded iframe players
- **Auto-play**: Configurable auto-play functionality
- **Episode Navigation**: Next episode functionality for TV shows
- **Responsive Player**: Mobile-optimized video experience

### Search & Discovery
- **Global Search**: Search bar in navigation
- **Multi-media Search**: Combined movie and TV show results
- **Genre Filtering**: Browse content by genre categories
- **Trending Content**: Daily and weekly trending sections
- **Recommendations**: Related content suggestions

## Deployment & Production
- **Vercel Configuration**: Optimized for Vercel deployment
- **Environment Variables**: Secure API key management
- **Build Optimization**: Code splitting and asset optimization
- **SEO Optimization**: Meta tags and structured data
- **Error Monitoring**: Production error tracking

## Additional Requirements
- **Accessibility**: WCAG compliant components
- **Performance**: Lighthouse score optimization
- **Cross-browser**: Support for modern browsers
- **PWA Ready**: Service worker and manifest configuration
- **Analytics**: User interaction tracking setup

This project creates a professional-grade streaming platform with modern web technologies, providing users with a seamless movie and TV show discovery and viewing experience.
