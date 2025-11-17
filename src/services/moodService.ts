import { listMoods } from '../repositories/moodRepo';

// Adicione os parâmetros de página e limite
export function listarMoods(page: number, limit: number) {
  return listMoods(page, limit);
}