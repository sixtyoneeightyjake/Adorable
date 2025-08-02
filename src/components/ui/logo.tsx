import * as React from "react";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const logoVariants = cva(
  "transition-all duration-300 hover:scale-105 hover-lift",
  {
    variants: {
      size: {
        small: "w-6 h-6",
        medium: "w-10 h-10", 
        large: "w-16 h-16",
        hero: "w-20 h-20",
      },
    },
    defaultVariants: {
      size: "medium",
    },
  }
);

interface LogoProps extends VariantProps<typeof logoVariants> {
  className?: string;
  priority?: boolean;
  showText?: boolean;
  alt?: string;
}

const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  ({ size, className, priority = false, showText = false, alt = "MojoCode Logo", ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center gap-3", className)} {...props}>
        <div className="relative">
          <Image
            src="/logos/logo.png"
            alt={alt}
            width={size === "small" ? 24 : size === "medium" ? 40 : size === "large" ? 60 : 80}
            height={size === "small" ? 24 : size === "medium" ? 40 : size === "large" ? 60 : 80}
            className={cn(logoVariants({ size }))}
            priority={priority}
          />
        </div>
        {showText && (
          <div className="flex flex-col">
            <h1 className={cn(
              "font-bold text-brand-gradient leading-tight",
              size === "small" ? "text-sm" : 
              size === "medium" ? "text-xl" : 
              size === "large" ? "text-2xl" : 
              "text-3xl"
            )}>
              Mojo Code
            </h1>
            {(size === "medium" || size === "large" || size === "hero") && (
              <span className={cn(
                "text-muted-foreground",
                size === "medium" ? "text-xs hidden sm:block" :
                size === "large" ? "text-sm" :
                "text-base"
              )}>
                AI App Architect and Visionary
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Logo.displayName = "Logo";

export { Logo, logoVariants };