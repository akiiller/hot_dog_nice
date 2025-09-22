
import React, { useState, useEffect } from "react";
import { Sale, SaleItem, Product } from "@/entities/all";
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import RevenueCards from "../components/reports/RevenueCards";
import TopProducts from "../components/reports/TopProducts";
import SalesHistory from "../components/reports/SalesHistory";

const periods = [
  { id: "today", label: "Hoje" },
  { id: "week", label: "Esta Semana" },
  { id: "month", label: "Este Mês" }
];

export default function Reports() {
  const [sales, setSales] = useState([]);
  const [saleItems, setSaleItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Filter data by period - for now we show all data
    // This could be implemented to actually filter by date ranges
    const now = new Date();
    let startDate, endDate;

    switch (selectedPeriod) {
      case "today":
        startDate = startOfDay(now);
        endDate = endOfDay(now);
        break;
      case "week":
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        endDate = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case "month":
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      default:
        startDate = startOfDay(now);
        endDate = endOfDay(now);
    }

    // Filter logic could be implemented here when needed
    // For example:
    // const filteredSales = sales.filter(sale => sale.sale_time >= startDate && sale.sale_time <= endDate);
    // setFilteredSales(filteredSales);
  }, [selectedPeriod]); // `selectedPeriod` is the only dependency needed here.

  const loadData = async () => {
    setIsLoading(true);
    const [salesData, saleItemsData, productsData] = await Promise.all([
      Sale.list("-sale_time"),
      SaleItem.list("-created_date"),
      Product.list()
    ]);
    
    setSales(salesData);
    setSaleItems(saleItemsData);
    setProducts(productsData);
    setIsLoading(false);
  };

  const calculateMetrics = () => {
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total_amount, 0);
    const totalSales = sales.length;
    const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

    return {
      totalRevenue,
      totalSales,
      averageTicket
    };
  };

  const getTopProducts = () => {
    const productCounts = {};
    
    saleItems.forEach(item => {
      productCounts[item.product_id] = (productCounts[item.product_id] || 0) + item.quantity;
    });

    return Object.entries(productCounts)
      .map(([productId, quantity]) => {
        const product = products.find(p => p.id === productId);
        return {
          product: product?.name || "Produto não encontrado",
          quantity
        };
      })
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  };

  const getSalesHistory = () => {
    return sales.slice(0, 10).map(sale => {
      const items = saleItems.filter(item => item.sale_id === sale.id);
      const itemsText = items.map(item => {
        const product = products.find(p => p.id === item.product_id);
        return `${item.quantity}x ${product?.name || "Produto"}`;
      }).join(", ");

      return {
        ...sale,
        itemsText
      };
    });
  };

  const metrics = calculateMetrics();
  const topProducts = getTopProducts();
  const salesHistory = getSalesHistory();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-red-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-red-600">RELATÓRIO DE VENDAS</h1>
              <p className="text-gray-600">Acompanhe o desempenho do seu negócio</p>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Período:</span>
            </div>
          </div>

          <div className="mt-4">
            <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <TabsList className="bg-red-50 border border-red-200">
                {periods.map((period) => (
                  <TabsTrigger
                    key={period.id}
                    value={period.id}
                    className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
                  >
                    {period.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Revenue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <RevenueCards
            totalRevenue={metrics.totalRevenue}
            totalSales={metrics.totalSales}
            averageTicket={metrics.averageTicket}
            isLoading={isLoading}
          />
        </div>

        {/* Top Products and Sales History */}
        <div className="grid lg:grid-cols-2 gap-6">
          <TopProducts products={topProducts} isLoading={isLoading} />
          <SalesHistory sales={salesHistory} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
