
import React, { useState, useEffect } from "react";
import { ProductRecipe } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Package, ChefHat } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductList({ products, ingredients, onEdit, onDelete, isLoading }) {
  const [productRecipes, setProductRecipes] = useState({});

  useEffect(() => {
    const loadRecipes = async () => {
      const recipesData = {};
      for (const product of products) {
        const recipes = await ProductRecipe.filter({ product_id: product.id });
        recipesData[product.id] = recipes;
      }
      setProductRecipes(recipesData);
    };

    loadRecipes();
  }, [products]); // products is correctly identified as a dependency

  const getIngredientName = (ingredientId) => {
    const ingredient = ingredients.find(i => i.id === ingredientId);
    return ingredient?.name || "Insumo não encontrado";
  };

  const getIngredientUnit = (ingredientId) => {
    const ingredient = ingredients.find(i => i.id === ingredientId);
    return ingredient?.unit || "";
  };

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {products.map((product) => (
        <Card key={product.id} className="border-2 border-gray-200 hover:border-red-200 transition-all">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="w-5 h-5 text-red-500" />
                  {product.name}
                </CardTitle>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    R$ {product.price.toFixed(2)}
                  </Badge>
                  <Badge variant={product.active ? "default" : "secondary"}>
                    {product.active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(product)}
                  className="hover:bg-blue-50 hover:border-blue-300"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDelete(product)}
                  className="hover:bg-red-50 hover:border-red-300 text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border-t pt-3">
              <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <ChefHat className="w-4 h-4" />
                Composição do Produto (Receita):
              </h4>
              {productRecipes[product.id]?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {productRecipes[product.id].map((recipe, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3 border">
                      <div className="font-medium text-gray-700">
                        {getIngredientName(recipe.ingredient_id)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Qtd: {recipe.quantity} {getIngredientUnit(recipe.ingredient_id)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 italic">
                  Nenhuma receita definida
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {products.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Nenhum produto cadastrado</p>
        </div>
      )}
    </div>
  );
}
