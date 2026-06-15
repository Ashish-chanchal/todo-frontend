const BASE = import.meta.env.VITE_API_BACKEND_URI;

function headers(token) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

async function request(method, path, body, token) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(token),
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || `Request failed: ${res.status}`);
  return data;
}

export function getTodos(token, params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') qs.set(k, v); });
  const query = qs.toString();
  return request('GET', `/todos${query ? `?${query}` : ''}`, null, token);
}

export function createTodo(token, body) {
  return request('POST', '/todo', body, token);
}

export function completeTodo(token, id) {
  return request('PUT', '/completed', { id }, token);
}

export function deleteTodo(token, id) {
  return request('DELETE', '/delete', { id }, token);
}

export function aiParse(token, text) {
  return request('POST', '/ai/parse', { text }, token);
}

export function aiPrioritize(token) {
  return request('POST', '/ai/prioritize', null, token);
}
