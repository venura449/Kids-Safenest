import db from '../config/db.js';

export function listTodosByUser(userId) {
  return db('todos')
    .where({ user_id: userId })
    .select([
      'id',
      db.raw('user_id as "userId"'),
      'title',
      'completed',
      'priority',
      db.raw('due_date as "dueDate"'),
      db.raw('created_at as "createdAt"'),
      db.raw('updated_at as "updatedAt"')
    ])
    .orderBy('created_at', 'desc');
}

export async function createTodo({ userId, title, priority, dueDate }) {
  const [todo] = await db('todos')
    .insert({
      user_id: userId,
      title,
      priority: priority || 'medium',
      due_date: dueDate || null
    })
    .returning(['id', 'user_id as userId', 'title', 'completed', 'priority', 'due_date as dueDate', 'created_at as createdAt', 'updated_at as updatedAt']);
  return todo;
}

export async function updateTodo({ todoId, userId, title, completed, priority, dueDate }) {
  const updatePayload = {};
  if (title !== undefined) updatePayload.title = title;
  if (completed !== undefined) updatePayload.completed = completed;
  if (priority !== undefined) updatePayload.priority = priority;
  if (dueDate !== undefined) updatePayload.due_date = dueDate;
  updatePayload.updated_at = db.fn.now();

  const [todo] = await db('todos')
    .where({ id: todoId, user_id: userId })
    .update(updatePayload)
    .returning(['id', 'user_id as userId', 'title', 'completed', 'priority', 'due_date as dueDate', 'created_at as createdAt', 'updated_at as updatedAt']);
  return todo;
}

export function deleteTodo({ todoId, userId }) {
  return db('todos')
    .where({ id: todoId, user_id: userId })
    .del();
}


