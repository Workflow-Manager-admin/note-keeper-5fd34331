import React from "react";
import "./Sidebar.css";

// PUBLIC_INTERFACE
export default function Sidebar({
  notes,
  selectedNoteId,
  onSelect,
  onNewNote,
  onLogout,
  user,
  isOpen,
  setIsOpen
}) {
  // Hide sidebar overlay on mobile
  const handleOverlay = () => setIsOpen(false);
  return (
    <>
      <div className={`sidebar${isOpen ? " sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-title">📝 Notes</div>
          <button className="sidebar-close" onClick={() => setIsOpen(false)}>&times;</button>
        </div>
        <div>
          <button className="sidebar-newbtn" onClick={onNewNote}>+ New Note</button>
        </div>
        <ul className="sidebar-list">
          {notes && notes.length === 0 && <li className="sidebar-empty">No notes</li>}
          {notes &&
            notes.map(note => (
              <li
                key={note.id}
                className={
                  "sidebar-note" + (note.id === selectedNoteId ? " selected" : "")
                }
                onClick={() => onSelect(note.id)}
                tabIndex={0}
                aria-current={note.id === selectedNoteId ? "true" : "false"}
              >
                <div className="sidebar-note-title">
                  {note.title || "(Untitled)"}
                </div>
                <div className="sidebar-note-snippet">
                  {note.content ? note.content.slice(0, 30) : ""}
                </div>
              </li>
            ))}
        </ul>
        <div className="sidebar-bottom">
          <span className="sidebar-user">{user ? user.email : ""}</span>
          <button className="sidebar-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
      {isOpen && <div className="sidebar-overlay" onClick={handleOverlay}></div>}
    </>
  );
}
