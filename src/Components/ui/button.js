import React from 'react';

// Um botão simples que repassa os estilos e eventos
export function Button({ children, ...props }) {
  return (
    <button {...props}>
      {children}
    </button>
  );
}
