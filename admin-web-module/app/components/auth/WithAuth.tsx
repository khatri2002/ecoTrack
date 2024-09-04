"use client";

import { redirect } from "next/navigation";

import { useAuthContext } from "../../context/AuthProvider";
import Loading from "../Loading";

export const WithAuth = (WrappedComponent: any) => {
  return function WithAuth(props: any) {
    const { loading, isLoggedIn } = useAuthContext();

    if (loading) {
      return <Loading />;
    }
    if (!isLoggedIn) {
      redirect("/login");
    }

    return <WrappedComponent {...props} />;
  };
};
