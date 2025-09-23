import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getAll as getProducts } from "../Entities/Product";
import { create as createSale } from "../Entities/Sale";
import { create as createSaleItem } from "../Entities/SaleItem";
import { getByProductId } from "../Entities/ProductRecipe";
import { list as listIngredients, update as updateIngredient } from "../Entities/Ingredient";
// ...restante do código...
// ...existing code...


import ProductGrid from "../Components/pdv/ProductGrid";
import OrderSummary from "../Components/pdv/OrderSummary";
import PaymentModal from "../Components/pdv/PaymentModal";
// ...existing code...


export default function PDV() {
  const [products, setProducts] = useState([]);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    const data = await getProducts();
    setProducts(data);
    setIsLoading(false);
  };

  const addToOrder = (product) => {
    setCurrentOrder(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * product.price }
            : item
        );
      }
      return [...prev, { 
        product, 
        quantity: 1, 
        subtotal: product.price 
      }];
    });
  };

  const updateOrderItem = (productId, quantity) => {
    if (quantity === 0) {
      setCurrentOrder(prev => prev.filter(item => item.product.id !== productId));
    } else {
      setCurrentOrder(prev =>
        prev.map(item =>
          item.product.id === productId
            ? { ...item, quantity, subtotal: quantity * item.product.price }
            : item
        )
      );
    }
  };

  const getTotalAmount = () => {
    return currentOrder.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const cancelOrder = () => {
    setCurrentOrder([]);
  };

  const finalizeSale = async (paymentMethod) => {
    if (currentOrder.length === 0) return;

    const totalAmount = getTotalAmount();
    const saleTime = new Date().toISOString();

    // Criar venda
    const sale = await createSale({
      total_amount: totalAmount,
      payment_method: paymentMethod,
      sale_time: saleTime
    });

    // Criar itens da venda
    for (const orderItem of currentOrder) {
      await createSaleItem({
        sale_id: sale.id,
        product_id: orderItem.product.id,
        quantity: orderItem.quantity,
        unit_price: orderItem.product.price,
        subtotal: orderItem.subtotal
      });

      // Processar baixa de estoque
      await processStockReduction(orderItem.product.id, orderItem.quantity);
    }

    // Limpar pedido atual
    setCurrentOrder([]);
    setShowPaymentModal(false);
  };

  const processStockReduction = async (productId, quantity) => {
    try {
      // Buscar receita do produto
      const recipes = await getByProductId({ product_id: productId });
      
      for (const recipe of recipes) {
        const ingredient = await listIngredients();
        const ingredientData = ingredient.find(i => i.id === recipe.ingredient_id);
        
        if (ingredientData) {
          const newQuantity = ingredientData.current_quantity - (recipe.quantity * quantity);
          await updateIngredient(ingredientData.id, {
            current_quantity: Math.max(0, newQuantity)
          });
        }
      }
    } catch (error) {
      console.error("Erro ao processar baixa de estoque:", error);
    }
  };

  // ...existing code...

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b-2 border-red-200 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-red-600">PAINEL DE VENDAS</h1>
            <p className="text-gray-600">
              {format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })} - 
              {format(new Date(), " HH:mm")}
            </p>
          </div>
        </div>
      </div>

      {/* Layout principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Espaço vazio à esquerda (remova se não quiser nada) */}
        {/* <div className="w-64"></div> */}

        {/* Produtos ao centro */}
        <div className="flex-1 flex justify-center items-start p-4 overflow-y-auto">
          <div className="w-full max-w-2xl">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">SELECIONE OS PRODUTOS:</h2>
            <ProductGrid 
              products={products} 
              onProductClick={addToOrder}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Comanda à direita */}
        <div className="w-80 bg-white border-l-2 border-red-200">
          <OrderSummary
            currentOrder={currentOrder}
            totalAmount={getTotalAmount()}
            onUpdateItem={updateOrderItem}
            onFinalizeSale={() => setShowPaymentModal(true)}
            onCancelOrder={cancelOrder}
          />
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={finalizeSale}
        totalAmount={getTotalAmount()}
      />
    </div>
  );
}