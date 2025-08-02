"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const skeletonVariants = cva(
  "animate-pulse rounded-md bg-muted relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-muted",
        shimmer: "bg-gradient-to-r from-muted via-muted-foreground/10 to-muted",
        wave: "bg-muted",
        pulse: "bg-muted animate-pulse",
      },
      size: {
        sm: "h-4",
        default: "h-6",
        lg: "h-8",
        xl: "h-12",
      },
    },
    defaultVariants: {
      variant: "shimmer",
      size: "default",
    },
  }
);

interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  lines?: number;
  spacing?: string;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ 
    className, 
    variant, 
    size, 
    width, 
    height, 
    circle = false, 
    lines = 1,
    spacing = "0.5rem",
    style,
    ...props 
  }, ref) => {
    const skeletonStyle = {
      width: width,
      height: height || undefined,
      ...style,
    };

    if (lines === 1) {
      return (
        <div
          ref={ref}
          className={cn(
            skeletonVariants({ variant, size }),
            circle && "rounded-full aspect-square",
            variant === "shimmer" && "skeleton-shimmer",
            variant === "wave" && "skeleton-wave",
            className
          )}
          style={skeletonStyle}
          {...props}
        />
      );
    }

    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              skeletonVariants({ variant, size }),
              variant === "shimmer" && "skeleton-shimmer",
              variant === "wave" && "skeleton-wave",
              index === lines - 1 && "w-3/4" // Last line is shorter
            )}
            style={{
              marginBottom: index < lines - 1 ? spacing : 0,
              width: index === lines - 1 ? "75%" : width,
              height: height,
            }}
          />
        ))}
      </div>
    );
  }
);

Skeleton.displayName = "Skeleton";

// Specialized skeleton components for common use cases
const SkeletonText = React.forwardRef<
  HTMLDivElement,
  Omit<SkeletonProps, "lines"> & { lines?: number }
>(({ lines = 3, className, ...props }, ref) => (
  <Skeleton
    ref={ref}
    lines={lines}
    className={cn("w-full", className)}
    {...props}
  />
));

SkeletonText.displayName = "SkeletonText";

const SkeletonAvatar = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ size = "default", className, ...props }, ref) => (
    <Skeleton
      ref={ref}
      circle
      size={size}
      className={cn(
        size === "sm" && "h-8 w-8",
        size === "default" && "h-10 w-10",
        size === "lg" && "h-12 w-12",
        size === "xl" && "h-16 w-16",
        className
      )}
      {...props}
    />
  )
);

SkeletonAvatar.displayName = "SkeletonAvatar";

const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border border-border bg-card p-6 space-y-4",
        className
      )}
      {...props}
    >
      <div className="flex items-center space-x-4">
        <SkeletonAvatar />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <SkeletonText lines={3} />
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  )
);

SkeletonCard.displayName = "SkeletonCard";

const SkeletonButton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ size = "default", className, ...props }, ref) => (
    <Skeleton
      ref={ref}
      className={cn(
        "rounded-md",
        size === "sm" && "h-8 w-20",
        size === "default" && "h-9 w-24",
        size === "lg" && "h-10 w-28",
        size === "xl" && "h-12 w-32",
        className
      )}
      {...props}
    />
  )
);

SkeletonButton.displayName = "SkeletonButton";

const SkeletonInput = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <Skeleton
      ref={ref}
      className={cn("h-9 w-full rounded-md", className)}
      {...props}
    />
  )
);

SkeletonInput.displayName = "SkeletonInput";

// Loading container with staggered animations
interface SkeletonContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  stagger?: boolean;
  delay?: number;
}

const SkeletonContainer = React.forwardRef<HTMLDivElement, SkeletonContainerProps>(
  ({ children, stagger = true, delay = 100, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        stagger && "skeleton-stagger",
        className
      )}
      style={{
        "--stagger-delay": `${delay}ms`,
      } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  )
);

SkeletonContainer.displayName = "SkeletonContainer";

export {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonButton,
  SkeletonInput,
  SkeletonContainer,
  skeletonVariants,
};
