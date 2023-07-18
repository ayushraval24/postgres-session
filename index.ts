require("dotenv").config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import pgSession from "connect-pg-simple";
import routes from "./app/routes";
import cookieParser from "cookie-parser";
import { Pool } from "pg";
import { PrismaClient } from "@prisma/client";

// Database configuration
import prismObj from "./app/config/dbConfig";

const app = express();

const prisma = new PrismaClient();

// Storing session in database
// const PgSession = pgSession(session);

// const sessionStore = new PgSession({
//   conObject: prisma.$connect(),
//   tableName: "session",
// });

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgressession",
  password: "123456",
  port: 5432, // adjust the port as per your PostgreSQL configuration
});

const PgSession = pgSession(session);

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create a new session
app.use(
  session({
    store: new PgSession({
      pool: pool as any, // provide the Prisma instance connection
      tableName: "session", // specify the name of the session table in the database
    }),
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 5000, // Session expiration time (1 day)
      // maxAge: 24 * 60 * 60 * 1000, // Session expiration time (1 day)
    },
  })
);

app.use("/", routes);

const PORT = process.env.PORT || 8080;

// Server configuration
app.listen(PORT, () => {
  console.log("Server listening on port : ", PORT);
});
