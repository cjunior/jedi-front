import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BlobConverterService {
  /**
   * Converte um blob em uma URL segura e abre o arquivo em nova aba.
   * Ideal para arquivos PDF, imagens, etc.
   */
  openBlobInNewTab(blob: Blob): void {
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  }

  /**
   * Converte um blob em uma URL segura e força o download do arquivo.
   * @param blob Blob recebido (ex: PDF, imagem)
   * @param filename Nome do arquivo com extensão (ex: 'relatorio.pdf')
   */
  downloadBlob(blob: Blob, filename: string): void {
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(blobUrl);
  }

  /**
   * Converte um blob para base64 (caso precise mostrar inline em `<img>`, por exemplo)
   * Retorna uma Promise com a string base64.
   */
  async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
