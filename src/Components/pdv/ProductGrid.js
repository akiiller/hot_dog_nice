import React, { useState, useEffect } from "react"; // 1. Importar useState e useEffect
import { Skeleton } from "../ui/skeleton";
import { Package } from "lucide-react";

// 2. Remover 'products' e 'isLoading' das props, pois o componente vai gerenciá-los
export default function ProductGrid({ onProductClick }) {
  // 3. Criar estados internos para os produtos e para o status de carregamento
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Começa como true

  // 4. useEffect para buscar os dados da API quando o componente carregar
  useEffect(() => {
    // Função assíncrona para poder usar 'await'
    const fetchProducts = async () => {
      try {
        // O endereço da API que criamos no backend
        const response = await fetch('http://localhost:3001/api/products'); 
        const jsonResponse = await response.json();
        
        // 'data' é o campo que definimos na nossa API no server.js
        setProducts(jsonResponse.data); 

      } catch (error) {
        console.error("Falha ao buscar produtos:", error);
        // Em caso de erro, garantimos que a lista de produtos fique vazia
        setProducts([]);
      } finally {
        // Independente de sucesso ou falha, paramos de mostrar o 'loading'
        setIsLoading(false);
      }
    };

    fetchProducts(); // Executa a função de busca
  }, []); // O array vazio [] significa que este efeito só vai rodar UMA VEZ, quando o componente montar

  // O restante do seu código JSX não precisa de NENHUMA alteração,
  // pois ele já está preparado para lidar com os estados 'isLoading' e 'products'.
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array(8).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <button
          key={product.id}
          onClick={() => onProductClick(product)}
          className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-red-300 hover:shadow-lg transition-all duration-200 hover:scale-105 group"
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-red-50 rounded-full flex items-center justify-center group-hover:bg-red-100">
              <Package className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="font-semibold text-gray-700 text-sm mb-2 leading-tight">
              {product.name}
            </h3>
            <div className="text-lg font-bold text-red-600">
              R$ {product.price.toFixed(2)}
            </div>
          </div>
        </button>
      ))}
      
      {products.length === 0 && !isLoading && (
        <div className="col-span-full text-center py-12">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Nenhum produto cadastrado</p>
        </div>
      )}
    </div>
  );
}