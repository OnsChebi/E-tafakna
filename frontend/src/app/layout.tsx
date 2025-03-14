import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "./redux/ReduxProvider";
import Layout from "./components/Layout";



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="dark:bg-gray-900">
        <ReduxProvider>
          <Layout>{children}</Layout>
        </ReduxProvider>
      </body>
    </html>
  );
}