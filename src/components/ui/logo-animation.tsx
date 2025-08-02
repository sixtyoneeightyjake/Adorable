"use client";

import * as React from "react";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const logoAnimationVariants = cva(
  "transition-all duration-300",
  {
    variants: {
      size: {
        sm: "w-24 h-24 sm:w-32 sm:h-32",
        md: "w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48",
        lg: "w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64",
        xl: "w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80",
      },
    },
    defaultVariants: {
      size: "lg",
    },
  }
);

interface LogoAnimationProps extends VariantProps<typeof logoAnimationVariants> {
  className?: string;
  animationDuration?: number;
  pauseDuration?: number;
  alt?: string;
}

const LogoAnimation = React.forwardRef<HTMLDivElement, LogoAnimationProps>(
  ({ 
    size, 
    className, 
    animationDuration = 8000, // 8s total cycle (2s in + 3s hold + 2s out + 1s pause)
    pauseDuration = 1000, // 1s pause
    alt = "Mojo Code is Ready",
    ...props 
  }, ref) => {
    const [imageError, setImageError] = React.useState(false);
    const [imageLoaded, setImageLoaded] = React.useState(false);

    // Calculate animation timing based on total duration
    const dissolveInDuration = (animationDuration - pauseDuration) * 0.25; // 2s
    const holdDuration = (animationDuration - pauseDuration) * 0.375; // 3s  
    const dissolveOutDuration = (animationDuration - pauseDuration) * 0.25; // 2s

    const animationStyle = React.useMemo(() => ({
      '--animation-duration': `${animationDuration}ms`,
      '--dissolve-in-duration': `${dissolveInDuration}ms`,
      '--hold-duration': `${holdDuration}ms`,
      '--dissolve-out-duration': `${dissolveOutDuration}ms`,
      '--pause-duration': `${pauseDuration}ms`,
    } as React.CSSProperties), [animationDuration, dissolveInDuration, holdDuration, dissolveOutDuration, pauseDuration]);

    // Get responsive dimensions based on size variant
    const getDimensions = () => {
      switch (size) {
        case 'sm':
          return { width: 128, height: 128 }; // Base size for sm
        case 'md':
          return { width: 192, height: 192 }; // Base size for md
        case 'lg':
          return { width: 256, height: 256 }; // Base size for lg
        case 'xl':
          return { width: 320, height: 320 }; // Base size for xl
        default:
          return { width: 192, height: 192 };
      }
    };

    const { width, height } = getDimensions();

    const handleImageError = () => {
      setImageError(true);
    };

    const handleImageLoad = () => {
      setImageLoaded(true);
    };

    // Fallback text component
    const FallbackText = () => (
      <div className={cn(
        "flex items-center justify-center text-center",
        logoAnimationVariants({ size }),
        "logo-dissolve-animation"
      )}>
        <div className="flex flex-col items-center">
          <h1 className={cn(
            "font-bold text-logo-gradient leading-tight tracking-tight",
            size === "sm" ? "text-xl sm:text-2xl" :
            size === "md" ? "text-2xl sm:text-3xl md:text-4xl" :
            size === "lg" ? "text-3xl sm:text-4xl md:text-5xl lg:text-6xl" :
            "text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
          )}>
            MOJO.CODE
          </h1>
          <span className={cn(
            "text-logo-cream/90 font-semibold mt-2 tracking-wide",
            size === "sm" ? "text-xs" :
            size === "md" ? "text-sm" :
            size === "lg" ? "text-base" :
            "text-lg"
          )}>
            is Ready
          </span>
        </div>
      </div>
    );

    return (
      <>
        {/* CSS Animation Styles */}
        <style jsx>{`
          @keyframes logoDissolve {
            0% { 
              opacity: 0.3; 
              transform: scale(0.98);
            }
            25% { 
              opacity: 1; 
              transform: scale(1);
            }
            75% { 
              opacity: 1; 
              transform: scale(1);
            }
            100% { 
              opacity: 0.3; 
              transform: scale(0.98);
            }
          }

          .logo-dissolve-animation {
            animation: logoDissolve var(--animation-duration) ease-in-out infinite;
          }

          /* Respect prefers-reduced-motion */
          @media (prefers-reduced-motion: reduce) {
            .logo-dissolve-animation {
              animation: none;
              opacity: 1;
              transform: none;
            }
          }

          /* Optimize for mobile performance */
          @media (max-width: 768px) {
            .logo-dissolve-animation {
              animation-duration: calc(var(--animation-duration) * 1.2);
            }
          }
        `}</style>

        <div 
          ref={ref} 
          className={cn("relative flex items-center justify-center", className)} 
          style={animationStyle}
          {...props}
        >
          {!imageError ? (
            <div className={cn(
              logoAnimationVariants({ size }),
              "logo-dissolve-animation relative"
            )}>
              <Image
                src="/logos/isready.png"
                alt={alt}
                width={width}
                height={height}
                className="w-full h-full object-contain"
                priority
                onError={handleImageError}
                onLoad={handleImageLoad}
                style={{
                  opacity: imageLoaded ? 1 : 0,
                  transition: 'opacity 0.3s ease-in-out'
                }}
              />
              {/* Loading placeholder */}
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          ) : (
            <FallbackText />
          )}
        </div>
      </>
    );
  }
);

LogoAnimation.displayName = "LogoAnimation";

export { LogoAnimation, logoAnimationVariants };
export type { LogoAnimationProps };