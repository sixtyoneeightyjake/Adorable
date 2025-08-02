"use client";

import React from "react";
import { Button } from "./ui/button";

interface ExampleButtonProps {
  text: string;
  promptText: string;
  onClick: (text: string) => void;
  className?: string;
}

export function ExampleButton({
  text,
  promptText,
  onClick,
  className,
}: ExampleButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={`glass-light border-2 border-red-500/40 hover:border-red-500/80 hover:bg-red-500/10 hover:shadow-xl hover:shadow-red-500/20 active:scale-95 transition-all duration-300 rounded-full hover-lift backdrop-blur-sm text-logo-cream/90 hover:text-logo-cream font-semibold tracking-wide ${
        className || ""
      }`}
      onClick={() => onClick(promptText)}
      type="button"
    >
      {text}
    </Button>
  );
}
