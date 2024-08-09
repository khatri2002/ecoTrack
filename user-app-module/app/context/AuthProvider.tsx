import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { set } from "react-hook-form";
import { getUser, instance } from "../lib/api";

type AuthProviderProps = {
  children: React.ReactNode;
};

type User = {
  name: string;
  email: string;
  phone: string;
};

type AuthContextValue = {
  loading: boolean;
  loggedIn: boolean;
  user: User | null;
  userIn: (token: string) => Promise<void>;
  userOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<String | null>(null);

  useEffect(() => {
    let ignore = false;

    SecureStore.getItemAsync("token")
      .then((token) => {
        if (token && !ignore) {
          setToken(token);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        throw error;
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (token) {
      // set header
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // get user
      getUser()
        .then((user) => {
          setLoggedIn(true);
          setUser(user);
        })
        .catch((error) => {
          throw error;
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      delete instance.defaults.headers.common["Authorization"];
      setLoggedIn(false);
    }

    return () => {};
  }, [token]);

  const userIn = async (token: string) => {
    // save token
    await SecureStore.setItemAsync("token", token);
    setToken(token);
  };

  const userOut = async () => {
    // remove token
    await SecureStore.deleteItemAsync("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        loggedIn,
        user,
        userIn,
        userOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuthContext = () => {
  const value = useContext(AuthContext);
  if (value === null)
    throw new Error('"useAuthContext" should be used within the AuthProvider!');
  return value;
};
