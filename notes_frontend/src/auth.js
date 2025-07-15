//
// Utilities for localStorage authentication state management.
//

// PUBLIC_INTERFACE
export function saveAuth(token, user) {
  /** Save token and user in localStorage */
  localStorage.setItem("notes_token", token);
  if (user) localStorage.setItem("notes_user", JSON.stringify(user));
}

// PUBLIC_INTERFACE
export function clearAuth() {
  /** Clear authentication in localStorage */
  localStorage.removeItem("notes_token");
  localStorage.removeItem("notes_user");
}

// PUBLIC_INTERFACE
export function getAuth() {
  /** Returns {token, user} if logged in, otherwise null */
  const token = localStorage.getItem("notes_token");
  const userStr = localStorage.getItem("notes_user");
  let user = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch(e) { user = null; }
  }
  return token ? { token, user } : null;
}
