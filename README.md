# Web Survey Backend

Backend service for web survey application built with Express and TypeScript.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file in root directory with:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## API Routes

### Auth Routes
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/google` - Google OAuth login
- GET `/api/auth/profile` - Get user profile
- POST `/api/auth/logout` - Logout user

### Survey Session Routes
- POST `/api/survey-sessions` - Create new session
- GET `/api/survey-sessions/all-sessions` - Get all user sessions
- GET `/api/survey-sessions/:id` - Get specific session
- PUT `/api/survey-sessions/:id` - Update session
- DELETE `/api/survey-sessions/:id` - Delete session
- POST `/api/survey-sessions/:id/submit-response` - Submit response

## Technologies
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT Authentication