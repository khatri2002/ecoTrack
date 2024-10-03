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

export type NavItems = Array<{
  name: string;
  path: string;
  icon: React.ReactNode;
}>;

export type NumericCards = Array<{
  name: string;
  icon: React.ReactNode;
  key: string;
}>;
