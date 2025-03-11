import "./globals.css";
import Layout from "./main/Layout";
import ReduxProvider from "./redux/ReduxProvider";



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="dark:bg-gray-900">
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}