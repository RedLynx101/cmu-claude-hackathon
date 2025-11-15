# CollabCMU

## Overview

CollabCMU is an AI-powered platform designed to reduce siloing between student organizations at Carnegie Mellon University by automatically discovering cross-club collaboration opportunities. The application allows student clubs to input their information (goals, offerings, needs, and categories), and uses Claude AI to analyze compatibility between organizations, generate collaboration ideas, create partnership proposals, and draft outreach messages.

The platform addresses the problem of missed collaboration opportunities by providing a centralized discovery mechanism that helps clubs find complementary partners, avoid reinventing the wheel, and reduce event overlap while strengthening overall community engagement.

**Project Status:** Published live for public use. A comprehensive README.md is available for the public GitHub repository, explaining the hackathon context, setup instructions, and usage guide.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React with TypeScript for type safety and modern component development
- Vite as the build tool for fast development and optimized production builds
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and caching
- React Hook Form with Zod for form validation and type-safe form handling

**UI Component System:**
- Shadcn/ui components built on Radix UI primitives for accessible, customizable components
- Tailwind CSS for utility-first styling with custom design tokens
- Design system inspired by Linear and Notion, adapted for academic collaboration context
- Custom CSS variables for theming (light/dark mode support)
- Typography: Inter for body text, Poppins for headings
- Consistent spacing system using Tailwind units (2, 4, 6, 8, 12, 16)

**Layout Strategy:**
- Sidebar navigation pattern with collapsible mobile support
- Responsive grid layouts (1/2/3 columns based on screen size)
- Card-based information architecture for club profiles and match results
- Maximum container width of 7xl for optimal reading and scanning

**Key Pages:**
- Dashboard: Overview with statistics and featured clubs
- All Clubs: Browsable directory with search and category filtering
- Club Detail: Comprehensive club information display
- Club Form: Create/edit club profiles with array-based input fields
- Matches: AI-powered match discovery with accordion-style results

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript for the HTTP server
- ESM module system for modern JavaScript features
- Custom middleware for request logging and JSON body parsing

**Data Layer:**
- Drizzle ORM for type-safe database interactions
- PostgreSQL via Neon serverless driver for cloud database connectivity
- In-memory storage implementation (MemStorage) with seed data for development/testing
- Abstract IStorage interface allowing easy swapping between storage backends

**Database Schema:**
- Single `clubs` table with structured data:
  - UUID primary keys (generated via PostgreSQL)
  - Text fields for name and description
  - Array fields for goals, offerings, needs, and categories
  - Icon field for visual identification
- Schema defined in shared directory for type sharing between client and server

**API Design:**
- RESTful endpoints following conventional HTTP methods:
  - GET /api/clubs - List all clubs
  - GET /api/clubs/:id - Get single club
  - POST /api/clubs - Create new club
  - PUT /api/clubs/:id - Update club
  - DELETE /api/clubs/:id - Delete club
  - POST /api/matches - Find AI-powered matches
- Zod validation for request data with detailed error responses
- JSON responses with appropriate HTTP status codes

**Code Organization:**
- Separation of concerns: routes, storage, AI logic in separate modules
- Shared schema definitions between client and server via `/shared` directory
- Type safety end-to-end using TypeScript and Zod schemas

### AI Integration

**Provider:**
- Anthropic Claude API via Replit's AI Integrations service
- Environment-based configuration for API key and base URL
- Uses streaming-capable SDK but currently implements synchronous responses

**Match Generation Logic:**
- Analyzes source club against all other clubs in the database
- Considers complementary strengths, aligned goals, and mutual benefits
- Returns structured JSON with:
  - Match score (0-100)
  - Reasoning for the match
  - 3-5 specific collaboration ideas
  - Professional partnership proposal
  - Ready-to-send outreach email message
- Top 3 matches selected and returned

**Prompt Engineering:**
- Detailed context about source club (description, goals, offerings, needs)
- Structured list of available clubs to match against
- Specific output format requirements for consistent parsing
- Role-based prompt (AI collaboration advisor for CMU)

## External Dependencies

### Third-Party Services

**AI Services:**
- Anthropic Claude API (via Replit AI Integrations)
  - Purpose: Generate intelligent club matches, collaboration ideas, and outreach content
  - Configuration: Environment variables for API key and base URL
  - Integration pattern: Server-side API calls with structured prompts

**Database:**
- Neon PostgreSQL (serverless)
  - Purpose: Persistent storage for club data
  - Connection: Via @neondatabase/serverless driver
  - Configuration: DATABASE_URL environment variable
  - ORM: Drizzle for type-safe queries and migrations

**Development Tools:**
- Replit-specific plugins for development experience:
  - vite-plugin-runtime-error-modal for error overlay
  - vite-plugin-cartographer for code mapping
  - vite-plugin-dev-banner for development indicators

### Key NPM Packages

**Frontend Core:**
- react & react-dom: UI framework
- @tanstack/react-query: Server state management
- wouter: Routing
- react-hook-form: Form management
- zod & @hookform/resolvers: Validation

**UI Components:**
- @radix-ui/*: Accessible component primitives (25+ components)
- class-variance-authority & clsx: Styling utilities
- tailwind-merge: Tailwind class merging
- lucide-react: Icon library
- cmdk: Command palette component

**Backend Core:**
- express: HTTP server
- drizzle-orm & drizzle-zod: Database ORM and validation
- @anthropic-ai/sdk: Claude AI integration

**Build Tools:**
- vite: Frontend build tool
- tsx: TypeScript execution for development
- esbuild: Production bundling
- typescript: Type checking

**Session Management:**
- connect-pg-simple: PostgreSQL session store (imported but not actively used in current implementation)

### Font Resources

- Google Fonts: Inter and Poppins families loaded via CDN for consistent typography