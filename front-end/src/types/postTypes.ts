import { RefObject } from "react";

export interface Post {
  postId: number;
  userName: string;
  userId: number;
  locId: number;
  postTitle: string;
  postContent: string;
  replies: Reply[];
  categories: Category[];
  createdAt: string;
}

export interface Reply {
  replyId: number;
  userId: number;
  postId: number;
  userName: string;
  replyContent: string;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface PostToCreate {
  locId: number;
  title: string;
  content: string;
  categories: number[];
}

export interface ReplyToCreate {
  postId: number;
  content: string;
}

export type FetchError = {
  message: string;
};

export type RefMap = Record<string, RefObject<HTMLDivElement>>;
