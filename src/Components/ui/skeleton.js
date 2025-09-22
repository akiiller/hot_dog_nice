import React from 'react';

// Um componente simples para simular o "esqueleto" de carregamento
export function Skeleton({ style, ...props }) {
  const skeletonStyle = {
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    height: '20px',
    width: '100%',
    ...style,
  };
  return <div style={skeletonStyle} {...props} />;
}
