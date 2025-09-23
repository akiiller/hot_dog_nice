const API_URL = "http://localhost:3001/product_recipes";

export async function getByProductId(productId) {
  const res = await fetch(`${API_URL}?product_id=${productId}`);
  return await res.json();
}