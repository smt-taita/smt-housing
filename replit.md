# Overview

This is a fundraising website for St Matt's Kāinga, a church-led affordable housing project in Taitā, New Zealand. The site aims to raise $24,000 annually to maintain rent subsidies for 8 homes housing families, former refugees, and people transitioning from temporary housing. The project is part of the Anglican Diocese's Bedrock Housing initiative, with early subsidies ending in 2026, creating urgency for ongoing fundraising.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent UI components
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management with 30-second refresh intervals for campaign data
- **Form Handling**: React Hook Form with Zod schema validation for type-safe form processing
- **UI Components**: Radix UI primitives with custom styling through shadcn/ui

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints for campaign data, donations, and admin functionality
- **Data Storage**: In-memory storage with MemStorage class implementing IStorage interface (designed for easy database migration)
- **Development Setup**: Vite dev server with hot module replacement and middleware integration

## Data Layer
- **Database Schema**: Drizzle ORM with PostgreSQL dialect configuration
- **Schema Definition**: Two main tables - donations and campaignData with proper relationships
- **Validation**: Zod schemas for runtime type checking and validation
- **Migration Support**: Drizzle Kit configured for schema migrations in `/migrations` directory

## Key Features
- **Real-time Progress Tracking**: Campaign summary with donation progress, percentage completion, and donor counts
- **Donation Processing**: Support for monthly, annual, and one-time donations with offline donation admin interface
- **Analytics Integration**: Google Analytics 4 with page view and event tracking
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints
- **Form Validation**: Client and server-side validation using Zod schemas
- **Admin Dashboard**: Interface for adding offline donations and managing campaign data

## Authentication & Authorization
- Currently uses simple admin access without formal authentication
- Admin functionality accessed through hidden interface triggers
- Session management placeholder with connect-pg-simple for future implementation

## Performance Optimizations
- **Caching**: TanStack Query with stale-time configuration and automatic refetching
- **Code Splitting**: Vite's automatic code splitting for optimal bundle sizes
- **Asset Optimization**: Tailwind CSS purging and Vite's built-in optimizations
- **Progressive Enhancement**: Core functionality works without JavaScript

# External Dependencies

## Database & Storage
- **Neon Database**: PostgreSQL-compatible serverless database (@neondatabase/serverless)
- **Drizzle ORM**: Type-safe database operations with schema management
- **Session Store**: connect-pg-simple for PostgreSQL session storage (configured but not actively used)

## UI & Styling
- **Tailwind CSS**: Utility-first CSS framework with custom color variables for church branding
- **Radix UI**: Unstyled, accessible UI primitives for complex components
- **shadcn/ui**: Pre-built component system combining Radix UI with Tailwind styling
- **Lucide Icons**: Icon system with tree-shaking support
- **Font Awesome**: Additional icons for specific use cases

## Analytics & Tracking
- **Google Analytics 4**: Web analytics with custom event tracking via gtag
- **Environment Variables**: VITE_GA_MEASUREMENT_ID for analytics configuration

## Development Tools
- **Replit Integration**: Development banner and runtime error overlay for Replit environment
- **Vite Plugins**: React plugin, runtime error modal, and Replit-specific tooling
- **ESBuild**: Fast bundling for production server builds

## Form & Validation
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: Runtime type validation and schema definition
- **@hookform/resolvers**: Integration between React Hook Form and Zod

## Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx & tailwind-merge**: Conditional CSS class management
- **class-variance-authority**: Type-safe component variant system
- **nanoid**: Secure URL-friendly unique ID generation