const apiUrl = 'http://localhost:3003/todos';

async function fetchTodos() {
  const response = await fetch(apiUrl);
  const todos = await response.json();
  const todoList = document.getElementById('todoList');
  todoList.innerHTML = '';
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.textContent = todo.task;
    li.className = todo.completed ? 'completed' : '';

    // Complete button
    const completeBtn = document.createElement('button');
    completeBtn.textContent = todo.completed ? 'Undo' : 'Complete';
    completeBtn.onclick = async () => {
      await fetch(`${apiUrl}/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: todo.task, completed: !todo.completed }),
      });
      fetchTodos();
    };

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = async () => {
      await fetch(`${apiUrl}/${todo.id}`, { method: 'DELETE' });
      fetchTodos();
    };

    li.appendChild(completeBtn);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
}

document.getElementById('addTaskBtn').onclick = async () => {
  const taskInput = document.getElementById('taskInput');
  const task = taskInput.value.trim();
  if (task) {
    await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task }),
    });
    taskInput.value = '';
    fetchTodos();
  }
};

// Load todos on page load
fetchTodos();
