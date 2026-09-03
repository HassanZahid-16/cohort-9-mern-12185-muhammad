# Notes App

A full-stack notes application allows users to create an account, log in securely, and manage their own private notes through a rich text editor.

The project focuses not only on implementing the basic CRUD functionality, but also on applying practices such as authentication, authorization, CSRF protection, structured logging, centralized error handling, automated testing, code coverage, and SonarQube analysis.

## Overview

The Notes App provides a simple workspace where each user can manage their own notes.

After creating an account and logging in, users can create, view, edit, search, and delete their notes. Notes are associated with their respective users, and the backend verifies ownership when performing note-related operations.

The application also includes security and reliability features such as JWT-based authentication, password hashing, CSRF protection, request logging, centralized exception handling, and automated tests for both the backend and frontend.


## Technology Stack

### Frontend

- React
- Vite
- React Router

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

### Security

- JWT
- bcrypt
- HTTP-only cookies
- CSRF protection

### Logging

- Pino
- pino-http

### Testing

- Mocha
- Chai
- Sinon
- Supertest
- Jest
- React Testing Library

### Code Quality

- SonarQube

### Version Control

- Git
- GitHub


## Features

### User Authentication and Authorization

- User registration with email and password.
- Secure password hashing using bcrypt.
- Login using JWT-based authentication.
- Authentication token stored in an HTTP-only cookie.
- Session restoration when the application is refreshed.
- User-specific access to notes.
- Backend ownership checks to prevent users from accessing another user's notes.
- Logout functionality that clears the authentication session.
- CSRF protection for state-changing requests.

### Note Management

- Create new notes.
- View existing notes.
- Edit notes.
- Delete notes.
- Notes are associated with the user who created them.
- Rich text editing for note content.
- Search notes from the dashboard.
- Notes are displayed in an organized dashboard interface.

### Rich Text Editing

The note editor provides rich text formatting rather than relying on a plain text area.

It supports features such as:

- Headings
- Bold text
- Italic text
- Underlined text
- Ordered lists
- Unordered lists
- Links

Rich text content is sanitized before being rendered in the application to reduce the risk of XSS-related issues.

### Logging

Application logging is implemented using Pino.

The application logs important events such as:

- HTTP requests
- HTTP responses
- Authentication-related events
- Application errors
- Unexpected exceptions

`pino-http` is used for HTTP request and response logging, while the application logger is used where additional context is required.

### Error Handling

The backend uses centralized error handling through Express middleware.

Expected application errors are handled using a custom `AppError` class, allowing the application to return appropriate HTTP status codes and meaningful messages.

Unexpected errors are logged and handled without exposing unnecessary internal details to the client.

### Testing

The project includes automated tests for both the backend and frontend.

#### Backend

Backend tests use:

- Mocha
- Chai
- Sinon
- Supertest

The test suite covers important parts of the backend, including:

- Authentication
- Authorization middleware
- CSRF middleware
- Controllers
- Services
- Validators
- Models
- Utility functions
- Note-related functionality

Dependencies are mocked or stubbed where appropriate so that individual pieces of application logic can be tested independently.

#### Frontend

Frontend tests use:

- Jest
- React Testing Library

The frontend test suite covers important services, components, pages, and authentication-related functionality.

### SonarQube

SonarQube is configured to analyze the project's JavaScript source code and identify issues related to:

- Code quality
- Maintainability
- Reliability
- Security
- Test coverage

Coverage reports from the frontend and backend are included in the SonarQube analysis.

### API Endpoints

## Authentication
| Method | Endpoint             | Description                                  |
| ------ | -------------------- | -------------------------------------------- |
| POST   | `/api/auth/register` | Register a new user                          |
| POST   | `/api/auth/login`    | Log in and create an authenticated session   |
| GET    | `/api/auth/me`       | Get the currently authenticated user         |
| POST   | `/api/auth/logout`   | Log out and clear the authentication session |

## Notes
| Method | Endpoint         | Description                        |
| ------ | ---------------- | ---------------------------------- |
| GET    | `/api/notes`     | Get the authenticated user's notes |
| POST   | `/api/notes`     | Create a new note                  |
| GET    | `/api/notes/:id` | Get a specific note                |
| PUT    | `/api/notes/:id` | Update a note                      |
| DELETE | `/api/notes/:id` | Delete a note                      |

### Running the Project Locally

## Prerequisites
Make sure the following are installed:

- Node.js
- npm
- MongoDB
- Git

**Backend**
```bash
cd backend
npm install
cp .env.example .env   # fill in MONGODB_URI and JWT_SECRET
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
cp .env.example .env   # point this at your backend URL
npm run dev
```

The backend runs on `:5000` by default, the frontend on Vite's default dev port.

### Running the tests

```bash
# backend
cd backend
npm test

# frontend
cd frontend
npm test
```