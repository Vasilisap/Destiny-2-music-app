import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PlayerBar } from "@/components/layout/PlayerBar";
import YoutubePlayer from "@/components/player/YoutubePlayer";

const inter = Inter({
    subsets: ["latin"],
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
            <body className={inter.className}>
                <main className="min-h-screen bg-background pb-28">
                    {children}
                </main>

                <YoutubePlayer />
                <PlayerBar />
            </body>
        </html>
    );
}
