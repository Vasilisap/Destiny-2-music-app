import type { Metadata } from "next";
import { Inter, Chakra_Petch } from "next/font/google";
import "./globals.css";
import { PlayerBar } from "@/components/layout/PlayerBar";
import YoutubePlayer from "@/components/player/YoutubePlayer";
import Navbar from "@/components/layout/Navbar";
import FavoritesHydrator from "@/components/layout/FavoritesHydrator";

const inter = Inter({
  subsets: ["latin"],
});

// Display face for headings only — a geometric, slightly technical sans
// that reads as "HUD" next to Inter's plain body text. Exposed as a CSS
// variable and wired to the --font-heading token in globals.css, which
// h1/h2/h3 pick up automatically (see the @layer base rule there).
const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Destiny 2 Music App",
  description: "Discover the music of Destiny 2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${chakraPetch.variable}`}>
        <FavoritesHydrator />
        <Navbar />
        <main className="min-h-screen bg-background pb-28">{children}</main>

        <YoutubePlayer />
        <PlayerBar />
      </body>
    </html>
  );
}
