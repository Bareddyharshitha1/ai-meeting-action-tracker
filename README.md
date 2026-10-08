# \# 🤖 AI Meeting Action Tracker

# 

# An AI-powered full-stack web application that analyzes meeting discussions and automatically converts them into structured, trackable action items.

# 

# The application helps teams capture meeting summaries, key discussion points, assigned tasks, deadlines, priorities, and task statuses in one centralized dashboard.

# 

# \## 🚀 Features

# 

# \* 🔐 User registration and login

# \* 🔑 JWT-based authentication

# \* 🤖 AI-powered meeting analysis using Ollama

# \* 📝 Automatic meeting summary generation

# \* 📌 Key-point extraction

# \* ✅ Automatic action-item extraction

# \* 👤 Task assignment

# \* 📅 Deadline detection

# \* 🚦 Priority classification

# \* 📊 Task status tracking

# \* 🔍 Search action items

# \* 🎯 Filter by priority, assignee, and status

# \* 📈 Dashboard analytics

# \* 📊 Task statistics and charts

# \* 📋 Meeting history

# \* 🔔 Notification center

# \* ⏰ Upcoming deadline reminders

# \* ⚠️ Overdue task tracking

# \* 📈 Completion-rate progress visualization

# \* ☁️ MongoDB Atlas database

# 

# \## 🛠️ Tech Stack

# 

# \### Frontend

# 

# \* React

# \* Vite

# \* JavaScript

# \* CSS

# \* Recharts

# 

# \### Backend

# 

# \* Node.js

# \* Express.js

# \* REST APIs

# \* JWT Authentication

# \* bcryptjs

# 

# \### Database

# 

# \* MongoDB

# \* MongoDB Atlas

# \* Mongoose

# 

# \### AI

# 

# \* Ollama

# \* Llama 3.2 3B

# 

# \## 🏗️ Project Architecture

# 

# ```text

# AI Meeting Action Tracker

# │

# ├── frontend

# │   ├── src

# │   │   ├── components

# │   │   ├── App.jsx

# │   │   ├── App.css

# │   │   ├── index.css

# │   │   └── main.jsx

# │   ├── public

# │   └── package.json

# │

# ├── backend

# │   ├── models

# │   │   ├── Meeting.js

# │   │   └── User.js

# │   ├── routes

# │   │   ├── authRoutes.js

# │   │   └── meetingRoutes.js

# │   ├── services

# │   │   └── aiService.js

# │   ├── authMiddleware.js

# │   ├── server.js

# │   └── package.json

# │

# ├── .gitignore

# ├── package.json

# └── README.md

# ```

# 

# \## 🧠 How AI Analysis Works

# 

# The user provides a meeting transcript through the application.

# 

# The backend sends the transcript to a locally running Ollama model.

# 

# The AI analyzes the discussion and extracts:

# 

# ```text

# Meeting Transcript

# &#x20;       ↓

# &#x20;  Ollama / Llama 3.2

# &#x20;       ↓

# &#x20;  AI Analysis

# &#x20;       ↓

# &#x20;┌─────────────────────┐

# &#x20;│ Summary             │

# &#x20;│ Key Points          │

# &#x20;│ Action Items        │

# &#x20;│ Assigned Person     │

# &#x20;│ Deadline            │

# &#x20;│ Priority            │

# &#x20;│ Status              │

# &#x20;└─────────────────────┘

# &#x20;       ↓

# &#x20;     MongoDB

# &#x20;       ↓

# &#x20;   Dashboard

# ```

# 

# Using Ollama allows the project to perform AI processing locally without requiring a paid cloud AI API.

# 

# \## 🔐 Authentication

# 

# The application uses JWT-based authentication.

# 

# Authentication flow:

# 

# ```text

# Register

# &#x20;  ↓

# Password hashing using bcrypt

# &#x20;  ↓

# MongoDB

# &#x20;  ↓

# Login

# &#x20;  ↓

# JWT Token

# &#x20;  ↓

