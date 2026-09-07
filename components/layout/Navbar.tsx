"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import TrackSearch from "../search/TrackSearch";
import { Button } from "../ui/button";

const links = [
  {
    href: "/",
    label: "Library",
  },
  {
    href: "/favorites",
    label: "Favorites",
  },
];

function Navbar() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  // Keyboard shortcut — Ctrl+K or Cmd+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 h-14">
          {/* Logo */}
          <Link
            href="/"
            className="font-semibold text-sm tracking-tight hover:text-primary transition-colors"
          >
            D2 OST
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  px-3 py-1.5 rounded-md text-sm transition-colors
                  ${
                    pathname === link.href
                      ? "bg-secondary text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }
                `}
              >
                {link.label}
              </Link>
            ))}

            {/* Search button */}
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-muted-foreground text-xs"
              onClick={() => setSearchOpen(true)}
            >
              Search
              <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs sm:flex">
                ⌘K
              </kbd>
            </Button>
          </div>
        </div>
      </nav>

      <TrackSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}

export default Navbar;
