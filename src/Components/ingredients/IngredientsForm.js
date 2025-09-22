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
import { Save, X } from "lucide-react";

const units = [
  { value: "un", label: "Unidade" },
  { value: "kg", label: "Quilograma" },
  { value: "g", label: "Grama" },
  { value: "L", label: "Litro" },
  { value: "ml", label: "Mililitro" },
  { value: "pacote", label: "Pacote" },
  { value: "pote", label: "Pote" }
];

export default function IngredientForm({ ingredient, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    current_quantity: "",
    unit: "un",
    minimum_stock: ""
  });

  useEffect(() => {
    if (ingredient) {
      setFormData({
        name: ingredient.name || "",
        current_quantity: ingredient.current_quantity || "",
        unit: ingredient.unit || "un",
        minimum_stock: ingredient.minimum_stock || ""
      });
    }
  }, [ingredient]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || formData.current_quantity === "" || formData.minimum_stock === "") {
      alert("Todos os campos são obrigatórios");
      return;
    }

    onSave({
      ...formData,
      current_quantity: parseFloat(formData.current_quantity),
      minimum_stock: parseFloat(formData.minimum_stock)
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">
            {ingredient ? "Editar Insumo" : "Novo Insumo"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Insumo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Pão de Hot-Dog"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="current_quantity">Quantidade Atual *</Label>
              <Input
                id="current_quantity"
                type="number"
                step="0.001"
                min="0"
                value={formData.current_quantity}
                onChange={(e) => setFormData({ ...formData, current_quantity: e.target.value })}
                placeholder="15"
                required
              />
            </div>
            <div>
              <Label htmlFor="unit">Unidade de Medida *</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => setFormData({ ...formData, unit: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="minimum_stock">Estoque Mínimo *</Label>
            <Input
              id="minimum_stock"
              type="number"
              step="0.001"
              min="0"
              value={formData.minimum_stock}
              onChange={(e) => setFormData({ ...formData, minimum_stock: e.target.value })}
              placeholder="20"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Quantidade mínima para gerar alertas
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" className="bg-red-500 hover:bg-red-600">
              <Save className="w-4 h-4 mr-2" />
              {ingredient ? "Atualizar" : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}