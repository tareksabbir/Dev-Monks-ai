"use client";

import Link from "next/link";
import { NAV_LINKS } from "@/lib/data";

function NavDropdownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="ml-1 opacity-60">
      <path
        d="M3 4.5l3 3 3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRight({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8h6M9 4l4 4-4 4"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#fffdf4]/90 backdrop-blur-sm border-b border-[#e8e0d0]">
      <div className="max-w-7xl mx-auto h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Link href="/" className="w-8 h-8 bg-[#ff6b00] flex items-center justify-center">
              <span className="text-white font-black text-sm">Y</span>
            </Link>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                className="flex items-center text-sm font-medium text-[#1a1a1a] hover:text-[#ff6b00] px-2 py-1.5 transition-colors"
              >
                {link.label}
                {link.hasDropdown && <NavDropdownIcon />}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-[#1a1a1a] hover:text-[#ff6b00] flex items-center gap-1 transition-colors">
            Contact Sales <ArrowRight size={14} />
          </button>
          <div className="flex bg-[#1a1a1a] text-white text-sm font-medium">
            <button className="px-5 py-1.5 hover:bg-[#333] transition-colors border-r border-[#333]">
              Try Studio
            </button>
            <button className="px-2 py-1.5 hover:bg-[#333] transition-colors">
              <NavDropdownIcon />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
