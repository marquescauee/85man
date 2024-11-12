import { drizzle } from 'drizzle-orm/libsql/web';
import { seedDatabase } from './back/db/seeder';

export const db = drizzle({ 
  connection: { 
    url: process.env.REACT_APP_TURSO_DATABASE_URL!, 
    authToken: process.env.REACT_APP_TURSO_AUTH_TOKEN!
  }
});
