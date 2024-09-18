import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner"
import { GlobalStateProvider } from "./context/globalContext";
import Navbar from "@/components/Navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Lost and Found",
  description: "FInding lost things",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 font-outFit`}
      >
        <Toaster richColors position="top-right" />
        <GlobalStateProvider>
          <main className="min-h-svh flex flex-col">

            <Navbar />
            {children}
          </main>
        </GlobalStateProvider>

      </body>
    </html>
  );
}
