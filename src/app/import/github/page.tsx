import { getUser } from "@/auth/stack-auth";
import { GitHubRepoBrowser } from "@/components/github-repo-browser";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Header } from "@/components/header";

export default async function GitHubImportPage() {
  const user = await getUser();
  
  if (!user.githubAccount) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <Header />
        <div className="container mx-auto py-8 text-center">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-logo-cream">Import from GitHub</h1>
            <p className="text-logo-cream/60 mb-6">
              Connect your GitHub account to import React and Next.js projects.
            </p>
            <Button 
              asChild
              className="bg-red-500 hover:bg-red-600 text-white font-medium"
            >
              <Link href="/handler/sign-in?provider=github">
                Connect GitHub Account
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Header />
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2 text-logo-cream">Import from GitHub</h1>
          <p className="text-logo-cream/60">
            Import your existing React and Next.js projects from GitHub. 
            Only compatible projects will be shown.
          </p>
        </div>
        
        <GitHubRepoBrowser />
        
        <div className="mt-8 p-4 glass-heavy rounded-lg border border-logo-cream/20">
          <h3 className="font-semibold mb-2 text-logo-cream">Supported Project Types</h3>
          <ul className="text-sm text-logo-cream/60 space-y-1">
            <li>• React applications (Create React App, Vite, etc.)</li>
            <li>• Next.js applications (all versions)</li>
            <li>• TypeScript and JavaScript projects</li>
            <li>• Projects using npm, yarn, or pnpm</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
