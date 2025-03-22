
# CareerGlimpse Backend

This is the backend server for the CareerGlimpse application, which handles user authentication and profile management.

## Setup and Installation

1. Make sure you have Node.js installed (version 14 or higher recommended)
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Run the server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  - Body: `{ name, email, password }`
  
- `POST /api/auth/login` - Login a user
  - Body: `{ email, password }`
  
- `GET /api/auth/user` - Get current user data (protected route)
  - Headers: `x-auth-token: your_jwt_token`

### Profile

- `GET /api/profile` - Get user profile (protected route)
  - Headers: `x-auth-token: your_jwt_token`

## Authentication Flow

1. User registers or logs in
2. Server returns a JWT token
3. Client stores token (localStorage)
4. Client includes token in `x-auth-token` header for protected routes
