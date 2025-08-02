"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCompatibleGitHubRepositories } from "@/actions/get-github-repos";
import { importGitHubRepository } from "@/actions/import-github-repo";
import { useRouter } from "next/navigation";

interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  htmlUrl: string;
  cloneUrl: string;
  language: string;
  updatedAt: string;
  isPrivate: boolean;
  framework: 'react' | 'nextjs' | 'unknown';
  hasTypeScript: boolean;
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'unknown';
}

export function GitHubRepoBrowser() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadRepositories();
  }, []);

  const loadRepositories = async () => {
    try {
      setError(null);
      const repos = await getCompatibleGitHubRepositories();
      setRepositories(repos);
    } catch (error) {
      console.error("Failed to load repositories:", error);
      setError("Failed to load repositories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (repo: Repository) => {
    setImporting(repo.id);
    try {
      const result = await importGitHubRepository({
        githubRepoUrl: repo.cloneUrl,
        name: repo.name,
        description: repo.description || "Imported from GitHub",
      });
      
      // Redirect to the new app (skip prompt, go directly to chat)
      router.push(`/app/${result.app.id}`);
    } catch (error) {
      console.error("Import failed:", error);
      alert("Import failed. Please try again.");
    } finally {
      setImporting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-logo-cream/80">Scanning your repositories for React/Next.js projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2 text-logo-cream">Error Loading Repositories</h3>
        <p className="text-logo-cream/60 mb-4">{error}</p>
        <Button onClick={loadRepositories} variant="outline" className="border-logo-cream/20 text-logo-cream/80">
          Try Again
        </Button>
      </div>
    );
  }

  if (repositories.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2 text-logo-cream">No Compatible Projects Found</h3>
        <p className="text-logo-cream/60 mb-4">
          We couldn't find any React or Next.js projects in your GitHub repositories.
        </p>
        <p className="text-sm text-logo-cream/50">
          Only React and Next.js projects can be imported to MojoCode.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-logo-cream">Compatible Projects</h2>
        <p className="text-sm text-logo-cream/60">
          Found {repositories.length} React/Next.js project{repositories.length !== 1 ? 's' : ''} ready to import.
        </p>
      </div>
      
      {repositories.map((repo) => (
        <div key={repo.id} className="glass-heavy rounded-lg p-4 border border-logo-cream/20 hover:border-logo-cream/40 transition-all duration-200">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-logo-cream">{repo.name}</h3>
            <div className="flex gap-2">
              <Badge 
                variant={repo.framework === 'nextjs' ? 'default' : 'secondary'}
                className={repo.framework === 'nextjs' ? 'bg-red-500 text-white' : 'bg-logo-cream/20 text-logo-cream'}
              >
                {repo.framework === 'nextjs' ? 'Next.js' : 'React'}
              </Badge>
              {repo.hasTypeScript && (
                <Badge variant="outline" className="border-logo-cream/30 text-logo-cream/80">
                  TypeScript
                </Badge>
              )}
            </div>
          </div>
          
          {repo.description && (
            <p className="text-sm text-logo-cream/60 mb-3">{repo.description}</p>
          )}
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 text-xs text-logo-cream/50">
              <span>{repo.language}</span>
              <span>Updated {new Date(repo.updatedAt).toLocaleDateString()}</span>
              <span>{repo.packageManager}</span>
            </div>
            
            <Button
              onClick={() => handleImport(repo)}
              disabled={importing === repo.id}
              size="sm"
              className="bg-red-500 hover:bg-red-600 text-white font-medium"
            >
              {importing === repo.id ? "Importing..." : "Import Project"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
