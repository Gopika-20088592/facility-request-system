# facility-request-system

# Facility Request Management System

This project - Facility Request Management System is build on full-stack MERN web application to solve real problem in workplace facility management. This project idea got from real time experience I had in my past company. Facility related issues are mostly communicated informally by phone call without any proper tracker and no further updates. When something goes wrong in a building — a broken air conditioning unit, a faulty projector, a pantry running out of supplies — there is often no structured way to log the issue, track its progress, or know when it will be fixed. This application provides a clear, role-based digital platform where facility requests can be raised, tracked, updated, and resolved in one place.

The system is designed around how facility helpdesks actually work. Employees do not log requests themselves — they call the facility helpdesk, and a staff member logs the request on their behalf. The employee can then log in to see exactly what has been raised for them, its current status, and the reason the status is at that stage. Every status change in this system requires a documented reason, which creates genuine transparency between the facility team and the people they are serving.

**Live Application:** https://facility-request-system.onrender.com

**Backend API:** https://facility-request-system.vercel.app

---

## Tech Stack

This application was built using the MERN stack — MongoDB, Express.js, React, and Node.js — as recommended by the module brief for JavaScript-based full-stack development.

**Frontend**
- React
- React Router DOM v6
- CSS (custom responsive stylesheet)

**Backend**
- Node.js
- Express.js
- express-validator (input validation)
- Helmet (security headers)
- express-mongo-sanitize (NoSQL injection protection)

**Database**
- MongoDB Atlas (Mongoose ODM)

**Authentication and Security**
- JSON Web Tokens (JWT)
- bcryptjs (password hashing)

**External API**
- OpenWeatherMap API (real-time weather data)

**Testing**
- Jest
- Supertest

**Deployment**
- Frontend: Render Static Site
- Backend: Vercel
- Database: MongoDB Atlas

---

## User Roles

There are three roles in the system, each with a different level of access and a different set of responsibilities.

**User (Employee)**

Users are regular employees who report facility issues by calling the helpdesk. They do not create requests themselves — staff raise requests on their behalf. Once a request has been raised, the User can:

- Log in securely
- View all requests raised on their behalf by staff
- See the current status of each request
- See the documented reason for each status change
- Track the full lifecycle of their issue from New through to Resolved

**Staff (Facility Worker)**

Staff members are the people who receive calls from employees and manage the day-to-day resolution of facility issues. They can:

- Log in securely
- Check the current weather in Dublin before planning outdoor maintenance work
- Create new facility requests on behalf of employees (using the Raised For field)
- View all requests they have submitted
- Update ticket status with a mandatory written reason at each stage

**Admin (Facility Manager)**

Admins have full visibility and control across the entire system. They can:

- Log in securely
- View all requests from all users and staff
- Search requests in real time by title, staff username, or employee username
- See summary statistics showing how many tickets are New, In Progress, Pending, and Resolved
- Update the status of any request with a documented reason
- Delete requests after providing a reason and confirming the action

---

## Ticket Lifecycle

One of the key design decisions in this system is the four-state ticket lifecycle. Rather than a simple open/closed model, tickets move through four states that reflect how facility work actually progresses:

| Status | Meaning |
|---|---|
| **New** | The ticket has just been created and has not yet been picked up |
| **In Progress** | A staff member is actively working on the issue |
| **Pending** | Work is paused while waiting for something — a part, better weather, a contractor |
| **Resolved** | The issue has been fully resolved |

Every time a ticket moves from one status to another, the staff member or admin must provide a written reason. This reason is saved and displayed to the employee on their dashboard, so they always know why their request is in its current state.

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | /api/register | Register a new account | Public |
| POST | /api/login | Login and receive JWT token | Public |

### Requests

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | /api/requests | Get all requests | Admin only |
| GET | /api/requests/my/:username | Get requests for a specific user | Authenticated |
| POST | /api/requests | Create a new request | Staff and Admin |
| PUT | /api/requests/:id | Update request status and reason | Staff and Admin |
| DELETE | /api/requests/:id | Delete a request | Admin only |

