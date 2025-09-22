import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { CreditCard, Banknote, Smartphone } from "lucide-react";

const paymentMethods = [
  { id: "dinheiro", label: "Dinheiro", icon: Banknote, color: "bg-green-500 hover:bg-green-600" },
  { id: "pix", label: "PIX", icon: Smartphone, color: "bg-blue-500 hover:bg-blue-600" },
  { id: "cartao", label: "Cartão", icon: CreditCard, color: "bg-purple-500 hover:bg-purple-600" }
];

export default function PaymentModal({ isOpen, onClose, onConfirm, totalAmount }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-red-600">
            Método de Pagamento
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="text-center mb-6">
            <div className="text-2xl font-bold text-gray-700">
              Total: R$ {totalAmount.toFixed(2)}
            </div>
          </div>

          <div className="grid gap-3">
            {paymentMethods.map((method) => (
              <Button
                key={method.id}
                onClick={() => onConfirm(method.id)}
                className={`${method.color} text-white p-4 h-auto flex items-center gap-3 text-lg font-semibold`}
              >
                <method.icon className="w-6 h-6" />
                {method.label}
              </Button>
            ))}
          </div>

          <Button
            onClick={onClose}
            variant="outline"
            className="w-full mt-4 border-red-300 text-red-600 hover:bg-red-50"
          >
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}