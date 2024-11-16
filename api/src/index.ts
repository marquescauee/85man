import dotenv from "dotenv";
import { drizzle } from 'drizzle-orm/libsql';

dotenv.config();
export const db = drizzle({ 
  connection: { 
    url: process.env.TURSO_DATABASE_URL!, 
    authToken: process.env.TURSO_AUTH_TOKEN!
  }
});


import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});