# PredictaLab Backend

This is the backend for the PredictaLab application. It is built with Node.js, Express, and Prisma.

## Project Structure

Refer to the directory structure for an overview of the project organization.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up your environment variables in a `.env` file:
   ```
   DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
   PORT=3000
   ```
3. Run Prisma migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Start the development server:
   ```bash
   node src/server.js
   ```
