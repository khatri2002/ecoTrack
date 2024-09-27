import { useAuth } from "../../context/AuthProvider";

const DashboardPage = () => {
  const { user, signOutAction } = useAuth();
  if (user == null) console.log("user is null!");
  return (
    <>
      <h1>dashboard</h1>
      <h1>{user?.id}</h1>
      <h1>{user?.username}</h1>
      <button onClick={signOutAction}>logout</button>
    </>
  );
};

export default DashboardPage;