---

## Security Features

Security was implemented at multiple levels throughout the application.

**Password Hashing (bcryptjs)**
Passwords are never stored as plain text. Every password is hashed using bcryptjs with a salt round of 10 before it is saved to MongoDB. During login, bcrypt's compare function is used to check the submitted password against the stored hash in a timing-safe way.

**Session Management (JWT)**
After a successful login, the server issues a signed JSON Web Token containing the user's ID, username, and role. The token expires after one day. All protected API endpoints require this token in the Authorization header. If the token is missing, expired, or tampered with, the request is rejected with a 401 response.

**Role-Based Access Control**
Three middleware functions enforce role-based access at the API level: protect (verifies the JWT), adminOnly (restricts to admin role), and staffOnly (restricts to staff and admin). These are applied directly to route definitions so that the role check happens before any controller logic runs. On the frontend, a ProtectedRoute component redirects users who attempt to access a dashboard they are not authorised for.

**XSS Protection (Helmet)**
Helmet.js is applied as middleware in server.js, setting security-related HTTP response headers that protect against Cross-Site Scripting attacks and other common web vulnerabilities.

**NoSQL Injection Protection (express-mongo-sanitize)**
All incoming request data is sanitised by express-mongo-sanitize before reaching the database. This removes any keys containing MongoDB operator characters, preventing injection attacks.

**Input Validation (express-validator)**
Route-level validation checks that required fields are present, that passwords meet the minimum length requirement, and that role values are within the permitted set before any request reaches the controller.

**Environment Variables**
Sensitive credentials — the MongoDB connection string and the JWT signing secret — are stored as environment variables and excluded from version control via .gitignore.

---

## Project Structure

```
facility-request-system/
│
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Registration and login logic
│   │   └── requestController.js # CRUD logic for requests
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verification and role checks
│   ├── models/
│   │   ├── User.js             # User schema
│   │   └── Request.js          # Request schema
│   ├── routes/
│   │   ├── authRoutes.js       # Authentication endpoints
│   │   └── requestRoutes.js    # Request endpoints
│   ├── tests/
│   │   └── api.test.js         # Backend API tests
│   ├── .env                    # Environment variables (not in repo)
│   ├── package.json
│   └── server.js               # Express app entry point
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Navbar.js       # Shared navigation bar
│       │   └── ProtectedRoute.js # Route access control
│       ├── pages/
│       │   ├── Login.js        # Login page
│       │   ├── Register.js     # Registration page
│       │   ├── UserDashboard.js    # User role dashboard
│       │   ├── StaffDashboard.js   # Staff role dashboard
│       │   └── AdminDashboard.js   # Admin role dashboard
│       ├── App.js              # Route configuration
│       ├── App.css             # Global styles
│       └── index.js            # React entry point
│
├── .gitignore
└── README.md
```

---

## How to Run This Project Locally

### Prerequisites
- Node.js v18 or later
- MongoDB Atlas account (free tier is fine)
- OpenWeatherMap API key (free tier)

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Gopika-20088592/facility-request-system.git
cd facility-request-system
```

### Step 2 — Set Up Backend Environment Variables

Create a `.env` file inside the `backend` folder with the following:

```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### Step 3 — Install and Run the Backend

```bash
cd backend
npm install
node server.js
```

The backend will run on:
```
http://localhost:5000
```

### Step 4 — Install and Run the Frontend

Open a new terminal window:

```bash
cd frontend
npm install
npm start
```

The frontend will run on:
```
http://localhost:3000
```

### Step 5 — Open the Application

Visit http://localhost:3000 in your browser. Register accounts with each of the three roles (user, staff, admin) to explore the full functionality of the system.

---

## Running Tests

The backend includes API tests written with Jest and Supertest covering registration, login, route protection, and request creation.

```bash
cd backend
npm test
```

---

## Deployment

The application is deployed across two separate cloud platforms.

**Frontend — Render Static Site**

