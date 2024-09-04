"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { getUser, instance } from "../lib/api";

type AuthProviderProps = {
  children: React.ReactNode;
};

type User = {
  id: number;
  username: string;
} | null;

type AuthContextValue = {
  loading: boolean;
  isLoggedIn: boolean;
  user: User;
  userIn: (access_token: string) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    let ignore = false;
    const token = localStorage.getItem("token");

    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      getUser()
        .then((user) => {
          if (!ignore) {
            setIsLoggedIn(true);
            setUser(user);
          }
        })
        .catch(() => {
          setIsLoggedIn(false);
        })
        .finally(() => {
          if (!ignore) setLoading(false);
        });
    } else setLoading(false);

    return () => {
      ignore = true;
    };
  }, []);

  const userIn = (access_token: string) => {
    setLoading(true);
    localStorage.setItem("token", access_token);
    instance.defaults.headers.common["Authorization"] =
      `Bearer ${access_token}`;
    getUser()
      .then((user) => {
        setIsLoggedIn(true);
        setUser(user);
      })
      .catch(() => {
        setIsLoggedIn(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, loading, userIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
};
