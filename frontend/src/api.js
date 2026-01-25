const API_URL = "http://localhost:5000/api/students";

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
