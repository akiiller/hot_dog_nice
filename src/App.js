import React from 'react';
import { Routes, Route } from "react-router-dom";
import PDV from "./Pages/PDV";
import Products from "./Pages/Products";
import Ingredients from "./Pages/Ingredients";
import Reports from "./Pages/Reports";
import Layout from "./Components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/PDV" element={<PDV />} />
          <Route path="/Products" element={<Products />} />
          <Route path="/Ingredients" element={<Ingredients />} />
          <Route path="/Reports" element={<Reports />} />
          {/* Adicione outras rotas se necessário */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

// Importe outras páginas que você venha a ter
// import ProductsPage from './Pages/ProductsPage'; 
// import IngredientsPage from './Pages/IngredientsPage';

// Opcional: Importe o CSS global se houver um
import './App.css'; 

function App() {
  return (
    <BrowserRouter>
      {/* O Layout é o componente que tem a sua barra lateral e cabeçalho */}
      <Layout>
        <Routes>
          {/* Esta rota faz com que a página inicial (/)
            carregue o componente da página de PDV.
          */}
          <Route path="/" element={<PDV />} />

          {/* Você pode adicionar outras rotas aqui no futuro.
            Por exemplo:
            <Route path="/produtos" element={<ProductsPage />} />
            <Route path="/insumos" element={<IngredientsPage />} />
          */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;