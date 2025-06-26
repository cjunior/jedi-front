export interface IPost {
  id: number;
  date: string;
  title: string;
  readingTime: string;
  imageDescription: string;
  description: string;
  imageUrl: string;
  iconUrl: string;
  author: string;
}

export interface IBlogResponse {
  id: number;
  title: string;
  items: IPost[];
}

export interface ICreatePost {
  title: string;
  author: string;
  readingTime: string;
  imageDescription: string;
  description: string;
  date: string;
  file: string;
  iconFile?: string;
}
