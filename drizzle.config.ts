
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/back/db/schema.ts',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.DEBUG ? process.env.DEBUG_TURSO_DATABASE_URL! : process.env.REACT_APP_TURSO_DATABASE_URL!,
    authToken: process.env.REACT_APP_TURSO_AUTH_TOKEN!,
  },
});
