# Menstrual Management System

A full-stack web application for menstrual health management, appointment booking, STI test tracking, and health education. Built with Spring Boot (Java) for the backend and React (TypeScript) with Tailwind CSS for the frontend.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Additional Frontend Scripts](#additional-frontend-scripts)
- [Running the Application](#running-the-application)
- [Backend Details](#backend-details)
- [Frontend Details](#frontend-details)
- [Useful Commands](#useful-commands)
- [Team Members](#team-members)
- [Asset & Icon Sources](#asset--icon-sources)
- [License](#license)

---

## Project Overview
This project provides a platform for users to manage their menstrual cycles, book appointments with doctors, track STI test results, and access health-related blogs. It supports different user roles: Customer, Doctor, Staff, and Admin.

## Features
- **Reproductive Cycle Tracking:** Users can monitor their reproductive cycle by manually inputting menstrual cycle data. The system provides reminders for ovulation, fertility windows, and contraceptive pill schedules via notifications.
- **STI Testing Service Management:** Manages the end-to-end STI testing process, from booking to delivering test results.
- **Service Information Management:** Allows input and management of STI testing service details, pricing, and related information.
- **Counselor Profile Management:** Handles counselor information, including general details, qualifications, experience, and consultation schedules.
- **Online Consultation Booking:** Enables users to schedule online consultations with counselors.
- **Q&A Functionality:** Permits users to submit questions to counselors for resolving queries.
- **Rating and Feedback Management:** Manages user ratings and feedback for services and counselors.
- **User Profile and History Management:** Maintains user profiles, including records of past STI testing and consultation bookings.
- **Dashboard and Reporting:** Provides a dashboard with analytics and reporting tools for operational insights.
- **Landing Page & Blog:** Introduces the healthcare facility, features a blog sharing insights on sexual education and reproductive health, and highlights services such as STI testing.
- **User authentication and role-based access**
- **Admin and staff dashboards**
- **Responsive UI with modern design**

## Tech Stack
- **Backend:** Java, Spring Boot, JPA (Hibernate), H2 Database (dev), Maven
- **Frontend:** React, TypeScript, Tailwind CSS, React Router
- **Testing:** JUnit (backend), React Testing Library (frontend)

## System Architecture
```
[Frontend (React)] <----REST API----> [Backend (Spring Boot)] <----> [Database]
```

## Project Structure
```
Menstrual-Management/
├── backend/
│   ├── src/main/java/swp391/com/backend/
│   │   ├── SWP391Application.java
│   │   └── pojo/         # JPA Entities
│   ├── src/main/resources/
│   │   └── application.properties
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── layouts/      # Layouts
│   │   ├── pages/        # Page components
│   │   ├── assets/       # Images, icons, fonts
│   │   └── docs/         # Documentation (e.g., asset_sources.md)
│   ├── public/
│   └── ...
└── README.md
```

## Setup & Installation

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- Java 17+
- Maven 3.6+

### Backend Setup
1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Build and run the Spring Boot application:
   ```sh
   ./mvnw spring-boot:run
   # or (Windows)
   mvnw.cmd spring-boot:run
   ```
   - The backend will start on `http://localhost:8080` by default.
   - H2 database console: `http://localhost:8080/h2-console` (see `src/main/resources/application.properties` for credentials)

### Frontend Setup
1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```
3. Start the React development server:
   ```sh
   npm start
   # or
   yarn start
   ```
   - The frontend will run on `http://localhost:3000` by default.

### Additional Frontend Scripts
In the `frontend` directory, you can also run:

- `npm test` — Launches the test runner in interactive watch mode.
- `npm run build` — Builds the app for production to the `build` folder.
- `npm run eject` — Ejects the app for full configuration control (irreversible).

See the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started) for more details.

## Running the Application
- **Backend:** `http://localhost:8080`
- **Frontend:** `http://localhost:3000`
- The frontend is configured to interact with the backend REST API.

## Backend Details

The backend of the Menstrual Management System is built using Java and Spring Boot, following a modular and scalable architecture. It exposes a RESTful API that serves as the main interface for the frontend application and external clients.

### Key Technologies
- **Spring Boot:** Provides rapid setup, dependency injection, and production-ready features.
- **JPA (Hibernate):** Handles object-relational mapping for database access.
- **H2 Database:** Used for development and testing; can be replaced with other databases in production.
- **Maven:** Manages dependencies and build lifecycle.
- **JUnit:** Used for unit and integration testing.

### Directory Structure
- `src/main/java/swp391/com/backend/`
  - `SWP391Application.java`: Main entry point for the Spring Boot application.
  - `pojo/`: Contains JPA entity classes representing database tables.
  - `controller/`: REST controllers that define API endpoints.
  - `service/`: Business logic and service layer.
  - `repository/`: Spring Data JPA repositories for data access.
- `src/main/resources/`
  - `application.properties`: Configuration for database, server port, etc.

### REST API Structure
- Follows RESTful conventions with endpoints grouped by resource (e.g., `/users`, `/appointments`, `/cycles`, `/tests`).
- Uses standard HTTP methods: `GET`, `POST`, `PUT`, `DELETE`.
- Example endpoint:
  - `GET /api/cycles` — Retrieve menstrual cycle data for a user.
  - `POST /api/appointments` — Book a new appointment.

### Database Configuration
- Default: H2 in-memory database for development.
- Configured in `src/main/resources/application.properties`.
- JPA entities are auto-mapped to tables; schema auto-generated on startup.
- Easily switch to MySQL, PostgreSQL, etc., by updating properties.

### Adding New Endpoints or Entities
1. Create a new entity class in `pojo/`.
2. Add a repository interface in `repository/`.
3. Implement business logic in `service/`.
4. Expose endpoints in a controller under `controller/`.

### Testing
- Unit and integration tests are written using JUnit.
- Test classes are located under `src/test/java/swp391/com/backend/`.
- ```$env:JAVA_HOME="$HOME\.jdks\ms-17.0.15" ; .\mvnw spring-boot:run```
- Run tests with `./mvnw test` or `mvnw.cmd test`.

### Frontend Integration
- The backend exposes a REST API at `http://localhost:8080`.
- CORS is configured to allow requests from the frontend (`http://localhost:3000`).
- All business logic and data persistence are handled server-side, with the frontend acting as a client.

For more details, see the code in the `backend/` directory and the `application.properties` file for configuration options.

## Frontend Details

The frontend of the Menstrual Management System is built with React and TypeScript, providing a modern, responsive, and user-friendly interface. It communicates with the backend via RESTful APIs and is styled using Tailwind CSS for rapid UI development.

### Key Technologies
- **React:** Component-based UI library for building interactive interfaces.
- **TypeScript:** Adds static typing to JavaScript for improved code quality and maintainability.
- **Tailwind CSS:** Utility-first CSS framework for fast and consistent styling.
- **React Router:** Handles client-side routing and navigation.
- **React Testing Library:** Used for unit and integration testing of React components.

### Directory Structure
- `src/components/`: Reusable UI components (e.g., Button, Table, Header, Footer, Sidebar, Popup, etc.)
- `src/layouts/`: Layout components for different user roles or page types (e.g., AdminLayout, AppLayout).
- `src/pages/`: Page-level components grouped by feature or user role (e.g., Admin, Customer, Public).
- `src/assets/`: Static assets such as images, icons, and fonts.
- `src/docs/`: Documentation files (e.g., asset_sources.md).
- `src/index.tsx`: Entry point for the React application.
- `src/App.tsx`: Main app component and route definitions.

### State Management & Routing
- Uses React's built-in state management (hooks) for local state.
- For global state or complex flows, context or third-party libraries can be integrated as needed.
- Client-side routing is managed by React Router, enabling navigation between pages without full reloads.

### Styling & Theming
- Tailwind CSS is used for all styling, ensuring a consistent and responsive design.
- Custom themes or additional styles can be added via Tailwind configuration.

### Testing
- React Testing Library is used for writing unit and integration tests for components and pages.
- Test files are typically placed alongside the components they test or in a dedicated `__tests__` directory.
- Run tests with `npm test` or `yarn test`.

### Backend Integration
- The frontend communicates with the backend REST API at `http://localhost:8080` using fetch or libraries like axios.
- API endpoints are organized by resource (e.g., `/api/cycles`, `/api/appointments`).
- Authentication and authorization are handled via tokens or session management as implemented in the backend.

### Adding New Pages or Components
1. Create a new component in `src/components/` or a new page in `src/pages/`.
2. Add any required assets to `src/assets/`.
3. Define routes for new pages in `src/App.tsx`.
4. Use Tailwind CSS classes for styling.
5. Write tests for new components/pages using React Testing Library.

For more details, see the code in the `frontend/` directory and the documentation in `src/docs/`.

## Useful Commands
### Backend
- Build: `./mvnw clean install` or `mvnw.cmd clean install`
- Run: `./mvnw spring-boot:run` or `mvnw.cmd spring-boot:run`
- Test: `./mvnw test`

### Frontend
- Install dependencies: `npm install` or `yarn install`
- Start dev server: `npm start` or `yarn start`
- Build for production: `npm run build`
- Run tests: `npm test`
- Eject (irreversible): `npm run eject`

See the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started) and [React documentation](https://reactjs.org/) for more frontend details.

## Team Members
<!--
- **Nguyen Van A** - Backend Developer
- **Tran Thi B** - Frontend Developer
- **Le Van C** - Fullstack Developer
- **Pham Thi D** - UI/UX Designer
- **Hoang Van E** - Tester
-->

## Asset & Icon Sources
See `frontend/src/docs/asset_sources.md` for attributions and sources of all icons, images, and fonts used in the project.

## License
This project is for educational purposes. See `LICENSE` if available.
