"use client";

import { redirect } from "next/navigation";

import { useAuthContext } from "./context/AuthProvider";

export default function Dashboard() {
  const { isLoggedIn, loading } = useAuthContext();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!isLoggedIn) {
    redirect("/login");
  }

  return (
    <>
      <h1>dashboard</h1>
    </>
  );
}