# Protected API Requests

# ```

# 

# Meeting APIs require a valid authentication token, ensuring users cannot access protected meeting data without authorization.

# 

# \## 📊 Dashboard

# 

# The dashboard provides an overview of:

# 

# \* Total meetings

# \* Total action items

# \* Pending tasks

# \* In-progress tasks

# \* Completed tasks

# \* High-priority tasks

# \* Medium-priority tasks

# \* Low-priority tasks

# \* Completion rate

# \* Upcoming deadlines

# \* Overdue tasks

# 

# \## 🔎 Action Item Management

# 

# Users can search and filter tasks using:

# 

# \* Search

# \* Priority

# \* Assignee

# \* Status

# 

# Each action item contains:

# 

# ```text

# Task

# Assigned To

# Deadline

# Priority

# Status

# ```

# 

# Task status can be updated between:

# 

# ```text

# Pending

# In Progress

# Completed

# ```

# 

# \## ⏰ Deadline Management

# 

# The application identifies upcoming and overdue tasks.

# 

# Examples:

# 

# ```text

# Due today

# Due tomorrow

# Due in 3 days

# 2 days overdue

# ```

# 

# Notifications are generated for relevant upcoming deadlines.

# 

# \## ⚙️ Installation

# 

# \### 1. Clone the repository

# 

# ```bash

# git clone https://github.com/Bareddyharshitha1/ai-meeting-action-tracker.git

# cd ai-meeting-action-tracker

# ```

# 

# \### 2. Install backend dependencies

# 

# ```bash

# cd backend

# npm install

# ```

# 

# \### 3. Install frontend dependencies

# 

# Open another terminal:

# 

# ```bash

# cd frontend

# npm install

# ```

# 

# \### 4. Configure environment variables

# 

# Create:

# 

# ```text

# backend/.env

# ```

# 

# Example:

# 

# ```env

# MONGO\_URI=your\_mongodb\_connection\_string

# PORT=5000

# JWT\_SECRET=your\_secure\_jwt\_secret

# ```

# 

# Do not commit `.env` to GitHub.

# 

# \### 5. Install Ollama

# 

# Install Ollama and download the required model:

# 

# ```bash

# ollama pull llama3.2:3b

# ```

# 

# Make sure Ollama is running before using AI meeting analysis.

# 

# \### 6. Start the backend

# 

# ```bash

# cd backend

# npm run dev

# ```

# 

# Backend:

# 

# ```text

# http://localhost:5000

# ```

# 

# \### 7. Start the frontend

# 

# ```bash

# cd frontend

# npm run dev

# ```

# 

# Frontend:

# 

# ```text

# http://localhost:5173

# ```

# 

# \## 🔌 Main API Endpoints

# 

# \### Authentication

# 

# ```text

# POST /api/auth/register

# POST /api/auth/login

# ```

# 

# \### Meetings

# 

# ```text

# POST   /api/meetings

# POST   /api/meetings/analyze

# GET    /api/meetings

# GET    /api/meetings/:id

# DELETE /api/meetings/:id

# ```

# 

# \### Action Items

# 

# ```text

# PATCH /api/meetings/:meetingId/actions/:actionId

# ```

# 

# \## 🎯 Project Objective

# 

# The main objective of this project is to reduce the manual effort involved in managing meeting outcomes by using AI to transform unstructured meeting discussions into organized and actionable tasks.

# 

# \## 🔮 Future Improvements

# 

# \* Email notifications

# \* Calendar integration

# \* Team collaboration

# \* Role-based access control

# \* Voice-to-text meeting transcription

# \* Cloud deployment

# \* Advanced AI insights

# \* Task analytics

# \* Real-time notifications

# 

# \## 👩‍💻 Developer

# 

# \*\*Bareddy Harshitha\*\*

# 

# B.Tech Computer Science Engineering

# 

# Built as a full-stack AI project using React, Node.js, Express, MongoDB, JWT authentication, and Ollama.



