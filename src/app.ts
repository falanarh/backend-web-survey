//src/app.ts

import express, { Express, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "./config/database";

// Import routes
import authRoutes from "./routes/authRoutes";
import surveySessionRoutes from './routes/surveySessionRoutes';
import surveyEvaluationRoutes from './routes/surveyEvaluationRoutes';

// Load environment variables
dotenv.config();

// Initialize express app
const app: Express = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Increase payload limits
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Middleware
app.use(helmet()); // Security headers
// Middleware
app.use(
  cors({
    origin: [
      'https://your-frontend-domain.vercel.app', 
      'http://localhost:3000',
      'http://localhost:3001'
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(morgan("dev")); // HTTP request logger
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/survey-sessions', surveySessionRoutes);
app.use('/api/survey-evaluations', surveyEvaluationRoutes);

// Base route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to Survey API" });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Create server
const server = app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});

// Configure server timeout
server.timeout = 600000; // 10 minutes

// Handle server errors
server.on("error", (error: any) => {
  if (error.code === "ECONNRESET") {
    console.log("Connection reset by client");
  } else {
    console.error("Server error:", error);
  }
});

// Handle process termination
process.on("SIGTERM", () => {
  console.log("SIGTERM received - shutting down server gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  server.close(() => {
    process.exit(1);
  });
});

// Export app
export default app;
