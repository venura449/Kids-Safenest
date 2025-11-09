import { listTodosByUser, createTodo as createTodoModel, updateTodo as updateTodoModel, deleteTodo as deleteTodoModel } from '../models/todo.model.js';

export function getTodos({ userId }) {
  return listTodosByUser(userId);
}

export function createTodo({ userId, title, priority, dueDate }) {
  if (!title || title.trim().length === 0) {
    throw new Error('Title is required');
  }
  return createTodoModel({ userId, title: title.trim(), priority, dueDate });
}

export function updateTodo({ todoId, userId, title, completed, priority, dueDate }) {
  return updateTodoModel({ todoId, userId, title, completed, priority, dueDate });
}

export function removeTodo({ todoId, userId }) {
  return deleteTodoModel({ todoId, userId });
}


