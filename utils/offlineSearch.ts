import Fuse from 'fuse.js';
import lawsData from '@/assets/json/laws.json';

export interface Law {
  categoria: string;
  lei: string;
  texto: string;
}

// Configuração do Fuse.js para busca inteligente
const fuseOptions = {
  keys: ['lei', 'texto', 'categoria'],
  threshold: 0.4, // Quanto menor, mais precisa a busca (0 = exato, 1 = qualquer coisa)
  includeScore: true,
  minMatchCharLength: 3,
};

const fuse = new Fuse(lawsData as Law[], fuseOptions);

/**
 * Busca leis na base local usando Fuse.js
 * @param query - Termo de busca
 * @param limit - Número máximo de resultados (padrão: 5)
 * @returns Array de leis encontradas
 */
export function searchLaws(query: string, limit: number = 5): Law[] {
  if (!query || query.trim().length < 3) {
    return [];
  }

  const results = fuse.search(query, { limit });
  return results.map((result) => result.item);
}

/**
 * Busca leis por categoria
 * @param categoria - Nome da categoria
 * @returns Array de leis da categoria
 */
export function searchByCategory(categoria: string): Law[] {
  return (lawsData as Law[]).filter(
    (law) => law.categoria.toLowerCase() === categoria.toLowerCase()
  );
}

/**
 * Obtém todas as categorias disponíveis
 * @returns Array de categorias únicas
 */
export function getCategories(): string[] {
  const categories = (lawsData as Law[]).map((law) => law.categoria);
  return [...new Set(categories)].sort();
}

/**
 * Obtém uma lei aleatória (útil para sugestões)
 * @returns Uma lei aleatória
 */
export function getRandomLaw(): Law {
  const randomIndex = Math.floor(Math.random() * lawsData.length);
  return lawsData[randomIndex] as Law;
}
