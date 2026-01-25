import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>EduTrack</h1>
      <p>Student Academic Management System</p>

      <Link to="/login">
        <button>Login</button>
      </Link>
    </div>
  );
}
