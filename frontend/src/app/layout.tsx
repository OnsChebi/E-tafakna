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
      <body className="dark:bg-gray-900 bg-gray-100">
        <ReduxProvider>
          <Layout>{children}</Layout>
        </ReduxProvider>
      </body>
    </html>
  );
}