import React, { useState, useEffect } from "react";

import Product from "../Entities/Product";
import ProductRecipe from "../Entities/ProductRecipe";
import Ingredient from "../Entities/Ingredient";

import { Button } from "../Components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "../Components/ui/input";
import ProductList from "../Components/products/ProductList";
import ProductForm from "../Components/products/ProductForm";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [productsData, ingredientsData] = await Promise.all([
      Product.list("-created_date"),
      Ingredient.list("name")
    ]);
    setProducts(productsData);
    setIngredients(ingredientsData);
    setIsLoading(false);
  };

  const handleSaveProduct = async (productData) => {
    if (editingProduct) {
      await Product.update(editingProduct.id, productData.product);
      
      // Remover receitas antigas
      const oldRecipes = await ProductRecipe.filter({ product_id: editingProduct.id });
      for (const recipe of oldRecipes) {
        await ProductRecipe.delete(recipe.id);
      }
    } else {
      const newProduct = await Product.create(productData.product);
      productData.product.id = newProduct.id;
    }

    // Salvar receitas
    for (const recipe of productData.recipes) {
      await ProductRecipe.create({
        product_id: productData.product.id,
        ingredient_id: recipe.ingredient_id,
        quantity: recipe.quantity
      });
    }

    setShowForm(false);
    setEditingProduct(null);
    loadData();
  };

  const handleEditProduct = async (product) => {
    const recipes = await ProductRecipe.filter({ product_id: product.id });
    setEditingProduct({ ...product, recipes });
    setShowForm(true);
  };

  const handleDeleteProduct = async (product) => {
    if (confirm(`Tem certeza que deseja excluir "${product.name}"?`)) {
      // Remover receitas
      const recipes = await ProductRecipe.filter({ product_id: product.id });
      for (const recipe of recipes) {
        await ProductRecipe.delete(recipe.id);
      }
      
      await Product.delete(product.id);
      loadData();
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-red-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-red-600">CADASTRO E EDIÇÃO DE PRODUTOS</h1>
              <p className="text-gray-600">Gerencie os produtos de venda</p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Pesquisar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Products List */}
        <ProductList
          products={filteredProducts}
          ingredients={ingredients}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          isLoading={isLoading}
        />

        {/* Product Form Modal */}
        {showForm && (
          <ProductForm
            product={editingProduct}
            ingredients={ingredients}
            onSave={handleSaveProduct}
            onClose={() => {
              setShowForm(false);
              setEditingProduct(null);
            }}
          />
        )}
      </div>
    </div>
  );
}