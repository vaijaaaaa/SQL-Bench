# SQLBench

SQLBench is a comprehensive platform designed for developers to practice and master SQL through real-world problems. It provides an interactive environment to write, execute, and test SQL queries against isolated database instances.

## System architecture
<img width="1220" height="672" alt="sqlbenchSA" src="https://github.com/user-attachments/assets/b1a9b2d7-e747-4057-9baa-1a6dbdb512bd" />
(https://img.youtube.com/vi/1xHADtekTNg/0.jpg)](https://youtu.be/1xHADtekTNg)


## Features

- **Interactive SQL Compiler**: Write and execute SQL queries directly in the browser with real-time feedback.
- **Problem Library**: A curated collection of SQL problems ranging from basic SELECT statements to complex recursive CTEs.
- **Real-time Execution**: Queries are executed against a real PostgreSQL database environment.
- **Progress Tracking**: Track your solved problems and view your progress on the dashboard.
- **Authentication**: Secure user accounts using Email/Password or Google authentication.
- **Leaderboard**: Compete with other users and see where you stand.
- **Dark Mode**: Fully supported dark mode interface.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Queue Management**: Bull / Redis

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- Redis (for the submission queue)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sqlbench.git
   cd sqlbench
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/sqlbench"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   REDIS_URL="redis://localhost:6379"
   ```

4. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Seed the database (optional):
   ```bash
   npm run prisma:seed
   ```

6. Run the development server:
   ```bash
   npm run dev
   ```

   Open http://localhost:3000 with your browser to see the application.

## Project Structure

- `app/`: Next.js App Router pages and API routes.
  - `api/`: Backend API endpoints.
  - `compiler/`: The main problem-solving interface.
  - `dashboard/`: User dashboard and progress.
- `components/`: Reusable UI components.
- `lib/`: Utility functions, database clients, and core logic.
- `prisma/`: Database schema and seed scripts.
- `public/`: Static assets.

## Contributing

Contributions are welcome. Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
