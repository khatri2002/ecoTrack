import ProtectedLayout from "./components/protected-layout/protected-layout";
import AuthProvider from "./context/AuthProvider";
import DashboardPage from "./pages/dashboard/dashboard";
import SignInPage from "./pages/sign-in/sign-in";

export const routes = [
  {
    path: "/",
    element: <AuthProvider />,
    children: [
      {
        path: "/sign-in",
        element: <SignInPage />,
      },
      {
        element: <ProtectedLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
        ],
      },
    ],
  },
];
