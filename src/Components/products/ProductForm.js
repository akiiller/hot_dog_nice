import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Save, X } from "lucide-react";

export default function ProductForm({ product, ingredients, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    active: true
  });
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price || "",
        active: product.active !== false
      });
      setRecipes(product.recipes || []);
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
      alert("Nome e preço são obrigatórios");
      return;
    }

    onSave({
      product: {
        ...formData,
        price: parseFloat(formData.price),
        id: product?.id
      },
      recipes
    });
  };

  const addRecipe = () => {
    setRecipes([...recipes, { ingredient_id: "", quantity: "" }]);
  };

  const updateRecipe = (index, field, value) => {
    const newRecipes = [...recipes];
    newRecipes[index] = { ...newRecipes[index], [field]: value };
    setRecipes(newRecipes);
  };

  const removeRecipe = (index) => {
    setRecipes(recipes.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-red-600">
            {product ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Product Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Hot-Dog Completo"
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Preço de Venda (R$) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="12,00"
                required
              />
            </div>
          </div>

          {/* Recipe Section */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Composição do Produto (Receita para baixa de estoque):
              </h3>
              <Button
                type="button"
                onClick={addRecipe}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <Plus className="w-4 h-4 mr-1" />
                Adicionar
              </Button>
            </div>

            {recipes.length === 0 ? (
              <div className="text-center py-4 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                Nenhum insumo adicionado
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-2 text-sm font-semibold text-gray-600 px-2">
                  <div className="col-span-5">Insumo Cadastrado</div>
                  <div className="col-span-3">Quantidade</div>
                  <div className="col-span-3">Ação</div>
                </div>
                
                {recipes.map((recipe, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center p-2 bg-gray-50 rounded-lg">
                    <div className="col-span-5">
                      <Select
                        value={recipe.ingredient_id}
                        onValueChange={(value) => updateRecipe(index, "ingredient_id", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o insumo" />
                        </SelectTrigger>
                        <SelectContent>
                          {ingredients.map((ingredient) => (
                            <SelectItem key={ingredient.id} value={ingredient.id}>
                              {ingredient.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        step="0.001"
                        min="0"
                        value={recipe.quantity}
                        onChange={(e) => updateRecipe(index, "quantity", parseFloat(e.target.value) || 0)}
                        placeholder="1"
                      />
                    </div>
                    <div className="col-span-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeRecipe(index)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="col-span-1 text-xs text-gray-500">
                      {ingredients.find(i => i.id === recipe.ingredient_id)?.unit || ""}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-red-500 hover:bg-red-600"
            >
              <Save className="w-4 h-4 mr-2" />
              {product ? "Atualizar" : "Salvar"} Produto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}