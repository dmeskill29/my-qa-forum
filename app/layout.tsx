// Import statements with absolute and relative paths organized
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "../components/Providers";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer"; // Use consistent import paths
import "./globals.css"; // Keep CSS imports last for clarity

// Initializing the Inter font with specific subsets
const inter = Inter({ subsets: ["latin"] });

// Metadata for the application, specifying types explicitly for clarity
export const metadata: Metadata = {
  title: "SolveCircle",
  description: "Solving Problems for the World",
};

// RootLayout component definition with explicit React.ReactNode type for children
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <NavBar />
          <Providers>{children}</Providers>
          <Footer />
        </div>
      </body>
    </html>
  );
}
