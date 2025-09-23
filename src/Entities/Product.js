const API_URL = "http://localhost:3001/products";

export async function getAll() {
  const res = await fetch(API_URL);
  return await res.json();
}