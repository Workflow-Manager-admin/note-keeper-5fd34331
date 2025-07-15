import React, { useState, useEffect } from "react";
import "./NoteEditor.css";

/**
 * NoteEditor component for create/edit note.
 * Props:
 * - note: {id, title, content}
 * - onSave: function(note)
 * - onDelete: function(id)
 * - saving, deleting: bools
 * - isNew: bool
 */
 // PUBLIC_INTERFACE
export default function NoteEditor({
  note,
  onSave,
  onDelete,
  saving,
  deleting,
  isNew,
}) {
  const [title, setTitle] = useState(note ? note.title : "");
  const [content, setContent] = useState(note ? note.content : "");

  useEffect(() => {
    setTitle(note ? note.title : "");
    setContent(note ? note.content : "");
  }, [note]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...note, title, content });
  };

  return (
    <form className="note-editor" onSubmit={handleSubmit}>
      <input
        className="note-editor-title"
        placeholder="Title"
        value={title}
        maxLength={80}
        onChange={(e) => setTitle(e.target.value)}
        required
        autoFocus
      />
      <textarea
        className="note-editor-content"
        placeholder="Write your note here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={10}
      ></textarea>
      <div className="note-editor-actions">
        <button
          type="submit"
          className="note-savebtn"
          disabled={saving}
          aria-busy={saving}
        >
          {saving ? "Saving..." : isNew ? "Create" : "Save"}
        </button>
        {!isNew && (
          <button
            type="button"
            className="note-deletebtn"
            disabled={deleting}
            onClick={() => window.confirm("Delete this note?") && onDelete(note.id)}
            aria-busy={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>
    </form>
  );
}
