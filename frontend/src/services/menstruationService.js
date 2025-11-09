const API_URL = 'http://localhost:14192/api/menstruation';

function authHeaders() {
  const token = sessionStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export async function fetchMenstruation() {
  const res = await fetch(API_URL, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load menstruation data');
  return data;
}

export async function saveProfile(payload) {
  const res = await fetch(`${API_URL}/profile`, { 
    method: 'POST', 
    headers: authHeaders(), 
    body: JSON.stringify(payload) 
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to save profile');
  return data;
}

export async function addSymptom(payload) {
  const res = await fetch(`${API_URL}/symptom`, { 
    method: 'POST', 
    headers: authHeaders(), 
    body: JSON.stringify(payload) 
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to add symptom');
  return data;
}

export async function addMood(payload) {
  const res = await fetch(`${API_URL}/mood`, { 
    method: 'POST', 
    headers: authHeaders(), 
    body: JSON.stringify(payload) 
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to add mood');
  return data;
}


