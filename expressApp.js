import express from 'express';

const app = express();
const PORT = 4000;

// Configure JSON parsing middleware
app.use(express.json());

// Initialize an array containing at least three sample employee task records
let tasks = [
  {
    id: 1,
    taskName: "Develop Login Page",
    assignedTo: "Rahul Sharma",
    status: "Pending",
    priority: "High"
  },
  {
    id: 2,
    taskName: "Design Dashboard UI",
    assignedTo: "Priya Singh",
    status: "Completed",
    priority: "Medium"
  },
  {
    id: 3,
    taskName: "Setup Database Schema",
    assignedTo: "Amit Kumar",
    status: "In Progress",
    priority: "High"
  }
];

// 1. GET /tasks - Retrieve all employee tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// 2. GET /tasks/:id - Retrieve a task by ID
app.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  res.json(task);
});

// 3. POST /tasks - Add a new task
app.post('/tasks', (req, res) => {
  const { id, taskName, assignedTo, status, priority } = req.body;
  
  if (!id || !taskName || !assignedTo || !status) {
    return res.status(400).json({ error: "Missing required fields (id, taskName, assignedTo, status)" });
  }

  const newTask = {
    id: parseInt(id),
    taskName,
    assignedTo,
    status,
    priority: priority || "Medium"
  };

  tasks.push(newTask);
  res.status(201).json({
    message: "Task added successfully",
    task: newTask
  });
});

// 4. PUT /tasks/:id - Update task details
app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  const { taskName, assignedTo, status, priority } = req.body;

  tasks[taskIndex] = {
    id: taskId,
    taskName: taskName || tasks[taskIndex].taskName,
    assignedTo: assignedTo || tasks[taskIndex].assignedTo,
    status: status || tasks[taskIndex].status,
    priority: priority || tasks[taskIndex].priority
  };

  res.json({
    message: "Task updated successfully",
    task: tasks[taskIndex]
  });
});

// 5. DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  const deletedTask = tasks.splice(taskIndex, 1);
  res.json({
    message: "Task deleted successfully",
    task: deletedTask[0]
  });
});

// Handle invalid / unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});