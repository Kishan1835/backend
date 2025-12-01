import 'dotenv/config';

// src/server.js
import http from 'http';
import app from './app.js';
import { PORT } from './config/env.js';

console.log('📦 Environment loaded');
console.log('DATABASE_URL defined:', !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
    const url = process.env.DATABASE_URL;
    const masked = url.replace(/:[^:/@]+@/, ':***@');
    console.log('DATABASE_URL:', masked);
}

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});