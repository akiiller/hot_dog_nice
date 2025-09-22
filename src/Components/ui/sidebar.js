import React, { createContext, useContext, useState } from 'react';
import { Link } from 'react-router-dom';

// 1. Criação do Contexto da Sidebar
// O contexto vai guardar o estado (aberto/fechado) e compartilhar com todos os componentes filhos.
const SidebarContext = createContext();

// 2. Componente Provedor (Provider)
// Este componente vai "abraçar" a sidebar e gerenciar seu estado.
export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(true); // Por padrão, a sidebar começa aberta

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

// 3. Componente Principal da Sidebar
// É o container principal, que muda de tamanho se estiver fechado.
export function Sidebar({ children }) {
  const { isOpen } = useContext(SidebarContext);

  const style = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#fff',
    borderRight: '1px solid #e5e7eb',
    transition: 'width 0.3s ease-in-out',
    width: isOpen ? '250px' : '60px', // Muda a largura com base no estado
    overflow: 'hidden', // Esconde o conteúdo que não cabe quando fechado
  };

  return <aside style={style}>{children}</aside>;
}

// 4. Cabeçalho da Sidebar
// Ideal para colocar o logo ou nome do estabelecimento.
export function SidebarHeader({ children }) {
  return <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>{children}</div>;
}

// 5. Conteúdo Principal da Sidebar
// Ocupa o espaço restante e permite rolagem se o conteúdo for grande.
export function SidebarContent({ children }) {
  return <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1rem 0' }}>{children}</div>;
}

// 6. Grupo de Itens do Menu
// Ajuda a agrupar itens relacionados (ex: "Cadastros", "Relatórios").
export function SidebarGroup({ children }) {
  return <div style={{ marginBottom: '1rem' }}>{children}</div>;
}

// 7. Conteúdo do Grupo
// Onde a lista de menus (SidebarMenu) vai ficar.
export function SidebarGroupContent({ children }) {
  return <div>{children}</div>;
}

// 8. Menu (Lista)
// Funciona como um `<ul>` para os itens do menu.
export function SidebarMenu({ children }) {
  return <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>{children}</ul>;
}

// 9. Item do Menu (<li>)
// É o container para cada link/botão do menu.
export function SidebarMenuItem({ children }) {
  return <li style={{ margin: '0 0.5rem' }}>{children}</li>;
}

// 10. Botão/Link do Menu
// O item clicável, que pode ser um link de navegação.
export function SidebarMenuButton({ to, icon, children, active }) {
  const { isOpen } = useContext(SidebarContext);

  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '0.75rem',
    borderRadius: '0.375rem',
    textDecoration: 'none',
    transition: 'background-color 0.2s',
    cursor: 'pointer',
  };

  const activeStyle = active ? {
    backgroundColor: '#ef4444',
    color: 'white',
  } : {
    backgroundColor: 'transparent',
    color: '#374151',
  };

  const style = { ...baseStyle, ...activeStyle };

  return (
    <Link to={to} style={style}>
      {icon && <span style={{ marginRight: isOpen ? '0.75rem' : '0' }}>{icon}</span>}
      {isOpen && <span>{children}</span>}
    </Link>
  );
}

// 11. Gatilho (Trigger)
// Um botão para abrir/fechar a sidebar, geralmente usado no cabeçalho ou fora dela.
export function SidebarTrigger({ children }) {
  const { toggleSidebar } = useContext(SidebarContext);
  return <button onClick={toggleSidebar}>{children}</button>;
}

