const API_URL = "http://localhost:3001/sale_items";

export async function create(saleItem) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(saleItem)
  });
  return await res.json();
}