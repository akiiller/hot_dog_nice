import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TopProducts({ products, isLoading }) {
  if (isLoading) {
    return (
      <Card className="border-2 border-red-200">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <TrendingUp className="w-5 h-5" />
          PRODUTOS MAIS VENDIDOS (HOJE):
        </CardTitle>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>Nenhuma venda registrada ainda</p>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">
                      {item.product}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.quantity} vendido{item.quantity > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 font-bold">
                  {item.quantity}x
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}