"use client";

import { useState } from "react";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/data";
import { HamburgerIcon, NavDropdownIcon } from "@/components/ui/icons";
import { ArrowRight } from "lucide-react";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Left: Logo + Desktop Nav */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Link
            href="/"
            className="w-8 h-8 bg-primary flex items-center justify-center shrink-0"
          >
            <span className="text-white font-black text-sm">Y</span>
          </Link>

          {/* Desktop nav links — hidden below lg */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href || "#"}
                className="flex items-center text-sm font-medium text-foreground hover:text-primary px-2 py-1.5 rounded transition-colors"
              >
                {link.label}
                {link.hasDropdown && <NavDropdownIcon />}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: CTA + Hamburger */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Contact Sales — hidden below lg */}
          <button className="hidden lg:flex text-sm font-medium text-foreground hover:text-primary items-center gap-1 transition-colors">
            Contact Sales <ArrowRight size={14} />
          </button>

          {/* Try Studio CTA — hidden on xs */}
          <div className="hidden sm:flex bg-foreground text-white text-sm font-medium">
            <button className="px-5 py-1.5 hover:bg-foreground/80 transition-colors border-r border-white/10">
              Try Studio
            </button>
            <button className="px-2 py-1.5 hover:bg-foreground/80 transition-colors flex items-center">
              <NavDropdownIcon />
            </button>
          </div>

          {/* Hamburger — visible below lg */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden p-1.5 rounded hover:bg-black/5 transition-colors text-foreground"
            aria-label="Toggle menu"
          >
            <HamburgerIcon open={menuOpen} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-border bg-background animate-in slide-in-from-top-1 duration-150">
          <div className="flex flex-col py-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href || "#"}
                className="flex items-center justify-between w-full text-[15px] font-medium text-foreground hover:text-primary hover:bg-primary/5 px-5 py-3 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
                {link.hasDropdown && <NavDropdownIcon />}
              </Link>
            ))}

            <div className="h-px bg-card-border/50 mx-5 my-2" />

            <div className="flex flex-col gap-2 px-5 pb-2">
              <button className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary py-2 transition-colors">
                Contact Sales <ArrowRight size={14} />
              </button>

              {/* Show CTA in mobile menu on xs screens */}
              <button className="sm:hidden w-full bg-foreground text-white text-sm font-medium py-2.5 hover:bg-foreground/90 transition-colors">
                Try Studio
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
