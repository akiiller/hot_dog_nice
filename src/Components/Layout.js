import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "../utils.js";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "./ui/sidebar";
import { ShoppingCart, Package, Beef, BarChart3, Store } from "lucide-react";



const navigationItems = [
  {
    title: "PDV",
    url: createPageUrl("PDV"),
    icon: ShoppingCart,
    color: "text-green-600"
  },
  {
    title: "Produtos",
    url: createPageUrl("Products"),
    icon: Package,
    color: "text-blue-600"
  },
  {
    title: "Insumos",
    url: createPageUrl("Ingredients"),
    icon: Beef,
    color: "text-orange-600"
  },
  {
    title: "Relatórios",
    url: createPageUrl("Reports"),
    icon: BarChart3,
    color: "text-purple-600"
  }
];

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar className="border-r-2 border-red-200 bg-white">
          <SidebarHeader className="border-b-2 border-red-200 p-6 bg-gradient-to-r from-red-500 to-red-600">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Store className="w-7 h-7 text-red-500" />
              </div>
              <div className="text-white">
                <h1 className="text-xl font-bold">Hot-dog da Nice</h1>
                <p className="text-red-100 text-sm">Sistema de Gestão</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`rounded-xl p-4 transition-all duration-200 hover:bg-red-50 hover:scale-105 ${
                          location.pathname === item.url 
                            ? 'bg-red-50 border-2 border-red-200 shadow-md' 
                            : 'hover:border border-gray-200'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-4">
                          <item.icon className={`w-6 h-6 ${item.color}`} />
                          <span className="font-semibold text-gray-700">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white border-b-2 border-red-200 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-red-50 p-2 rounded-lg" />
              <h1 className="text-xl font-bold text-red-600">Hot-dog da Nice</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}