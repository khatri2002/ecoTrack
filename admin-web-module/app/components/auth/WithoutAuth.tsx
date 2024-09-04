import { redirect } from "next/navigation";

import { useAuthContext } from "@/app/context/AuthProvider";

export const WithoutAuth = (WrappedComponent: any) => {
  return function WithoutAuth(props: any) {
    const { isLoggedIn } = useAuthContext();

    if (isLoggedIn) {
      redirect("/");
    }

    return <WrappedComponent {...props} />;
  };
};
