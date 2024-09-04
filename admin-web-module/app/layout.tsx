import "@/styles/globals.css";
import { Inter } from "next/font/google";

import AuthProvider from "./context/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className={inter.className} suppressHydrationWarning={true}>
        <AuthProvider>
          <div className="bg-slate-200">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
