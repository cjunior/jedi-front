/**
 * Gera um slug amigável a partir do nome da pasta
 * Remove palavras comuns como "Resultados", "Pasta", etc.
 * e normaliza para formato URL-friendly
 */
export function generateSlugFromNome(nome: string): string {
  if (!nome) {
    return '';
  }

  // Palavras comuns a serem removidas (case-insensitive)
  const palavrasComuns = ['resultados', 'resultado', 'pasta', 'pastas', 'arquivo', 'arquivos'];
  
  // Converte para minúsculas e remove palavras comuns
  let slug = nome.toLowerCase().trim();
  
  // Remove palavras comuns do início e fim
  palavrasComuns.forEach(palavra => {
    const regexInicio = new RegExp(`^${palavra}\\s+`, 'i');
    const regexFim = new RegExp(`\\s+${palavra}$`, 'i');
    slug = slug.replace(regexInicio, '').replace(regexFim, '');
  });

  // Remove espaços extras e normaliza
  slug = slug.trim();
  
  // Substitui espaços e caracteres especiais por hífens
  slug = slug
    .normalize('NFD') // Normaliza caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .replace(/^-+|-+$/g, ''); // Remove hífens do início e fim

  return slug || 'pasta'; // Fallback se ficar vazio
}

/**
 * Converte slug de volta para ID (quando necessário para compatibilidade)
 * ou busca pasta por slug
 */
export function slugToId(slug: string, pastas: Array<{ id: number; slug?: string; nome: string }>): number | null {
  // Se o slug é numérico, pode ser um ID legado
  const numericId = parseInt(slug, 10);
  if (!isNaN(numericId)) {
    return numericId;
  }

  // Busca por slug
  const pasta = pastas.find(p => p.slug === slug || generateSlugFromNome(p.nome) === slug);
  return pasta?.id || null;
}
