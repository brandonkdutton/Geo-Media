export interface User {
  userId: number;
  cognitoSub: string;
  username: string;
  email: string;
  emailVerified: boolean;
}

export type Session = {
  user: User | null;
  pending: boolean;
};

export interface FetchError {
  message: string;
}
