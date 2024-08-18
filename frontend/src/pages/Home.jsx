import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom"; // Import Navigate
import api from "../api";
import Note from "../Components/notes";
import "../styles/Home.css";

function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [loggedOut, setLoggedOut] = useState(false); 
  useEffect(() => {
    getNotes();
  }, []);

  const logout = () => {
    localStorage.clear();
    setLoggedOut(true); // Set state to true to trigger navigation
  };

  const getNotes = () => {
    api.get("/api/notes/")
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const deleteNote = (id) => {
    api.delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) {
          alert("Note Deleted!");
          getNotes();
        } else {
          alert("Failed to Delete Note!");
        }
      })
      .catch((error) => alert(error));
  };

  const createNote = (e) => {
    e.preventDefault();
    api.post("/api/notes/", { content, title })
      .then((res) => {
        if (res.status === 201) {
          alert("Note Created!");
          getNotes();
          setContent(""); 
          setTitle("");
        } else {
          alert("Failed to Create Note!");
        }
      })
      .catch((err) => alert(err));
  };

  // Redirect to login if logged out
  if (loggedOut) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <div>
        <div className="top-bar">
          <h2>Notes</h2>
          <button type="submit" onClick={logout}>Logout</button>
        </div>
        <div className="notes">
          {notes.map((note) => (
            <Note note={note} onDelete={deleteNote} key={note.id} />
          ))}
        </div>
      </div>
      <hr />
      <article>
        <h2>Create a Note</h2>
        <form onSubmit={createNote}>
          <label htmlFor="title">Title:</label>
          <br />
          <input
            type="text"
            id="title"
            name="title"
            required
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <br />
          <label htmlFor="content">Content:</label>
          <br />
          <textarea
            id="content"
            name="content"
            required
            onChange={(e) => setContent(e.target.value)}
            value={content}
          />
          <br />
          <input type="submit" value="Submit" />
        </form>
        </article>

    </div>
  );
}

export default Home;
