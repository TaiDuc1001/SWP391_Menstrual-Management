# Menstrual Management System

A full-stack web application for menstrual health management, appointment booking, STI test tracking, and health education. Built with Spring Boot (Java) for the backend and React (TypeScript) with Tailwind CSS for the frontend.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Setup & Installation](#setup--installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Team Members](#team-members)
- [Useful Commands](#useful-commands)
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

#### Additional Frontend Scripts
In the `frontend` directory, you can also run:

- `npm test` — Launches the test runner in interactive watch mode.
- `npm run build` — Builds the app for production to the `build` folder.
- `npm run eject` — Ejects the app for full configuration control (irreversible).

See the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started) for more details.

## Running the Application
- **Backend:** `http://localhost:8080`
- **Frontend:** `http://localhost:3000`
- The frontend is configured to interact with the backend REST API.

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
│   │   └── assets/       # Images, icons, fonts
│   ├── public/
│   └── ...
└── README.md
```

<!-- ## Team Members
- **Nguyen Van A** - Backend Developer
- **Tran Thi B** - Frontend Developer
- **Le Van C** - Fullstack Developer
- **Pham Thi D** - UI/UX Designer
- **Hoang Van E** - Tester -->

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

## License
This project is for educational purposes. See `LICENSE` if available.
