// src/utils/index.js
// Por enquanto, este arquivo pode ficar vazio.
// No futuro, você pode colocar aqui funções úteis que se repetem pelo projeto,
// como funções para formatar moeda, validar dados, etc.


/**
 * Cria uma URL de página padronizada.
 * Garante que o caminho comece com uma barra (/) e remove barras extras.
 * Exemplo: createPageUrl('pdv') => '/pdv'
 * @param {string} path - O caminho da página.
 * @returns {string} O caminho formatado da URL.
 */
export const createPageUrl = (path) => {
  // Remove qualquer barra no início ou no fim do texto
  const cleanedPath = path.replace(/^\/+|\/+$/g, '');
  // Adiciona uma única barra no início
  return `/${cleanedPath}`;
};

// Você pode adicionar funções utilitárias aqui no futuro.