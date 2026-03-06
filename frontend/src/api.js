import { API_BASE_URL } from "./services/api";
const API_URL = `${API_BASE_URL}/students`;

export const createStudent = async (student) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(student),
  });

  return res.json();
};

export const getStudents = async () => {
  const res = await fetch(API_URL);
  return res.json();
};
