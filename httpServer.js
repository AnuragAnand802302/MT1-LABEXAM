import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve directory paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory array for Part A tasks
let tasks = [
  { id: 1, taskName: 'Design Database Schema', assignedTo: 'Alice Smith', status: 'Pending' },
  { id: 2, taskName: 'Setup Server Environment', assignedTo: 'Bob Jones', status: 'Completed' }
];

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // GET / or /welcome
  if (req.method === 'GET' && (pathname === '/' || pathname === '/welcome')) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Welcome to Employee Task Management Application (HTTP Module)</h1>');
  } 
  // GET /tasks
  else if (req.method === 'GET' && pathname === '/tasks') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(tasks));
  } 
  // POST /add-task
  else if (req.method === 'POST' && pathname === '/add-task') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const newTask = JSON.parse(body);
        // Validate required fields
        if (!newTask.id || !newTask.taskName || !newTask.assignedTo || !newTask.status) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing required fields: id, taskName, assignedTo, status' }));
          return;
        }
        tasks.push(newTask);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Task added successfully', task: newTask }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
  } 
  // GET /about
  else if (req.method === 'GET' && pathname === '/about') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      application: 'Employee Task Management Web Application',
      description: 'Built using native Node.js HTTP and FS modules for demonstration purposes.',
      version: '1.0.0'
    }));
  } 
  // GET /home (Serve static file using FS module)
  else if (req.method === 'GET' && pathname === '/home') {
    const filePath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1><p>The home HTML file could not be found.</p>');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } 
  // 404 Error Handling for invalid routes
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});