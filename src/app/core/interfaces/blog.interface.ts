export interface IBlog {
  date: string;
  title: string;
  readindTime: string;
  imageDescription: string;
  imageUrl: string;
  author: string;
}

export interface IBlogResponse {
  id: number;
  title: string;
  items: IBlog[];
}
