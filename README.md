# Quran Center Management System

A full-stack web application developed to help Quran centers manage classes, teachers, students, and daily Quran memorization progress.

The project was initially created under the development name `StudentsWebsite` while I was learning and building the first version. As the project grew and became a complete system used in a real environment, it evolved into the **Quran Center Management System**.

## About the Project

The Quran Center Management System was developed to simplify the daily management of Quran memorization classes.

The system allows teachers to manage students and record their daily Quran progress, while administrators can manage classes, teachers, and user accounts.

This project gave me practical experience building and deploying a complete full-stack application from the backend API and database to the frontend interface.

## Project Scope & Design Decisions

This project was developed within a short timeframe for a specific group of users at a Quran center rather than as a complete center-wide management platform.

The main goal was to deliver a practical and usable solution quickly while maintaining a clean and functional user experience.

- The application interface is primarily in **Arabic** and designed for Arabic-speaking users.
- The frontend follows a **mobile-first approach**, as smartphones were the primary devices used by the target users, while remaining accessible on desktop devices.
- Development focused on the features required by the target group rather than covering every administrative process within the center.
- The system provides flexibility when recording Quran memorization progress instead of enforcing predefined relationships between Surahs, Ayahs, and Quran pages.
- The first version prioritized **rapid delivery, usability, and core functionality**.
- Authentication and role-based authorization are implemented, but additional security hardening would be required before expanding the system to a larger or more public user base.
- 
## Key Features

- Manage Quran classes and students
- Create and manage teacher accounts
- Track student Quran memorization progress
- Record new memorization, review, and cumulative progress
- Record daily student grades
- Store notes and next tasks for students
- Authentication using JWT
- Role-based authorization for Admin and Teacher users
- Protected frontend routes
-Responsive Arabic interface with a mobile-first design, while remaining accessible on desktop devices.
- RESTful API architecture

## User Roles

### Admin
- Manage classes
- Create teacher accounts
- Reset user passwords
- Access administrative dashboards

### Teacher
- Manage students
- Record daily student progress
- Track Quran memorization
- View student progress and grades

## Tech Stack

### Backend
- C#
- ASP.NET Core
- ASP.NET Core Web API
- Entity Framework Core
- ASP.NET Identity
- JWT Authentication
- SQL Server

### Frontend
- React
- JavaScript
- HTML
- CSS
- Ant Design
- Axios

### Development & Deployment
- Visual Studio
- Visual Studio Code
- Git
- GitHub
- IIS
- Windows VPS

## Project Structure

```text
quran-center-management-system/
│
├── StudentsWebsite/        # ASP.NET Core Web API
│   ├── Controllers/
│   ├── Data/
│   ├── Migrations/
│   ├── Models/
│   └── Repostries/
│
├── frontend/               # React application
│   ├── public/
│   └── src/
│       └── Components/
│           ├── AdminPages/
│           ├── TeacherPages/
│           ├── StudentPages/
│           └── Shared/
│
└── StudentsWebsite.sln
```

## Authentication & Authorization

The application uses **ASP.NET Identity** for user management and **JWT (JSON Web Tokens)** for authentication.

Authorization is role-based, with separate permissions for Admin and Teacher users.

JWT secret keys and environment-specific configuration are not stored in the repository.

## Screenshots

Screenshots of the application will be added here.

## Running the Project Locally

### Backend

1. Clone the repository.
2. Open `StudentsWebsite.sln`.
3. Configure the SQL Server connection string.
4. Configure the JWT secret using .NET User Secrets.
5. Apply the Entity Framework Core migrations.
6. Run the ASP.NET Core API.

Example User Secret:

```json
{
  "JWT": {
    "SecretKey": "YOUR_SECRET_KEY"
  }
}
```

### Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file based on `.env.example` and configure the API URL.

Then start the application:

```bash
npm start
```

## Status

The system has been developed and deployed for real-world use in managing Quran memorization classes and student progress.

Further improvements and features may be added as the project continues to evolve.

## Future Improvements

Potential future improvements include stronger security hardening, a structured Quran data model linking Surahs, Ayahs, and pages, broader center-wide management features, and further improvements to the desktop experience.

## Author

**Mohammad Abdallah**

Software Engineering Student | Junior Full-Stack Developer

ASP.NET Core | React | SQL Server
