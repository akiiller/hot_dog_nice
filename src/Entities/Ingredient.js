const API_URL = "http://localhost:3001/ingredients";

export async function list() {
  const res = await fetch(API_URL);
  return await res.json();
}

export async function update(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return await res.json();
}