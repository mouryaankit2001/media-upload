# Media Upload Platform Frontend

A React application built with Vite for fast development and optimized production builds.

## Setup

1. Install dependencies:
```bash
npm install --f
```

2. Create a `.env` file in the frontend directory with the following variables:
```
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_API_URL=http://localhost:5000
```

3. Start the development server:
```bash
npm run dev
```

## Build for Production

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Features

- Google OAuth authentication
- File upload to S3 (images, videos, PDFs)
- Public/private media visibility
- User profiles
- Responsive design with Material UI 