const API_URL = 'http://localhost:14192/api/profile';

function authHeaders(){
    const token = sessionStorage.getItem('token');
    return{
        'Content-Type': 'application/json',
        ...( token ? { Authorization : `Bearer ${token}`} : {} )
    };
} 

export async function createDevice(payload) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || 'Failed to create todo');
  return data;
}

export async function fetchDevices( ){
  const res = await fetch(API_URL, {
    method: 'GET',
    headers: authHeaders(),
  });

  const data = await res.json();

  if( !res.ok ) throw new Error( data.error || 'Failed to load Device List');
  return data;
}

export async function updateDeviceDetails(id,payload){
  const res = await fetch(`${API_URL}/${id}`,{
    method:'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if(!res.ok) throw new Error(data.error || 'Failed to update' );
  return data;
}

export async function apiDeleteDevice(id){
  const res = await fetch(`${API_URL}/${id}`,{
    method:'DELETE',
    headers: authHeaders()
  });

  const data = await res.json();

  if(!res.ok) throw new Error( data.error || 'Failed to delete' );
  return data;
}