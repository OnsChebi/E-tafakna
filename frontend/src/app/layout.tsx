import type { Metadata } from "next";
import "./globals.css"; // Ensure Tailwind is imported
import MeetsDashboard from "./pages/MeetsDashboard";
import Layout from "./components/Layout";


export const metadata: Metadata = {
  title: "Dashboard",
  description: "A modern dashboard with Next.js, Tailwind CSS, and ShadCN",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 dark:bg-gray-900">
        <Layout>{<MeetsDashboard></MeetsDashboard>}</Layout>
        
      </body>
    </html>
  );
}
