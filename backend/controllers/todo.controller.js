import { getTodos, createTodo, updateTodo, removeTodo } from '../services/todo.service.js';

export async function listTodosController(req, res) {
  try {
    const todos = await getTodos({ userId: req.user.id });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createTodoController(req, res) {
  try {
    const { title, priority, dueDate } = req.body;
    const todo = await createTodo({ userId: req.user.id, title, priority, dueDate });
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateTodoController(req, res) {
  try {
    const { id } = req.params;
    const { title, completed, priority, dueDate } = req.body;
    const todo = await updateTodo({ todoId: Number(id), userId: req.user.id, title, completed, priority, dueDate });
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteTodoController(req, res) {
  try {
    const { id } = req.params;
    const deleted = await removeTodo({ todoId: Number(id), userId: req.user.id });
    if (!deleted) return res.status(404).json({ error: 'Todo not found' });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


