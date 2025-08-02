"use client";

import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const authDbOptions = {
  "just-auth": "Just Authentication",
  "just-db": "Just Database", 
  "both": "Both Services",
  "none": "Do not need"
} as const;

type AuthDbSelectorProps = {
  value?: keyof typeof authDbOptions | "";
  onChange: (value: keyof typeof authDbOptions) => void;
  className?: string;
};

export function AuthDbSelector({
  value = "",
  onChange,
  className,
}: AuthDbSelectorProps) {
  return (
    <div className={cn("relative", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1 px-2 text-xs bg-transparent border border-logo-cream/20 hover:border-logo-cream/40 hover:bg-logo-cream/5 shadow-none text-logo-cream/80 hover:text-logo-cream font-medium transition-all duration-200"
          >
            {value ? authDbOptions[value as keyof typeof authDbOptions] : "Select an option..."}
            <ChevronDownIcon className="h-2.5 w-2.5 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="min-w-[10rem] bg-black/90 border border-logo-cream/20 backdrop-blur-md"
        >
          {Object.entries(authDbOptions).map(([key, label]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => onChange(key as keyof typeof authDbOptions)}
              className="gap-2 text-xs font-medium text-logo-cream/80 hover:text-logo-cream hover:bg-logo-cream/10 transition-colors duration-200"
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
