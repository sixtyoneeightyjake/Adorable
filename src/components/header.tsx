"use client";

import Image from "next/image";
import { UserButton } from "@stackframe/stack";

interface HeaderProps {
  className?: string;
}

export function Header({ className = "" }: HeaderProps) {
  return (
    <header className={`glass sticky top-0 z-50 w-full border-b border-white/20 ${className}`}>
      <div className="container mx-auto px-2">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="relative">
            <Image
              src="/logos/headerlogo.png"
              alt="Mojo Code Logo"
              width={120}
              height={24}
              className="hover-lift transition-all duration-300 hover:scale-105"
              priority
            />
          </div>

          {/* User Authentication */}
          <div className="flex items-center gap-2">
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
}