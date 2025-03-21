# Bextpense

Bextpense is a comprehensive full-stack expense tracking application designed to empower users with clear insights into their recurring revenue, expenses, and savings. Leveraging modern technologies, Bextpense uses a Next.js frontend for a dynamic, responsive UI and a robust .NET Core backend that ensures scalability, maintainability, and high performance. The application is built following industry best practices and proven design patterns, with a focus on secure, efficient, and modular code.

---

## Table of Contents

1. [Introduction & Key Features](#introduction--key-features)
2. [Architecture Overview](#architecture-overview)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
5. [Environment Configuration](#environment-configuration)
6. [Folder Structure](#folder-structure)
7. [Design Patterns & Principles](#design-patterns--principles)
8. [Best Practices](#best-practices)
9. [Testing & Quality Assurance](#testing--quality-assurance)
10. [Deployment & CI/CD](#deployment--cicd)
11. [Troubleshooting & FAQ](#troubleshooting--faq)
12. [Contributing Guidelines](#contributing-guidelines)
13. [License & Code of Conduct](#license--code-of-conduct)

---

## Introduction & Key Features

Bextpense is engineered to streamline personal and business finance management by offering a dashboard that visualizes recurring income, expenses, and savings trends. Key features include:

- **Comprehensive Dashboard:** Interactive charts and graphs that illustrate financial trends over time.
- **Data Export:** Generate PDF reports for offline analysis and record keeping.
- **Modular Architecture:** Clean separation between UI and business logic, ensuring ease of maintenance and future scalability.
- **Robust Security:** Implementation of best practices in security for both frontend and backend components.
- **High Performance:** Optimized for speed with server-side caching and asynchronous data handling.

---

## Architecture Overview

Bextpense is built on a layered architecture that separates concerns into distinct modules, ensuring that each part of the application is independently scalable and maintainable.

### High-Level Architecture Diagram

```plaintext
               ┌─────────────────────────────┐
               │        Frontend (Next.js)   │
               │ ─────────────────────────── │
               │  - Pages & Layouts         │
               │  - Reusable Components     │
               │  - Global State (Context)  │
               └─────────────┬──────────────┘
                             │
                   API Fetchers & HTTP Calls
                             │
               ┌─────────────▼──────────────┐
               │       Backend (.NET Core)  │
               │ ─────────────────────────── │
               │  - API Controllers         │
               │  - Query Handlers (CQRS)   │
               │  - Dependency Injection    │
               │  - Business Logic          │
               └─────────────┬──────────────┘
                             │
               ┌─────────────▼──────────────┐
               │       Database (SQL Server)│
               │ ─────────────────────────── │
               │  - Entity Framework Core   │
               │  - Migrations & Seeders    │
               └─────────────────────────────┘
```

*This diagram illustrates how the frontend communicates with the backend via API fetchers, while the backend handles business logic and data persistence.*

---

## Tech Stack

- **Frontend:**  
  - Framework: [Next.js](https://nextjs.org)
  - Language: JavaScript/TypeScript
  - Styling: CSS Modules, Tailwind CSS, or Styled Components (based on your preference)
  - State Management: React Context API

- **Backend:**  
  - Framework: [.NET Core](https://dotnet.microsoft.com/en-us/apps/aspnet)
  - Language: C#
  - Data Access: Entity Framework Core (EF Core)
  - Architecture: CQRS, Repository Pattern, and Dependency Injection

- **Database:**  
  - SQL Server (configured for development, with options for cloud-based production databases)

- **Testing & Deployment:**  
  - Frontend: Jest, React Testing Library
  - Backend: xUnit, Moq
  - Deployment: Vercel (Frontend), Azure/AWS (Backend)

---

## Getting Started

To begin working with Bextpense, follow these steps to set up your development environment.

### Prerequisites

Ensure your system includes the following:

- **Node.js** (v18+)
- **Package Manager:** npm, yarn, pnpm, or bun
- **.NET SDK** (v6.0+)
- **SQL Server** (or a compatible database engine)
- **Git** (for version control)

### Cloning the Repository

Clone the repository and navigate to the project root:

```bash
git clone https://github.com/KingXP-Pythoner/Bextpense.git
cd Bextpense
```

---

## Environment Configuration

Both the frontend and backend require environment-specific configuration files.

### Frontend Configuration (`/workspaces/bextpense/next/.env`)

```env
NEXT_PUBLIC_DEV_MODE_FRONTEND_URL=http://localhost:3000
NEXT_CORE_API_URL=http://localhost:5190
```

### Backend Configuration (`/workspaces/bextpense/netcore/Bextpense/Bextpense/appsettings.Development.json`)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=Bextpense;User Id=sa;Password=your_password;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  },
}
```
```env
[.env should be in project root]
CONNECTION_STRING=<connection string>
CORS_ORIGIN=<http://localhost:3000 for example (this should point to the frontend)>
```

---

## Folder Structure

The repository is divided into two primary sections: **Frontend** and **Backend**. Each follows a modular structure to promote code reuse and maintainability.

### Frontend (`/workspaces/bextpense/next`)

- **`app/`**  
  Contains Next.js pages and layouts.
  - **`(dashboard)/`**: Dashboard pages, analytics views, and charts.
  - **`(marketing)/`**: Public landing pages and promotional content.

- **`components/`**  
  Reusable UI elements like buttons, forms, modals, icons, and charts.

- **`context/`**  
  Global state management for sharing state (e.g., selected time ranges, user sessions).

- **`fetchers/`**  
  Centralized API service files that handle HTTP requests and error management.

- **`lib/`**  
  Utility functions, custom hooks, and shared logic across the application.

- **`features/`**  
  Feature-specific modules that encapsulate UI components and related business logic.

### Backend (`/workspaces/bextpense/netcore/Bextpense/Bextpense`)

- **`Infrastructure/`**  
  Database context, migration files, and seeding scripts.
  - **`Data/`**: EF Core `AppDbContext`, repository implementations, and data seeders.

- **`Queries/`**  
  Command and Query Handlers for implementing the CQRS pattern.
  - **`Home/`**: Handlers for retrieving dashboard data and financial summaries.
  - **`Controllers/`**: API controllers to expose endpoints and process HTTP requests.

- **`Common/`**  
  Shared models, Data Transfer Objects (DTOs), and helper utilities.

---

## Design Patterns & Principles

### Frontend

- **Component-Based Architecture:**  
  Emphasizes modular and reusable UI components. Each component is designed to be self-contained and easily testable.

- **Context API for State Management:**  
  Uses React’s Context API to manage global state, reducing prop drilling and ensuring a consistent state across the app.

- **API Fetchers:**  
  Encapsulate API logic in dedicated modules to handle error responses, retries, and caching with tools like `unstable_cache` for performance improvements.

### Backend

- **CQRS (Command Query Responsibility Segregation):**  
  Separates read (queries) and write (commands) operations. For example, `GetTransactionOverviewHandler` processes queries while commands are handled separately, ensuring clear separation of concerns.

- **Dependency Injection:**  
  Promotes modularity and testability. Services (e.g., `ITransactionAnalysisService`) are injected into controllers, enabling easier mocking during testing.

- **Repository Pattern:**  
  Abstracts data access logic, making it easier to manage database interactions through a consistent API.

- **Security & Validation:**  
  Implements strong validation patterns, error handling middleware, and secure API endpoints to protect against common vulnerabilities.

---

## Best Practices

### Frontend

- **Server-only Imports:**  
  Use `server-only` imports to ensure that sensitive logic runs only on the server.

- **Caching Strategies:**  
  Implement `unstable_cache` for caching API responses to boost performance and reduce unnecessary network calls.

- **Modular Component Structure:**  
  Organize components by feature, ensuring that related logic stays grouped together, improving maintainability.

### Backend

- **Async/Await for I/O Operations:**  
  Utilize asynchronous programming for database calls to ensure non-blocking operations.

- **Structured Logging:**  
  Leverage `ILogger` for comprehensive error tracking and debugging across all layers of the application.

- **Input Validation:**  
  Validate all external inputs and JSON payloads rigorously to ensure data integrity and security.




## Deployment & CI/CD

### Frontend Deployment

- **Vercel Deployment:**  
  Deploy directly to Vercel for optimized Next.js hosting. Follow the [Next.js deployment guide](https://nextjs.org/docs/app/building-your-application/deploying) for additional configuration.
  
- **Environment Variables:**  
  Configure production environment variables securely via Vercel’s dashboard.

### Backend Deployment

- **Cloud Providers:**  
  Deploy to Azure, AWS, or another cloud provider. Ensure that the production database connection string and security settings are updated accordingly.
  
- **CI/CD Integration:**  
  Use GitHub Actions, Azure DevOps, or similar tools to automate building, testing, and deploying both frontend and backend services.
  
- **Containerization:**  
  Consider using Docker to containerize the backend for easier deployment and scaling.

---

## Troubleshooting & FAQ

### Common Issues

- **Database Connection Errors:**  
  Double-check your connection strings in the configuration files. Ensure that SQL Server is running and accessible.

- **API Fetch Failures:**  
  Validate that the API URL in `NEXT_CORE_API_URL` is correct and that CORS policies are properly configured on the backend.

- **Performance Bottlenecks:**  
  Use logging and performance monitoring (e.g., Application Insights) to identify slow queries or rendering issues.

### FAQ

- **How do I add a new feature?**  
  Follow the modular structure in the `features/` (frontend) or create a new query/command handler (backend). Ensure you update tests accordingly.

- **Who do I contact for support?**  
  Refer to the `CONTRIBUTING.md` guidelines for contacting maintainers or opening an issue in the repository.

---


## License & Code of Conduct

Bextpense is distributed under the [MIT License](LICENSE). By contributing, you agree to follow our Code of Conduct, ensuring a respectful and collaborative community environment.
