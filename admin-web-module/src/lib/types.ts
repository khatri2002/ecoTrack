export type SignInInputs = {
  username: string;
  password: string;
};

export type User = {
  id: number;
  username: string;
} | null;

export type AuthContextValue = {
  loading: boolean;
  loggedIn: boolean;
  user: User;
  signInAction: (token: string) => void;
  signOutAction: () => void;
};
