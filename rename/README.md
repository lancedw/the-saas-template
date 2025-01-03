# Backend service for TimeFusion

This the backend repo for the TimeFusion. It is a Node.js application that uses Prisma ORM to interact with a PostgreSQL database.

## Getting Started

### Prerequisites

- Node.js 18.x
- Docker

### Installation

1. Clone the repository
2. Install dependencies
3. Create a .env file in the root directory copied from .env.example. Set the correct SLASH env variable for your operating system.
4. Spin up the database and server
   ```
   npm run dup
   ```
   [MacOS] if the server container fails to start due to permissions, run the following command:
   ```
   chmod +x ./start.sh
   ```
5. Seed the database with some data
   ```
   npm install -g dotenv-cli
   npm run prisma:seed
   ```
6. Start writing code!

## Deployment

### Docker

1. Build the docker image
   ```bash
   npm run docker:build
   ```
2. Run the docker compose
   ```bash
   npm run docker:compose
   ```

### AWS

TBD (WIP)
