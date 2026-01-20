import { environment } from '../../../environments/environment';

/**
 * Substitui o domínio localhost nas URLs de imagens pelo domínio configurado no environment
 * @param url URL que pode conter localhost:8090 ou outro domínio local
 * @returns URL com o domínio correto do environment
 */
export function transformImageUrl(url: string | null | undefined): string {
  if (!url) {
    return '';
  }

  // Remove a barra final do imageBaseUrl se existir
  const baseUrl = environment.imageBaseUrl.replace(/\/$/, '');
  
  // Padrões comuns de localhost que o backend pode retornar
  const localhostPatterns = [
    /^http:\/\/localhost:\d+/,
    /^https?:\/\/127\.0\.0\.1:\d+/,
    /^https?:\/\/0\.0\.0\.0:\d+/
  ];

  // Verifica se a URL contém algum padrão de localhost
  for (const pattern of localhostPatterns) {
    if (pattern.test(url)) {
      // Extrai o caminho após o domínio localhost
      const urlObj = new URL(url);
      const path = urlObj.pathname + urlObj.search + urlObj.hash;
      
      // Retorna a URL com o domínio correto
      return `${baseUrl}${path}`;
    }
  }

  // Se não for localhost, retorna a URL original
  return url;
}
