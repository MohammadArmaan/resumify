# 🚀 Resumify — AI Resume Builder & Job Preparation Platform

🔗 Live App: https://resumify-project.vercel.app

Resumify is a modern AI-powered resume builder and job preparation platform that helps users create, analyze, and optimize resumes using intelligent tools like ATS scoring, job matching, and cover letter generation.

---

## ✨ Features

### 📝 Resume Builder
- Create and manage resumes with multiple sections
- Modern templates with live preview
- Save, update, and delete resumes
- Upload existing resume (PDF) → auto-parse into structured data

---

### 🤖 AI-Powered Tools
- **ATS Score Checker**
  - Analyze resume against job description
  - Get score, missing keywords, and suggestions

- **Job Description Matching**
  - Match resume with job requirements
  - Identify strengths and gaps

- **Cover Letter Generator**
  - Generate tailored cover letters using AI

---

### 📊 AI Reports System
- Save AI analysis as reusable reports
- View past ATS checks, job matches, and cover letters
- Upload external resumes for analysis
- PDF preview + AI insights in one workspace

---

### 💳 Credit-Based System
- Users get limited credits based on subscription plan:
  - FREE → 2 credits
  - RECOMMENDED → 10 credits
  - ENTERPRISE → 100 credits
- Credits are consumed for:
  - Resume creation
  - Resume upload
  - AI operations
- Safe atomic credit deduction logic (race-condition resistant)

---

### 🔐 Authentication & Security
- JWT-based authentication
- Protected routes and API guards
- Subscription-based feature access

---

## 🧠 Tech Stack

### Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Shadcn UI

### Backend
- Next.js API Routes
- Drizzle ORM
- PostgreSQL (Neon)

### AI Integration
- Groq / Gemini APIs
- Custom prompt engineering for ATS & matching

### File Handling
- UploadThing (PDF uploads)
- PDF parsing using `unpdf`

---

## ⚙️ Architecture Highlights

- Separation of:
  - Resume Builder (structured data)
  - AI Reports (analysis snapshots)

- Atomic credit system using SQL conditions:
```sql
credits = credits - 1 WHERE credits > 0