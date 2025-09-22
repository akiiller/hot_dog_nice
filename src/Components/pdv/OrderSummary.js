import React from "react";
import { Button } from "../ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function OrderSummary({ 
  currentOrder, 
  totalAmount, 
  onUpdateItem, 
  onFinalizeSale, 
  onCancelOrder 
}) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b-2 border-red-200">
        <h2 className="text-lg font-bold text-red-600">COMANDA ATUAL</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {currentOrder.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <p>Nenhum item selecionado</p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentOrder.map((item) => (
              <div key={item.product.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-700 text-sm leading-tight">
                    {item.product.name}
                  </h3>
                  <button
                    onClick={() => onUpdateItem(item.product.id, 0)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateItem(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-lg min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateItem(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      R$ {item.product.price.toFixed(2)}/un
                    </div>
                    <div className="font-bold text-red-600">
                      R$ {item.subtotal.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t-2 border-red-200 bg-white">
        <div className="mb-4">
          <div className="flex justify-between items-center text-xl font-bold text-red-600">
            <span>TOTAL:</span>
            <span>R$ {totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            onClick={onFinalizeSale}
            disabled={currentOrder.length === 0}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-bold"
          >
            FINALIZAR VENDA
          </Button>
          <Button
            onClick={onCancelOrder}
            disabled={currentOrder.length === 0}
            variant="outline"
            className="w-full border-red-300 text-red-600 hover:bg-red-50 py-2"
          >
            CANCELAR VENDA
          </Button>
        </div>
      </div>
    </div>
  );
}