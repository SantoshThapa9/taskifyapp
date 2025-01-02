import "./global.scss";
import Sidebar from "./components/sidebar";

export const metadata = {
  title: "Taskify",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <Sidebar />
        <main>{children}</main>
      </body>
    </html>
  );
}
