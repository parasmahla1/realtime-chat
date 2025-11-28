import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Real-Time Chat",
  description: "A simple real-time  chat application using Next.js and WebSockets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
