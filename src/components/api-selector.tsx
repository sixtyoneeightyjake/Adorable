"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ApiSelectorProps = {
  hasExternalApis: boolean;
  onHasExternalApisChange: (value: boolean) => void;
  externalApis: string;
  onExternalApisChange: (value: string) => void;
  className?: string;
};

export function ApiSelector({
  hasExternalApis,
  onHasExternalApisChange,
  externalApis,
  onExternalApisChange,
  className,
}: ApiSelectorProps) {
  return (
    <div className={cn("space-y-3 w-full", className)}>
      {/* Yes/No Selector - Centered */}
      <div className="flex gap-3 justify-center">
        <Button
          variant={hasExternalApis ? "default" : "outline"}
          size="sm"
          onClick={() => onHasExternalApisChange(true)}
          className={cn(
            "h-7 px-4 text-xs font-medium transition-all duration-200",
            hasExternalApis
              ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25"
              : "bg-transparent border border-logo-cream/20 hover:border-logo-cream/40 hover:bg-logo-cream/5 text-logo-cream/80 hover:text-logo-cream"
          )}
        >
          Yes
        </Button>
        <Button
          variant={!hasExternalApis ? "default" : "outline"}
          size="sm"
          onClick={() => onHasExternalApisChange(false)}
          className={cn(
            "h-7 px-4 text-xs font-medium transition-all duration-200",
            !hasExternalApis
              ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25"
              : "bg-transparent border border-logo-cream/20 hover:border-logo-cream/40 hover:bg-logo-cream/5 text-logo-cream/80 hover:text-logo-cream"
          )}
        >
          No
        </Button>
      </div>

      {/* Conditional API Input Field */}
      {hasExternalApis && (
        <div className="animate-in slide-in-from-top-2 duration-200 w-full">
          <Input
            placeholder="e.g., Stripe, Twilio, OpenAI... *"
            value={externalApis}
            onChange={(e) => onExternalApisChange(e.target.value)}
            className="h-7 text-xs bg-transparent border border-logo-cream/20 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/30 text-logo-cream placeholder:text-logo-cream/50 transition-all duration-200 w-full"
          />
        </div>
      )}
    </div>
  );
}
