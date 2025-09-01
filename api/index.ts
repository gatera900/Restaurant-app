import express from 'express';
import { registerRoutes } from '../server/routes';
import path from 'path';
import fs from 'fs';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Initialize routes
let isInitialized = false;

const initializeApp = async () => {
  if (!isInitialized) {
    await registerRoutes(app);
    
    // Serve static files in production
    if (process.env.NODE_ENV === 'production') {
      const distPath = path.resolve(process.cwd(), 'dist/public');
      
      if (fs.existsSync(distPath)) {
        app.use(express.static(distPath));
        
        // Serve index.html for all non-API routes
        app.get('*', (req, res) => {
          if (!req.path.startsWith('/api')) {
            res.sendFile(path.resolve(distPath, 'index.html'));
          }
        });
      }
    }
    
    isInitialized = true;
  }
  return app;
};

export default async (req: any, res: any) => {
  const app = await initializeApp();
  return app(req, res);
};
