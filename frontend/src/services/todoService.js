const API_URL = 'http://localhost:14192/api/todos';

function authHeaders() {
  const token = sessionStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export async function fetchTodos() {
  const res = await fetch(API_URL, {
    headers: authHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load todos');
  return data;
}

export async function createTodo(payload) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create todo');
  return data;
}

export async function updateTodo(id, payload) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update todo');
  return data;
}

export async function deleteTodo(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) {
    let msg = 'Failed to delete todo';
    try {
      const data = await res.json();
      msg = data.error || msg;
    } catch (_) {}
    throw new Error(msg);
  }
}


