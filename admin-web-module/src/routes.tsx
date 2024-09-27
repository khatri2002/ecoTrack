import DashboardPage from "./pages/dashboard/dashboard";
import SignInPage from "./pages/sign-in/sign-in";
import AuthProvider from "./context/AuthProvider";
import ProtectedLayout from "./components/ProtectedLayout";

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
