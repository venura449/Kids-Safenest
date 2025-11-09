const API_URL = 'http://localhost:14192/api/children';

function authHeaders() {
  const token = sessionStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export async function addChild(payload) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || 'Failed to add child');
  return data;
}

export async function fetchChildren() {
  const res = await fetch(API_URL, {
    method: 'GET',
    headers: authHeaders(),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || 'Failed to load children list');
  return data;
}

export async function getChildById(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'GET',
    headers: authHeaders(),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || 'Failed to load child details');
  return data;
}

export async function getChildByWatchId(watchId) {
  const res = await fetch(`${API_URL}/watch/${watchId}`, {
    method: 'GET',
    headers: authHeaders(),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || 'Failed to load child by watch ID');
  return data;
}

export async function updateChildDetails(id, payload) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || 'Failed to update child details');
  return data;
}

export async function deleteChild(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || 'Failed to delete child');
  return data;
}

