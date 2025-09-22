// import React from 'react';

// Componentes simples para simular uma caixa de diálogo (modal)
// Estilos inline para simplicidade, podem ser substituídos por CSS/Tailwind
const dialogOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 50,
};

const dialogContentStyle = {
  backgroundColor: 'white',
  padding: '2rem',
  borderRadius: '0.5rem',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  minWidth: '300px',
  maxWidth: '500px',
};

export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;
  return <div onClick={() => onOpenChange(false)} style={dialogOverlayStyle}>{children}</div>;
}

export function DialogContent({ children, className }) {
  // Evita que o clique dentro do conteúdo feche o modal
  return <div onClick={(e) => e.stopPropagation()} style={dialogContentStyle} className={className}>{children}</div>;
}

export function DialogHeader({ children }) {
  return <div style={{ marginBottom: '1rem' }}>{children}</div>;
}

export function DialogTitle({ children, className }) {
  return <h2 className={className}>{children}</h2>;
}

export function DialogFooter({ children }) {
  return <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>{children}</div>;
}

