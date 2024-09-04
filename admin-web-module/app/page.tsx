"use client";

import { WithAuth } from "./components/auth/WithAuth";
import { useAuthContext } from "./context/AuthProvider";

const Dashboard = () => {
  const { user } = useAuthContext();

  return (
    <>
      <h1>dashboard</h1>
      <p>id: {user!.id}</p>
      <p>username: {user!.username}</p>
    </>
  );
};

export default WithAuth(Dashboard);
