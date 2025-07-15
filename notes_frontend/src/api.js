//
// API helper functions for authentication and notes CRUD with backend
//

const API_BASE =
  process.env.REACT_APP_API_BASE || "http://localhost:8000"; // FastAPI backend

// --- Authentication ---
// PUBLIC_INTERFACE
export async function loginUser(email, password) {
  /** Log in user, returns token if successful */
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error("Invalid credentials");
  return response.json();
}

// PUBLIC_INTERFACE
export async function registerUser(email, password) {
  /** Register user, returns token if successful */
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error("Registration failed");
  return response.json();
}

// PUBLIC_INTERFACE
export async function getNotes(token) {
  /** Fetch notes list */
  const response = await fetch(`${API_BASE}/notes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Unable to fetch notes");
  return response.json();
}

// PUBLIC_INTERFACE
export async function getNote(token, id) {
  /** Fetch single note */
  const response = await fetch(`${API_BASE}/notes/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Unable to fetch note");
  return response.json();
}

// PUBLIC_INTERFACE
export async function createNote(token, note) {
  /** Create a new note */
  const response = await fetch(`${API_BASE}/notes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });
  if (!response.ok) throw new Error("Unable to create note");
  return response.json();
}

// PUBLIC_INTERFACE
export async function updateNote(token, id, note) {
  /** Update an existing note */
  const response = await fetch(`${API_BASE}/notes/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });
  if (!response.ok) throw new Error("Unable to update note");
  return response.json();
}

// PUBLIC_INTERFACE
export async function deleteNote(token, id) {
  /** Delete a note */
  const response = await fetch(`${API_BASE}/notes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Unable to delete note");
  return response.json();
}
