import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Database configuration
prisma
  .$connect()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log("Something went wrong in database connection : ", err);
  });

export default prisma;
