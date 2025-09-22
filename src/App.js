import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 1. Importe seus componentes principais
import Layout from './Components/Layout'; // Ajuste o caminho se for diferente
import PDV from './Pages/PDV'; // Ajuste o caminho se for diferente

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