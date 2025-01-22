const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3003 || "google.com";

// Middleware
app.use(cors());
app.use(bodyParser.json());

// CRUD Routes
// Get all tasks
app.get('/todos', async (req, res) => {
  try {
    const [todos] = await db.query('SELECT * FROM todos');
    res.json(todos);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Add a new task
app.post('/todos', async (req, res) => {
  const { task } = req.body;
  try {
    const result = await db.query('INSERT INTO todos (task) VALUES (?)', [task]);
    res.json({ id: result[0].insertId, task, completed: false });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update a task
app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { task, completed } = req.body;
  try {
    await db.query('UPDATE todos SET task = ?, completed = ? WHERE id = ?', [task, completed, id]);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete a task
app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM todos WHERE id = ?', [id]);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
