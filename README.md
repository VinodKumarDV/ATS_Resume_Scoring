# ATS Resume Scoring System

A full-stack AI-powered Recruiter Management System built using **FastAPI**, **React**, **PostgreSQL**, **JWT Authentication**, **Docker**, and **Google Gemini AI**.

---

## Live Demo

### Frontend
https://ats-frontend-bay.vercel.app/

### Backend (Swagger)
https://ats-backend-eju7.onrender.com/docs

### GitHub Repository
https://github.com/VinodKumarDV/ATS_Resume_Scoring

---

# Tech Stack

## Backend

- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication
- Pydantic
- Google Gemini AI
- Docker

## Frontend

- React
- TypeScript
- Vite
- Axios
- React Router
- Context API
- CSS

## Database

- PostgreSQL

## AI

- Google Gemini API
- Automatic keyword-based fallback scoring when AI service is unavailable

---

# Features

## Authentication

- Recruiter Registration
- Recruiter Login
- JWT Authentication
- Protected Routes
- Profile Page

---

## Job Management

- Create Job
- View All Jobs
- View Single Job
- Update Job
- Delete Job
- Filter Open Jobs
- Filter Closed Jobs

---

## Candidate Management

- Upload Resume (PDF/DOC/DOCX)
- Resume Parsing
- Candidate CRUD
- Candidate Listing per Job

---

## AI Resume Scoring

The application compares the uploaded resume with the selected Job Description.

When Gemini API is available:

- ATS Score
- Matching Skills
- Missing Skills
- AI Summary

If Gemini API fails (quota/authentication/network):

A keyword-based scoring algorithm automatically generates:

- Resume Score
- Matching Keywords
- Missing Keywords
- Resume Summary

This ensures the application remains fully functional without depending solely on AI availability.

---

# Project Structure

```
ATS_Resume_Scoring/

│
├── BackEnd/
│   ├── app/
│   │   ├── auth/
│   │   ├── candidates/
│   │   ├── jobs/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── database/
│   │   └── main.py
│   │
│   ├── uploads/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
│
├── FrontEnd/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── context/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

# Database Design

## Recruiter

| Column | Type |
|---------|------|
| id | Integer |
| name | String |
| email | String |
| password | String |

---

## Job

| Column | Type |
|---------|------|
| id | Integer |
| recruiter_id | Integer |
| title | String |
| description | Text |
| status | OPEN/CLOSED |

---

## Candidate

| Column | Type |
|---------|------|
| id | Integer |
| job_id | Integer |
| name | String |
| email | String |
| resume_path | String |
| resume_text | Text |
| score | Integer |
| matching_skills | JSON |
| missing_skills | JSON |
| summary | Text |

---

# API Endpoints

## Authentication

```
POST /auth/register

POST /auth/login

GET /auth/me
```

---

## Jobs

```
POST /jobs

GET /jobs

GET /jobs/{id}

PUT /jobs/{id}

DELETE /jobs/{id}

GET /jobs/open

GET /jobs/closed
```

---

## Candidates

```
POST /candidates/upload

GET /candidates/job/{job_id}

GET /candidates/{id}

PUT /candidates/{id}

DELETE /candidates/{id}
```

---

# Environment Variables

## Backend (.env)

```
DATABASE_URL=

JWT_SECRET=

GEMINI_API_KEY=
```

---

## Example

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/ats_db

JWT_SECRET=supersecret

GEMINI_API_KEY=your_api_key
```

---

# Running Locally (Without Docker)

## Backend

```
cd BackEnd

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Swagger

```
http://localhost:8000/docs
```

---

## Frontend

```
cd FrontEnd

npm install

npm run dev
```

Application

```
http://localhost:5173
```

---

# Running with Docker

## Build

```
docker compose up --build
```

Services

| Service | Port |
|----------|------|
| PostgreSQL | 5432 |
| Backend | 8000 |
| Frontend | 3000 |

Application

```
http://localhost:3000
```

Swagger

```
http://localhost:8000/docs
```

---

# Docker Architecture

```
            React Frontend
                  │
                  │
                  ▼
          FastAPI Backend
                  │
      ┌───────────┴───────────┐
      ▼                       ▼
 PostgreSQL             Gemini AI
```

---

# Security

- JWT Authentication
- Password Hashing using bcrypt
- Protected APIs
- CORS Configuration
- Input Validation using Pydantic
- Secure File Upload Validation

---

# AI Integration

The system uses Google Gemini AI to:

- Parse Resume Context
- Compare Resume with Job Description
- Generate ATS Score
- Detect Matching Skills
- Detect Missing Skills
- Generate Candidate Summary

If Gemini is unavailable, the application automatically falls back to a keyword-matching algorithm to ensure uninterrupted scoring.

---

# Deployment

Frontend

Hosted on Vercel

https://ats-frontend-bay.vercel.app/

Backend

Hosted on Render

https://ats-backend-eju7.onrender.com

---

# Future Enhancements

- Resume OCR Support
- Candidate Ranking Dashboard
- Recruiter Analytics
- Email Notifications
- Role-based Access Control
- Resume Version History
- Advanced ATS Matching
- Unit & Integration Tests
- CI/CD Pipeline

---

# Author

**Vinod Kumar D V**

Full Stack Developer

React • FastAPI • PostgreSQL • Docker • AI
