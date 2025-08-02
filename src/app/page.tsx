"use client";

import { useRouter } from "next/navigation";
import { PromptInput, PromptInputActions } from "@/components/ui/prompt-input";
import { FrameworkSelector } from "@/components/framework-selector";
import { AuthDbSelector } from "@/components/auth-db-selector";
import { ApiSelector } from "@/components/api-selector";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import { UserApps } from "@/components/user-apps";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PromptInputTextareaWithTypingAnimation } from "@/components/prompt-input";
import { Header } from "@/components/header";
import { LogoAnimation } from "@/components/ui/logo-animation";
import { Sparkles } from "lucide-react";
import Link from "next/link";

const queryClient = new QueryClient();

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [framework, setFramework] = useState("nextjs");
  const [authDbNeeds, setAuthDbNeeds] = useState<"just-auth" | "just-db" | "both" | "none" | "">("");
  const [hasExternalApis, setHasExternalApis] = useState(false);
  const [externalApis, setExternalApis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    // Validate mandatory fields
    if (!prompt.trim()) {
      return; // Prompt is already validated by the button disabled state
    }

    if (!authDbNeeds) {
      // You could add a toast notification here for better UX
      return;
    }

    if (hasExternalApis && !externalApis.trim()) {
      // If they selected "Yes" for APIs but didn't specify which ones
      return;
    }

    setIsLoading(true);

    // Build URL parameters including the new form fields
    const params = new URLSearchParams({
      message: prompt,
      template: framework,
      authDb: authDbNeeds,
      hasApis: hasExternalApis.toString(),
    });

    // Add external APIs if specified
    if (hasExternalApis && externalApis.trim()) {
      params.append('externalApis', externalApis.trim());
    }

    router.push(`/app/new?${params.toString()}`);
  };

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;

    setIsEnhancing(true);
    try {
      const response = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to enhance prompt');
      }

      const data = await response.json();
      // Directly update the prompt with the enhanced version
      setPrompt(data.enhancedPrompt);
    } catch (error) {
      console.error('Error enhancing prompt:', error);
      // You could add a toast notification here
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-brand-gradient relative overflow-hidden">
        {/* Enhanced background with black/red theme layers */}
        <div className="absolute inset-0 bg-brand-gradient" />
        <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-black/20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-red-500/5 to-transparent pointer-events-none" />
        
        <Header className="animate-fade-in" />
        <main className="relative z-10">
          {/* Main content container - centered layout */}
          <div className="min-h-screen flex flex-col">
            {/* Hero section - centered and compact */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 -mt-16">
              <div className="w-full max-w-2xl mx-auto text-center space-y-3">
                {/* Logo Animation - prominent and centered with entrance animation */}
                <div className="animate-fade-in animate-delay-100">
                  <LogoAnimation size="lg" />
                </div>

                {/* Enhanced prompt input container with dramatic glassmorphism and entrance animation */}
                <div className="w-full max-w-xl mx-auto relative animate-slide-up animate-delay-200">
                  <div className="relative w-full max-w-full overflow-hidden">
                  {/* Glow effect behind the input */}
                  <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-lg transform scale-105"></div>
                  <div className="w-full glass-heavy rounded-xl relative z-10 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20 hover:scale-[1.02]">
                    <PromptInput
                      leftSlot={
                        <div className="flex items-center gap-2">
                          <FrameworkSelector
                            value={framework}
                            onChange={setFramework}
                          />
                          <Button
                            variant={"ghost"}
                            size="icon"
                            onClick={handleEnhancePrompt}
                            disabled={isLoading || isEnhancing || !prompt.trim()}
                            className="h-8 w-8 rounded-full text-logo-cream/70 hover:text-logo-cream hover:bg-red-500/20 transition-all duration-200"
                            title="Enhance prompt with AI"
                          >
                            <Sparkles className={`h-4 w-4 ${isEnhancing ? 'animate-spin' : ''}`} />
                          </Button>
                        </div>
                      }
                      isLoading={isLoading}
                      value={prompt}
                      onValueChange={setPrompt}
                      onSubmit={handleSubmit}
                      className="relative z-10 border-none bg-transparent shadow-none focus-within:border-red-500/60 focus-within:ring-2 focus-within:ring-red-500/30 transition-all duration-300 ease-in-out"
                    >
                      <PromptInputTextareaWithTypingAnimation />
                      <PromptInputActions>
                        <Button
                          variant={"ghost"}
                          size="sm"
                          onClick={handleSubmit}
                          disabled={
                            isLoading ||
                            !prompt.trim() ||
                            !authDbNeeds ||
                            (hasExternalApis && !externalApis.trim())
                          }
                          className="h-8 text-sm bg-red-500 hover:bg-red-600 text-white font-bold tracking-wide px-4 rounded-lg transition-all duration-200 hover-lift shadow-lg shadow-red-500/25 animate-scale-in animate-delay-300"
                        >
                          <span className="hidden sm:inline">
                            Start Creating ⏎
                          </span>
                          <span className="sm:hidden">Create ⏎</span>
                        </Button>
                      </PromptInputActions>
                    </PromptInput>
                  </div>
                  </div>
                </div>

                {/* Additional form fields - smaller, centered cards with more separation */}
                <div className="w-full max-w-lg mx-auto space-y-6 mt-8 animate-slide-up animate-delay-300">
                  {/* Authentication/Database needs */}
                  <div className="relative">
                    {/* Card glow effect */}
                    <div className="absolute inset-0 bg-red-500/10 blur-lg rounded-lg transform scale-105"></div>
                    <div className="glass-heavy rounded-lg p-3 border border-red-500/20 relative z-10 shadow-lg shadow-red-500/10">
                      <div className="text-xs font-bold text-logo-cream mb-2 text-center">
                        Does your application need any authentication or database features? *
                      </div>
                      <div className="flex justify-center">
                        <AuthDbSelector
                          value={authDbNeeds}
                          onChange={setAuthDbNeeds}
                        />
                      </div>
                    </div>
                  </div>

                  {/* External APIs */}
                  <div className="relative">
                    {/* Card glow effect */}
                    <div className="absolute inset-0 bg-red-500/10 blur-lg rounded-lg transform scale-105"></div>
                    <div className="glass-heavy rounded-lg p-3 border border-red-500/20 relative z-10 shadow-lg shadow-red-500/10">
                      <div className="text-xs font-bold text-logo-cream mb-2 text-center">
                        Do you have any external APIs needing connected to your application? *
                      </div>
                      <div className="flex justify-center">
                        <ApiSelector
                          hasExternalApis={hasExternalApis}
                          onHasExternalApisChange={setHasExternalApis}
                          externalApis={externalApis}
                          onExternalApisChange={setExternalApis}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Existing Project Section */}
                <div className="w-full animate-slide-up animate-delay-500 mt-8">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-3 text-logo-cream/60 text-sm">
                      <div className="h-px bg-logo-cream/20 w-16"></div>
                      <span>or have Mojo help you with an existing project</span>
                      <div className="h-px bg-logo-cream/20 w-16"></div>
                    </div>

                    <Button
                      asChild
                      size="lg"
                      className="bg-transparent border-2 border-logo-cream/30 hover:border-logo-cream/50 hover:bg-logo-cream/10 text-logo-cream hover:text-white font-semibold transition-all duration-200 px-8 py-3 text-base shadow-lg hover:shadow-xl"
                    >
                      <Link href="/import/github" className="flex items-center gap-3">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        Import from GitHub
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* User apps section - bottom section with entrance animation */}
            <div className="border-t-2 border-red-500/30 py-12 mt-24 animate-fade-in animate-delay-700">
              <div className="max-w-6xl mx-auto px-4">
                <div className="relative">
                  {/* Glow effect behind user apps */}
                  <div className="absolute inset-0 bg-red-500/10 blur-xl rounded-xl transform scale-105"></div>
                  <div className="glass rounded-xl p-8 relative z-10">
                    <UserApps />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
}


