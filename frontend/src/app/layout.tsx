import type { Metadata } from "next";
import "./globals.css";
import Layout from "./components/Layout";
import ReduxProvider from "./redux/ReduxProvider";

export const metadata: Metadata = {
  title: "",
  description: "A modern dashboard with Next.js, Tailwind CSS, and ShadCN",
};

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