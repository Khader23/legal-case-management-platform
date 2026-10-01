# Legal Case Management Platform

A full-stack web application for managing legal cases and client-related case information.

The project demonstrates end-to-end software development using a Vue frontend, TypeScript/Express REST API, and PostgreSQL relational database.

## Features

- Create new legal cases through the web interface
- View all active cases
- View individual case details
- Edit case information including title, description, category, priority and status
- Archive cases using a soft-archive system that preserves database records
- Persistent PostgreSQL data storage
- Client-to-case relational database structure using foreign keys
- Server-side request validation
- RESTful API integration between the Vue frontend and Express backend

## Tech Stack

### Frontend

- Vue 3
- TypeScript
- Vue Router
- Vite

### Backend

- Node.js
- Express
- TypeScript

### Database

- PostgreSQL

### Development Tools

- Git
- GitHub
- VS Code

## Architecture

The application follows a three-layer full-stack architecture:

```text
Vue 3 Frontend
       |
       | HTTP / REST API
       v
Node.js + Express + TypeScript
       |
       | SQL Queries
       v
PostgreSQL Database
```

The Vue frontend communicates with the Express backend through REST API requests. The backend performs validation and database operations against PostgreSQL.

## Core Case Workflow

The current application supports the following workflow:

```text
Create Case → View Case → Edit Case → Archive Case
```

Archived cases are retained in PostgreSQL using an `archived_at` timestamp rather than being permanently deleted.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cases` | Retrieve active cases |
| GET | `/cases/:id` | Retrieve a specific case |
| POST | `/cases` | Create a new case |
| PATCH | `/cases/:id` | Update an existing case |
| DELETE | `/cases/:id` | Soft-archive a case |

## Database Design

The PostgreSQL database currently contains `clients` and `cases` tables.

Each case references a client through a foreign-key relationship:

```text
Client (1) → (Many) Cases
```

Case records contain:

- Case ID
- Client ID
- Title
- Description
- Category
- Priority
- Status
- Creation timestamp
- Archive timestamp

## Running Locally

### Backend

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file with your PostgreSQL configuration:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=legal_case_management
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
```

Compile the TypeScript backend:

```bash
npx tsc -p ./tsconfig.json
```

Start the backend:

```bash
node ./dist/server.js
```

The backend runs locally on port `3000`.

### Frontend

From the project root, navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend runs locally on port `5173` by default.

## Current Project Status

This project is an actively developed MVP. The core case-management workflow is functional and connected to persistent PostgreSQL storage.

## Planned Improvements

Future development will focus on:

- Authentication and authorization
- Expanded client management functionality
- Case search and filtering
- Archived case viewing and restoration
- Improved frontend validation and user-facing error handling
- Automated testing
- UI/UX refinement
- Production deployment and configuration

## Author

**Sufiya Khader**

Bachelor of Cyber Security / Bachelor of Criminology  
Deakin University