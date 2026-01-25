import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Students() {
  const [name, setName] = useState("");
  const [reg, setReg] = useState("");
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // 🔐 Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // 📥 Fetch students
  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ➕ Save student
  const submit = async () => {
    await fetch("http://localhost:5000/api/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        registerNumber: reg,
        cgpa: 0,
      }),
    });

    setName("");
    setReg("");
    fetchStudents();
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ padding: 30 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Students</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <hr />

      <h3>Add Student</h3>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />

      <input
        placeholder="Register Number"
        value={reg}
        onChange={(e) => setReg(e.target.value)}
      />
      <br />

      <button onClick={submit}>Save</button>

      <hr />

      <h3>Students List</h3>
      <ul>
        {students.map((s) => (
          <li key={s._id}>
            {s.name} ({s.registerNumber}) — CGPA: {s.cgpa}
          </li>
        ))}
      </ul>
    </div>
  );
}


