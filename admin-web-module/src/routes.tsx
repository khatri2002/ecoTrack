import { Routes } from "./lib/types";
import DashboardPage from "./pages/dashboard/dashboard";
import SignInPage from "./pages/sign-in/sign-in";

export const routes: Routes = [
  {
    path: "/sign-in",
    element: <SignInPage />,
  },
  {
    path: "/",
    element: <DashboardPage />,
  },
];
