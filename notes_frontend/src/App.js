import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import "./components/Sidebar.css";
import "./components/NoteEditor.css";
import "./components/AuthForm.css";
import Sidebar from "./components/Sidebar";
import NoteEditor from "./components/NoteEditor";
import AuthForm from "./components/AuthForm";
import {
  loginUser,
  registerUser,
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
} from "./api";
import { getAuth, saveAuth, clearAuth } from "./auth";

// PUBLIC_INTERFACE
export default function App() {
  // Theme ("light" or "dark")
  const [theme, setTheme] = useState("light");
  // Authentication state
  const [auth, setAuth] = useState(getAuth()); // {token, user}
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Notes state
  const [notes, setNotes] = useState([]);
  const [fetchingNotes, setFetchingNotes] = useState(false);
  const [notesError, setNotesError] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [editorSaving, setEditorSaving] = useState(false);
  const [editorDeleting, setEditorDeleting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Effect: Theme persistence
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Effect: If authenticated, fetch notes
  useEffect(() => {
    if (auth && auth.token) {
      setFetchingNotes(true);
      getNotes(auth.token)
        .then((data) => {
          setNotes(data.notes || data);
          setNotesError("");
        })
        .catch((e) => setNotesError(e.message))
        .finally(() => setFetchingNotes(false));
    } else {
      setNotes([]);
    }
  }, [auth]);

  // Effect: Reselect first note if deleted
  useEffect(() => {
    if (notes && notes.length > 0) {
      if (!selectedNoteId || !notes.find(n => n.id === selectedNoteId)) {
        setSelectedNoteId(notes[0].id);
      }
    } else {
      setSelectedNoteId(null);
    }
  }, [notes]);

  // --- Authentication handlers ---

  // PUBLIC_INTERFACE
  const handleAuth = useCallback(async (email, password, mode) => {
    setAuthLoading(true);
    setAuthError("");
    try {
      let result;
      if (mode === "login") {
        result = await loginUser(email, password);
      } else {
        result = await registerUser(email, password);
      }
      // Assumes backend returns {token, user}
      saveAuth(result.token, result.user || {email});
      setAuth({ token: result.token, user: result.user || {email} });
    } catch (e) {
      setAuthError(e.message);
      setAuth(null);
    }
    setAuthLoading(false);
  }, []);

  // PUBLIC_INTERFACE
  const handleLogout = useCallback(() => {
    clearAuth();
    setAuth(null);
  }, []);

  // --- Notes handlers ---

  // PUBLIC_INTERFACE
  const handleSelectNote = (id) => {
    setSelectedNoteId(id);
    setSidebarOpen(false);
  };

  // PUBLIC_INTERFACE
  const handleNewNote = async () => {
    setSelectedNoteId("new");
    setSidebarOpen(false);
  };

  // PUBLIC_INTERFACE
  const handleSaveNote = async (note) => {
    setEditorSaving(true);
    try {
      let saved;
      if (selectedNoteId === "new") {
        saved = await createNote(auth.token, { title: note.title, content: note.content });
        setNotes([saved, ...notes]);
        setSelectedNoteId(saved.id);
      } else {
        saved = await updateNote(auth.token, note.id, { title: note.title, content: note.content });
        setNotes(notes.map(n => n.id === saved.id ? saved : n));
      }
    } catch (e) {
      alert("Sorry, unable to save note: " + e.message);
    }
    setEditorSaving(false);
  };

  // PUBLIC_INTERFACE
  const handleDeleteNote = async (id) => {
    setEditorDeleting(true);
    try {
      await deleteNote(auth.token, id);
      setNotes(notes.filter(n => n.id !== id));
      setSelectedNoteId(
        notes.length > 1 ? notes.find(n => n.id !== id)?.id : null
      );
    } catch (e) {
      alert("Failed to delete note: " + e.message);
    }
    setEditorDeleting(false);
  };

  // --- Layout / Content components ---

  // Main content panel (note editor or viewer)
  let mainContent = null;
  if (!auth || !auth.token) {
    mainContent = (
      <AuthForm onAuth={handleAuth} loading={authLoading} error={authError} />
    );
  } else if (fetchingNotes) {
    mainContent = (
      <div className="main-content-loading">
        <div className="spinner"></div>
        <div>Loading notes...</div>
      </div>
    );
  } else if (notesError) {
    mainContent = (
      <div className="main-content-error">
        <div>Error loading notes: {notesError}</div>
        <button onClick={() => window.location.reload()}>Reload</button>
      </div>
    );
  } else if (!selectedNoteId || notes.length === 0 || (selectedNoteId === "new")) {
    mainContent = (
      <NoteEditor
        note={{ title: "", content: "" }}
        isNew={true}
        onSave={handleSaveNote}
        saving={editorSaving}
      />
    );
  } else {
    const note = notes.find((n) => n.id === selectedNoteId);
    if (!note) {
      mainContent = <div className="main-content-error">Note not found.</div>;
    } else {
      mainContent = (
        <NoteEditor
          note={note}
          isNew={false}
          onSave={handleSaveNote}
          onDelete={handleDeleteNote}
          saving={editorSaving}
          deleting={editorDeleting}
        />
      );
    }
  }

  return (
    <div className={`App notes-app`}>
      {/* Theme switch: top right */}
      <button
        className="theme-toggle"
        onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
      {/* If logged in, show sidebar & editor */}
      {auth && auth.token && (
        <>
          <Sidebar
            notes={notes}
            selectedNoteId={selectedNoteId}
            onSelect={handleSelectNote}
            onNewNote={handleNewNote}
            onLogout={handleLogout}
            user={auth.user}
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
          />
          {/* Hamburger for mobile */}
          <button
            className="sidebar-hamburger"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label="Open sidebar"
            style={{ display: "none" }}
          >
            ☰
          </button>
        </>
      )}
      {/* Main content */}
      <main className="main-content">
        {/* Hamburger nav for mobile */}
        {auth && auth.token && (
          <button
            className="sidebar-hamburger"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label="Open sidebar"
          >
            ☰
          </button>
        )}
        {mainContent}
      </main>
      {/* Responsive CSS */}
      <style>{`
        .App.notes-app {
          min-height: 100vh;
          display: flex;
          flex-direction: row;
          background: var(--bg-primary, #fff);
        }
        .main-content {
          flex: 1 1 auto;
          min-width: 0;
          margin-left: 260px;
          padding: 0;
          transition: margin-left 0.3s;
        }
        .sidebar-hamburger {
          position: absolute;
          z-index: 128;
          left: 18px; top: 18px;
          background: var(--button-bg, #1976D2);
          color: #fff;
          border: none;
          border-radius: 7px;
          padding: 6px 20px 6px 18px;
          font-size: 1.22em;
          font-weight: 700;
          box-shadow: 0 2px 10px rgba(50,70,100,0.04);
          cursor: pointer;
          display: none;
        }
        @media (max-width: 899px) {
          .main-content {
            margin-left: 0 !important;
            padding: 0;
          }
          .sidebar-hamburger {
            display: inline-block;
            top: 18px; left: 18px;
          }
        }
        .main-content-loading, .main-content-error {
          padding: 60px 28px 28px 28px;
          font-size: 1.18em;
          color: #8a9099;
          text-align: center;
        }
        .spinner {
          border: 3px solid #eee;
          border-top: 3px solid var(--primary, #1976D2);
          border-radius: 50%;
          width: 36px; height: 36px;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px auto;
        }
        @keyframes spin { 0% { transform: rotate(0deg);} 100%{transform: rotate(360deg);} }
      `}</style>
    </div>
  );
}
