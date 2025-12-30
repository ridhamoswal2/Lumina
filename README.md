# Lumina
# Lumina - Movie & TV Show Streaming Platform

## Project Overview
Build a modern, responsive movie and TV show streaming platform called "Lumina" using React, TypeScript, Vite, and Tailwind CSS. The application should provide a Netflix-like experience with multiple streaming servers, watchlist functionality, and a beautiful glass-morphism UI design.

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- TMDB API key ([Get one here](https://www.themoviedb.org/settings/api))

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Lumina
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory
```bash
cp .env.example .env
```

4. Add your TMDB API key to `.env`
```
VITE_TMDB_API_KEY=your_api_key_here
```

5. Start the development server
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests with Vitest
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report

## Environment Variables

Create a `.env` file in the root directory with the following:

```
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

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
- **API Key**: Configured via environment variable `VITE_TMDB_API_KEY`
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
- **LazyImage**: Optimized image component with lazy loading
- **Skeleton**: Loading skeleton components

#### Glass-Morphism Effects
- **Backdrop Blur**: `backdrop-blur-xl bg-white/5 border border-white/10`
- **Shadow Effects**: Custom shadow utilities
- **Hover Animations**: Scale and translate effects on interaction

### Error Handling
- **Error Boundaries**: React error boundaries for graceful error handling
- **Error Handler Utility**: Centralized error handling with toast notifications
- **TMDB Error Types**: Custom error classes for API errors
- **Network Error Handling**: Proper handling of network failures

### Performance Optimizations
- **Code Splitting**: Manual chunks for React and UI vendors
- **Image Optimization**: Lazy loading with Intersection Observer
- **Lazy Loading**: Suspense boundaries for route-based code splitting
- **Caching**: TanStack Query for API response caching
- **Loading Skeletons**: Better UX during data fetching

### Testing
- **Vitest**: Fast unit testing framework
- **React Testing Library**: Component testing utilities
- **Test Coverage**: Coverage reports with Vitest coverage
- **Test Utilities**: Custom test utilities for component testing

### Responsive Design
- **Mobile-First**: Optimized for mobile devices with touch interactions
- **Breakpoints**: Tailwind's responsive breakpoint system
- **Navigation**: Desktop top navigation, mobile bottom navigation
- **Touch Gestures**: Swipe-friendly horizontal scrolling
- **Safe Areas**: iOS safe area handling for modern devices

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
  },
  "devDependencies": {
    "@testing-library/react": "^16.0.1",
    "@testing-library/jest-dom": "^6.5.0",
    "@vitest/ui": "^2.1.8",
    "@vitest/coverage-v8": "^2.1.8",
    "vitest": "^2.1.8",
    "jsdom": "^25.0.1"
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
- **TypeScript**: Full type safety with strict mode enabled
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
├── styles/          # Global CSS
├── test/            # Test utilities and setup
└── utils/           # Error handling utilities
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
- **Environment Variables**: Secure API key management via `.env`
- **Build Optimization**: Code splitting and asset optimization
- **Error Monitoring**: Production error tracking with error boundaries
- **TypeScript Strict Mode**: Enhanced type safety

## Additional Requirements
- **Accessibility**: WCAG compliant components
- **Performance**: Lighthouse score optimization
- **Cross-browser**: Support for modern browsers
- **Error Boundaries**: Graceful error handling
- **Loading States**: Skeleton loaders for better UX
- **Image Optimization**: Lazy loading with Intersection Observer

This project creates a professional-grade streaming platform with modern web technologies, providing users with a seamless movie and TV show discovery and viewing experience.
