import React, { useState, useEffect } from "react";
import { Ingredient } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, AlertTriangle } from "lucide-react";
import IngredientsList from "../components/ingredients/IngredientsList";
import IngredientForm from "../components/ingredients/IngredientForm";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadIngredients();
  }, []);

  const loadIngredients = async () => {
    setIsLoading(true);
    const data = await Ingredient.list("name");
    setIngredients(data);
    setIsLoading(false);
  };

  const handleSave = async (ingredientData) => {
    if (editingIngredient) {
      await Ingredient.update(editingIngredient.id, ingredientData);
    } else {
      await Ingredient.create(ingredientData);
    }
    
    setShowForm(false);
    setEditingIngredient(null);
    loadIngredients();
  };

  const handleEdit = (ingredient) => {
    setEditingIngredient(ingredient);
    setShowForm(true);
  };

  const handleDelete = async (ingredient) => {
    if (confirm(`Tem certeza que deseja excluir "${ingredient.name}"?`)) {
      await Ingredient.delete(ingredient.id);
      loadIngredients();
    }
  };

  const handleQuantityUpdate = async (ingredient, newQuantity) => {
    await Ingredient.update(ingredient.id, {
      ...ingredient,
      current_quantity: newQuantity
    });
    loadIngredients();
  };

  const filteredIngredients = ingredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = ingredients.filter(
    ingredient => ingredient.current_quantity <= ingredient.minimum_stock
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-red-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-red-600">CONTROLE DE ESTOQUE</h1>
              <p className="text-gray-600">Gerencie os insumos e matérias-primas</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowForm(true)}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Novo Insumo
              </Button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Pesquisar insumo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <Alert className="mb-6 border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Atenção!</strong> {lowStockItems.length} insumo(s) estão com estoque baixo ou crítico:
              <span className="ml-2 font-medium">
                {lowStockItems.map(item => item.name).join(", ")}
              </span>
            </AlertDescription>
          </Alert>
        )}

        {/* Ingredients List */}
        <IngredientsList
          ingredients={filteredIngredients}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onQuantityUpdate={handleQuantityUpdate}
          isLoading={isLoading}
        />

        {/* Form Modal */}
        {showForm && (
          <IngredientForm
            ingredient={editingIngredient}
            onSave={handleSave}
            onClose={() => {
              setShowForm(false);
              setEditingIngredient(null);
            }}
          />
        )}
      </div>
    </div>
  );
}