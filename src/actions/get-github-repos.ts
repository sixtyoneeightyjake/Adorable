"use server";

import { getUser } from "@/auth/stack-auth";
import { GitHubClient } from "@/lib/github-client";
import { analyzeGitHubRepository } from "@/lib/project-analyzer";

export async function getCompatibleGitHubRepositories(page = 1) {
  const user = await getUser();
  
  if (!user.githubAccount) {
    throw new Error("GitHub account not connected");
  }

  const github = new GitHubClient(user.githubAccount.accessToken);
  const allRepos = await github.getUserRepositories(page, 50); // Get more to filter
  
  // Analyze repositories in parallel with error handling
  const repoAnalyses = await Promise.allSettled(
    allRepos.map(async (repo: any) => {
      try {
        const [owner, repoName] = repo.full_name.split('/');
        const analysis = await analyzeGitHubRepository(github, owner, repoName);
        
        return {
          ...repo,
          analysis,
          isCompatible: analysis.isReactProject || analysis.isNextJsProject,
        };
      } catch (error) {
        console.error(`Failed to analyze repo ${repo.full_name}:`, error);
        return {
          ...repo,
          analysis: {
            isReactProject: false,
            isNextJsProject: false,
            framework: 'unknown' as const,
            packageManager: 'unknown' as const,
            hasTypeScript: false,
            dependencies: [],
          },
          isCompatible: false,
        };
      }
    })
  );
  
  // Filter successful analyses and compatible projects
  const compatibleRepos = repoAnalyses
    .filter((result): result is PromiseFulfilledResult<any> => 
      result.status === 'fulfilled' && result.value.isCompatible
    )
    .map(result => result.value)
    .slice(0, 30); // Limit to 30 results
  
  return compatibleRepos.map((repo: any) => ({
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    htmlUrl: repo.html_url,
    cloneUrl: repo.clone_url,
    language: repo.language,
    updatedAt: repo.updated_at,
    isPrivate: repo.private,
    framework: repo.analysis.framework,
    hasTypeScript: repo.analysis.hasTypeScript,
    packageManager: repo.analysis.packageManager,
  }));
}
