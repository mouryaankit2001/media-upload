# Media Share App with Google Authentication

A full-stack web application for sharing media files with Google authentication and AWS S3 storage integration. Users can upload images, videos, and PDFs, and control visibility of their media.

## Features

- Google Authentication
- Media upload to AWS S3
- User-specific media visibility (public/private)
- Responsive UI with Material UI
- RESTful API with Express
- MongoDB database
- AWS deployment ready

## Tech Stack

- **Frontend**: React.js with Vite and Material UI
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Storage**: AWS S3
- **Authentication**: Google OAuth 2.0
- **Deployment**: AWS EC2 / Amplify

## Code Structure

### Backend Structure

```
backend/
├── config/                # Configuration files
│   ├── config.js          # Centralized configuration
│   ├── passport.js        # Passport.js configuration
│   └── s3.js              # S3 configuration
├── controllers/           # Route controllers
│   ├── auth.controller.js
│   ├── media.controller.js
│   └── user.controller.js
├── middleware/            # Custom middleware
│   └── auth.middleware.js
├── models/                # MongoDB models
│   ├── media.model.js
│   └── user.model.js
├── routes/                # API routes
│   ├── auth.routes.js
│   ├── media.routes.js
│   └── user.routes.js
├── utils/                 # Utility functions
│   ├── errorHandler.js    # Error handling utilities
│   ├── responseHandler.js # Response formatting utilities
│   └── validators.js      # Request validation utilities
├── .env                   # Environment variables (not tracked in git)
├── .env.example           # Example environment variables
└── server.js              # Application entry point
```

### Frontend Structure

```
frontend/
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable components
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Layout.jsx
│   │   ├── MediaCard.jsx
│   │   └── ProtectedRoute.jsx
│   ├── contexts/          # Context providers
│   │   └── AuthContext.jsx
│   ├── pages/             # Page components
│   │   ├── AuthSuccess.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── NotFound.jsx
│   │   ├── PublicGallery.jsx
│   │   ├── UploadMedia.jsx
│   │   ├── UserProfile.jsx
│   │   └── ViewMedia.jsx
│   ├── App.jsx            # Main App component
│   └── index.js           # Application entry point
├── index.html             # HTML entry point
├── vite.config.js         # Vite configuration
├── .env                   # Environment variables (not tracked in git)
└── .env.example           # Example environment variables
```

## Prerequisites

- Node.js (v14+)
- MongoDB
- AWS account with S3 bucket
- Google Developer Console project with OAuth credentials

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install --f
   ```

3. Create a `.env` file in the backend directory (see .env.example for required variables)

4. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install --f
   ```

3. Create a `.env` file in the frontend directory with:
   ```
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   VITE_API_URL=http://localhost:5000
   ```

4. Start the frontend development server:
   ```
   npm run dev
   ```

## AWS Deployment

See `DEPLOYMENT.md` for simplified AWS deployment instructions

## API Documentation

### Auth Routes
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/google/verify` - Verify Google token
- `GET /api/auth/me` - Get current user info

### Media Routes
- `GET /api/media` - Get all media (based on visibility)
- `GET /api/media/:id` - Get single media by ID
- `POST /api/media` - Upload media
- `PATCH /api/media/:id` - Update media
- `DELETE /api/media/:id` - Delete media

### User Routes
- `GET /api/users/profile` - Get current user profile
- `GET /api/users/media` - Get current user's media
- `GET /api/users/:id` - Get public profile by ID

## License

MIT 