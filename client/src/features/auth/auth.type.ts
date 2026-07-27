export type LoginInput = {
  username: string;
  password: string;
};

export type AuthUser = {
  id: string;
  username: string;
  createdAt: string;
};

export type LoginResult = {
  user: AuthUser;
  token: string;
};
