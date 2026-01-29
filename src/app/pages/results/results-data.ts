export interface ResultFile {
  id: number;
  title: string;
  fileName: string;
  fileUrl: string;
  category: string;
}

export interface Pasta {
  id: number;
  nome: string;
  parentId: number | null;
  slug?: string;
  descricao?: string;
}

export interface Arquivo {
  id: number;
  nome: string;
  url: string;
  uploadedAt: string;
}
