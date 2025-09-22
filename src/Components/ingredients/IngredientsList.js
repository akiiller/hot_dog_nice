import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Beef, AlertCircle, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function IngredientsList({ 
  ingredients, 
  onEdit, 
  onDelete, 
  onQuantityUpdate, 
  isLoading 
}) {
  const getStatusInfo = (ingredient) => {
    const { current_quantity, minimum_stock } = ingredient;
    
    if (current_quantity === 0) {
      return { 
        status: "CRÍTICO", 
        color: "bg-red-100 text-red-800 border-red-200",
        icon: AlertCircle,
        iconColor: "text-red-500"
      };
    } else if (current_quantity <= minimum_stock) {
      return { 
        status: "BAIXO", 
        color: "bg-amber-100 text-amber-800 border-amber-200",
        icon: AlertCircle,
        iconColor: "text-amber-500"
      };
    } else {
      return { 
        status: "OK", 
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        iconColor: "text-green-500"
      };
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(5).fill(0).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex justify-between">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-6 w-20" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-8 w-32" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-red-200 overflow-hidden">
      {/* Table Header */}
      <div className="bg-gray-50 px-6 py-4 border-b-2 border-gray-200">
        <div className="grid grid-cols-12 gap-4 font-semibold text-gray-600 text-sm">
          <div className="col-span-3">Nome do Insumo</div>
          <div className="col-span-2">Qtd. Atual</div>
          <div className="col-span-2">Estoque Mínimo</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Ajustar Quantidade</div>
          <div className="col-span-1">Ações</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {ingredients.map((ingredient) => {
          const statusInfo = getStatusInfo(ingredient);
          const StatusIcon = statusInfo.icon;
          
          return (
            <div key={ingredient.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Name */}
                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    <Beef className="w-4 h-4 text-orange-500" />
                    <span className="font-medium text-gray-700">
                      {ingredient.name}
                    </span>
                  </div>
                </div>

                {/* Current Quantity */}
                <div className="col-span-2">
                  <span className="font-semibold text-gray-700">
                    {ingredient.current_quantity} {ingredient.unit}
                  </span>
                </div>

                {/* Minimum Stock */}
                <div className="col-span-2">
                  <span className="text-gray-600">
                    {ingredient.minimum_stock} {ingredient.unit}
                  </span>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <Badge className={`${statusInfo.color} border flex items-center gap-1 w-fit`}>
                    <StatusIcon className={`w-3 h-3 ${statusInfo.iconColor}`} />
                    {statusInfo.status}
                  </Badge>
                </div>

                {/* Quantity Adjustment */}
                <div className="col-span-2">
                  <Input
                    type="number"
                    min="0"
                    step="0.001"
                    placeholder="Nova qtd"
                    className="w-full"
                    onBlur={(e) => {
                      const newValue = parseFloat(e.target.value);
                      if (!isNaN(newValue) && newValue >= 0) {
                        onQuantityUpdate(ingredient, newValue);
                        e.target.value = "";
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const newValue = parseFloat(e.target.value);
                        if (!isNaN(newValue) && newValue >= 0) {
                          onQuantityUpdate(ingredient, newValue);
                          e.target.value = "";
                        }
                      }
                    }}
                  />
                </div>

                {/* Actions */}
                <div className="col-span-1">
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 hover:bg-blue-50 hover:border-blue-300"
                      onClick={() => onEdit(ingredient)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 hover:bg-red-50 hover:border-red-300 text-red-600"
                      onClick={() => onDelete(ingredient)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {ingredients.length === 0 && (
          <div className="text-center py-12">
            <Beef className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Nenhum insumo cadastrado</p>
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          * Status é destacado por cores: <span className="text-green-600 font-medium">OK (Verde)</span>, 
          <span className="text-amber-600 font-medium"> BAIXO (Amarelo)</span>, 
          <span className="text-red-600 font-medium"> CRÍTICO (Vermelho)</span>
        </p>
      </div>
    </div>
  );
}