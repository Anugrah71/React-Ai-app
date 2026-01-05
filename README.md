# React AI App 

A premium AI-powered content creation platform that helps writers, designers, and job seekers generate high-quality text, images, and career assets through a single modern interface.

---

## Live Demo: 
https://react-ai-app-client.vercel.app/

---

## Project Overview

React AI App is a full-stack application that streamlines content creation using cutting-edge AI tools.  
Users can generate articles, summarize text, create images, review resumes, and explore community-shared AI creations — all in one platform.

---

## Key Features

### Authentication
- Secure user authentication and session management using **Clerk**

### AI Writing Suite
- Full article generation
- Text summarization
- Catchy blog title generation

### AI Image Studio
- Text-to-image generation
- Background removal
- Object removal from images

### Career Tools
- AI-powered resume review
- Supports PDF uploads

### Community Gallery
- Explore public AI creations
- Like and discover trending content

### User Experience
- Modern, responsive UI
- Smooth scroll animations with AOS

---

##  Tech Stack

### Frontend
- React 19
- Vite 7
- Tailwind CSS 4
- React Router 7
- AOS (Animate On Scroll)

### Backend
- Node.js
- Express 5
- OpenAI API
- Cloudinary (image hosting)
- Multer (file uploads)
- pdf-parse (resume analysis)

### Database
- Neon Database (Serverless PostgreSQL)

### Authentication
- Clerk (Clerk-React & Clerk-Express)

---

## Folder Structure
```text
React-AI-App/
├── client/ # React frontend
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # AI tools & feature pages
│ │ └── main.jsx
│ └── package.json
│
├── server/ # Express backend
│ ├── configs/ # DB, Cloudinary, Multer configs
│ ├── controllers/ # Business logic
│ ├── routes/ # API routes
│ └── index.js
```
---
## Installation & Setup
```bash
git clone https://github.com/Anugrah71/React-Ai-app
cd React-Ai-app
```
### Install dependencies

#### Client
```bash
cd client
npm install
```
#### Server
```bash
cd ../server
npm install
```
### Environment Variables (Server)
Create a .env file inside /server:
```bash
CLERK_PUBLISHABLE_KEY=your_key_here
CLERK_SECRET_KEY=your_key_here
PORT=3000
```
Additional environment variables are required for:
- OpenAI API
- Neon Database
- Cloudinary
### Run the Project
Start client
```bash
cd client
npm run dev
```
Start server
```bash
cd server
npm run server
```
---

## API Endpoints

All routes are prefixed with `/api` and protected via authentication unless explicitly noted.

---

### AI Services (`/api/ai`)
```text
 POST  `/generate-article`  Generates full-length AI-written articles based on user prompts 
 POST  `/generate-text-summarizer`  Summarizes long text into concise versions 
 POST  `/generate-blog-title`  Creates catchy and SEO-friendly blog titles 
 POST  `/generate-image` Generates original images from text descriptions 
 POST  `/remove-image-background`  Removes background from uploaded images 
 POST  `/remove-image-object`  Removes specific objects from uploaded images 
 POST  `/resume-review`  Analyzes and reviews uploaded PDF resumes using AI 
```
---

### User & Community (`/api/user`)
```text
 GET  `/get-user-creations`  Fetches all AI-generated content created by the logged-in user 
 GET  `/get-publish-creations`  Retrieves AI creations shared publicly in the community gallery 
 GET  `/get-most-liked-creations`  Fetches the most liked and trending AI creations 
 POST  `/toggle-like-creations`  Allows users to like or unlike a specific AI creation 
```
---






