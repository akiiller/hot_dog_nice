const API_URL = "http://localhost:3001/sales";

export async function create(sale) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sale)
  });
  return await res.json();
}