The React frontend is deployed on Render.com. The Root Directory is set to `frontend`, the Build Command is `npm run build`, and the Publish Directory is `frontend/build`. All API base URLs in the frontend code point to the deployed Vercel backend.

Live URL: https://facility-request-system.onrender.com

**Backend — Vercel**

The Express.js API is deployed on Vercel, connected directly to the GitHub repository so every push to the main branch triggers an automatic redeployment. Environment variables are configured securely through the Vercel dashboard.

API URL: https://facility-request-system.vercel.app

**Database — MongoDB Atlas**

MongoDB Atlas hosts the production database in the AWS EU-West (Ireland) region. The connection string is stored as the MONGO_URI environment variable on Vercel and is never exposed in the source code.

---

## Challenges and Solutions

**Environment Variables in Deployment**

When first deploying the backend to Vercel, the application failed to connect to MongoDB because the environment variables were not configured in the Vercel dashboard. This was resolved by adding MONGO_URI and JWT_SECRET through Vercel's project settings, which injects them into the deployment environment at runtime without exposing them in any source file.

**Node Modules Pushed to GitHub**

Early in the project, the node_modules folders were accidentally included in git commits because the .gitignore had not been set up correctly. This caused the repository to contain tens of thousands of unnecessary files and made pushes very slow. The fix involved running git rm -r --cached on both node_modules directories to untrack them, updating the .gitignore file, and pushing the corrected state to GitHub.

**Facility Image Not Showing After Deployment**

The background image on the login page was displaying correctly in local development but not on the deployed frontend. The cause was that the image file had not been committed to the GitHub repository — it only existed on the local machine. The fix was to commit the image to the frontend/public folder so it was included in the Render build.

**Users Not Seeing Requests Raised on Their Behalf**

Initially, the getMyRequests controller only fetched requests where the created_by field matched the user's username. This meant requests raised by staff on behalf of an employee were not visible to that employee. The fix was to update the MongoDB query to use the $or operator, matching documents where either created_by or raised_for matched the username.

---

## Limitations

- The weather widget on the Staff Dashboard is hardcoded to Dublin. A future version would allow the facility location to be configured by the admin.
- There are no automated email notifications when a ticket status changes. Users must log in to check for updates.
- CORS is currently configured to accept requests from any origin. In a production environment, this should be restricted to the specific frontend domain.

---

## Key Learnings

Building this project gave me practical experience across the full MERN stack — from designing Mongoose schemas and building a secure Express API, to managing React state and routing, to configuring cloud deployments and resolving real production issues. The most valuable learning was thinking carefully about the actual problem domain before writing any code. Features like the raised_for field, the four-state ticket lifecycle, and the mandatory status reasons all came from asking how facility management actually works in practice, rather than just building what was technically easy. Getting the deployment working — including resolving environment variable issues, git history problems, and static asset loading — also gave me a much clearer understanding of how web applications behave differently in production compared to local development.

---

## Future Improvements

- Add email notifications when ticket status changes, so users do not need to check the portal manually.
- Allow admin to configure the facility's location so the weather widget reflects the correct city.
- Add a reporting feature for admin to export request history as a CSV or PDF.
- Restrict CORS to the specific deployed frontend domain.
- Add pagination to the admin request list for better performance with large datasets.
- Implement a mobile-optimised layout for staff who may be updating tickets from a phone on site.

---

## Conclusion

The Facility Request Management System is a secure, role-based web application built with the MERN stack that addresses a genuine gap in how facility management is handled in organisations. The system models the real helpdesk workflow — where employees report issues by phone and staff log requests on their behalf — and introduces transparent, documented status tracking so every stakeholder always knows what is happening with a request and why. Building and deploying this project provided practical experience across all aspects of full-stack web development, from database design and API security through to cloud deployment and production debugging.

---

## Module Information

**Module:** B9IS130 – Web Development for Information Systems

**Module Leader:** Dr. Obinna Izima

**Institution:** Dublin Business School

**Student:** Gopika Kattikoloth Manoharan (20088592)
