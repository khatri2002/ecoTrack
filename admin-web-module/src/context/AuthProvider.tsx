import { createContext, useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import * as api from "../lib/api";
import { AuthContextValue, User } from "../lib/types";
import * as utils from "../lib/utils";

const AuthContext = createContext<AuthContextValue | null>(null);

const AuthProvider = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      utils.setAuthToken(token);
      api
        .getUser()
        .then((user) => {
          setUser(user);
          setLoggedIn(true);
        })
        .catch(() => {
          utils.removeAuthToken();
          localStorage.removeItem("token");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const signInAction = (token: string) => {
    utils.setAuthToken(token);
    api
      .getUser()
      .then((user) => {
        setUser(user);
        localStorage.setItem("token", token);
        setLoggedIn(true);
        navigate("/", { replace: true });
      })
      .catch(() => {
        utils.removeAuthToken();
      });
  };

  const signOutAction = () => {
    localStorage.removeItem("token");
    utils.removeAuthToken();
    setLoggedIn(false);
    navigate("/sign-in", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{ loading, loggedIn, user, signInAction, signOutAction }}
    >
      <Outlet />
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (value === null)
    throw new Error('"useAuth" should be used within the AuthProvider!');
  return value;
};
