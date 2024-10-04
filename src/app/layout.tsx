import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/sidebar";
export const metadata: Metadata = {
  title: "Taskify",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
