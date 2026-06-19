export interface Tags {
  _id: string;
  name: string;
}

export interface Author {
  _id: string;
  name: string;
  image?: string;
}

export interface Question {
  _id: string;
  title: string;
  description: string;
  tags: Tags[];
  author: Author;
  upvotes: number;
  answers: number;
  views: number;
  createdAt: Date;
}
