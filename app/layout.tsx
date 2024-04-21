// Import statements with absolute paths
import { Inter } from "next/font/google";
import { Metadata } from "next";

// Import statements with relative paths
import Providers from "../components/Providers";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/NavBar/Footer";

// CSS import
import "./globals.css";

require("@/schedulers/leaderboardScheduler.js");
require("@/schedulers/problemDurationCheck.js");

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
      <body>
        <div className="flex flex-col min-h-screen">
          <NavBar />
          <Providers>{children}</Providers>
          <Footer />
        </div>
      </body>
    </html>
  );
}
