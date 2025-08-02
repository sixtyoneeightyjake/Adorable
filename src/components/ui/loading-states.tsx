"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { 
  Skeleton, 
  SkeletonText, 
  SkeletonAvatar, 
  SkeletonCard, 
  SkeletonButton,
  SkeletonContainer 
} from "./skeleton";

// Chat message loading skeleton
export function ChatMessageSkeleton({ isUser = false }: { isUser?: boolean }) {
  return (
    <div className={cn(
      "flex gap-3 p-4",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      {!isUser && <SkeletonAvatar size="sm" />}
      <div className={cn(
        "flex-1 space-y-2",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "max-w-[80%] space-y-2",
          isUser ? "ml-auto" : "mr-auto"
        )}>
          <SkeletonText lines={2} />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}

// App card loading skeleton
export function AppCardSkeleton() {
  return (
    <SkeletonCard className="w-full">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
        <SkeletonText lines={2} />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <div className="flex gap-2">
            <SkeletonButton size="sm" />
            <SkeletonButton size="sm" />
          </div>
        </div>
      </div>
    </SkeletonCard>
  );
}

// Header loading skeleton
export function HeaderSkeleton() {
  return (
    <header className="glass sticky top-0 z-50 w-full border-b border-white/20">
      <div className="container mx-auto px-2">
        <div className="flex h-16 items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <SkeletonAvatar size="sm" />
        </div>
      </div>
    </header>
  );
}

// Form loading skeleton
export function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-20 w-full rounded-md" />
      </div>
      <div className="flex gap-2">
        <SkeletonButton />
        <SkeletonButton variant="outline" />
      </div>
    </div>
  );
}

// List loading skeleton with staggered animation
export function ListSkeleton({ 
  items = 5, 
  showHeader = true 
}: { 
  items?: number; 
  showHeader?: boolean; 
}) {
  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <SkeletonButton />
        </div>
      )}
      <SkeletonContainer stagger>
        {Array.from({ length: items }).map((_, index) => (
          <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
            <SkeletonAvatar />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <SkeletonButton size="sm" />
          </div>
        ))}
      </SkeletonContainer>
    </div>
  );
}

// Dashboard loading skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <SkeletonButton size="lg" />
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="p-6 border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ListSkeleton items={4} />
        </div>
        <div className="space-y-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  );
}

// Page loading skeleton
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderSkeleton />
      <main className="container mx-auto px-4 py-8">
        <DashboardSkeleton />
      </main>
    </div>
  );
}

// Inline loading component for buttons and small elements
export function InlineLoader({ 
  size = "sm",
  className 
}: { 
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4", 
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  return (
    <div className={cn(
      "animate-spin rounded-full border-2 border-current border-t-transparent",
      sizeClasses[size],
      className
    )} />
  );
}

// Typing indicator for chat
export function TypingIndicator({ message }: { message?: string }) {
  const [dots, setDots] = React.useState('');

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-start space-x-3 p-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-muted-foreground">
            MojoCode is working{dots}
          </span>
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
        {message && (
          <div className="text-xs text-muted-foreground italic bg-muted/50 rounded px-2 py-1">
            {message}
          </div>
        )}
        <div className="text-xs text-muted-foreground">
          Analyzing your request, planning the implementation, and generating code...
        </div>
      </div>
    </div>
  );
}

// Progress skeleton for long operations
export function ProgressSkeleton({ 
  progress = 0,
  showPercentage = true,
  label
}: { 
  progress?: number;
  showPercentage?: boolean;
  label?: string;
}) {
  return (
    <div className="space-y-2">
      {label && <Skeleton className="h-4 w-32" />}
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showPercentage && (
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Loading...</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
    </div>
  );
}
