# Vehicle Service Ecosystem - Backend

A clean, well-architected backend foundation built with Node.js, Express, TypeScript, and Prisma.

## Architecture Principles

- **SOLID Principles**: Following Single Responsibility, Open/Closed, and Dependency Inversion
- **Repository Pattern**: Services handle business logic; Repositories handle database operations
- **Type Separation**: All types defined in dedicated `/src/types` directory
- **File Size Constraint**: No file exceeds 100 lines
- **Documentation**: JSDoc comments for all functions and classes

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Language**: TypeScript (strict mode)
- **ORM**: Prisma
- **Database**: PostgreSQL

## Project Structure

```
server/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── common/
│   │   └── prisma.service.ts  # Singleton Prisma client
│   ├── types/
│   │   ├── user.types.ts      # User-related types
│   │   └── auth.types.ts      # Authentication types
│   ├── app.ts                 # Express app configuration
│   └── server.ts              # Server entry point
├── package.json
├── tsconfig.json
└── .env.example
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` and update `DATABASE_URL` with your PostgreSQL connection string.

3. Generate Prisma Client:
```bash
npm run prisma:generate
```

4. Run database migrations:
```bash
npm run prisma:migrate
```

### Development

Start the development server:
```bash
npm run dev
```

Server will start on `http://localhost:3000`

### Production

Build the project:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## API Endpoints

### Health Check
- `GET /health` - Server and database health status

## User Roles

- **OWNER**: Vehicle owners who can request services
- **PROVIDER**: Service providers who can offer services

## License

ISC
