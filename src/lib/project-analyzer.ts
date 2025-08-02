import { GitHubClient } from './github-client';

export interface ProjectAnalysis {
  isReactProject: boolean;
  isNextJsProject: boolean;
  framework: 'react' | 'nextjs' | 'unknown';
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'unknown';
  hasTypeScript: boolean;
  dependencies: string[];
}

export async function analyzeGitHubRepository(
  githubClient: GitHubClient,
  owner: string,
  repo: string
): Promise<ProjectAnalysis> {
  try {
    // Get package.json content
    const packageJsonContent = await githubClient.getFileContent(owner, repo, 'package.json');
    const packageData = JSON.parse(packageJsonContent);
    
    const dependencies = {
      ...packageData.dependencies,
      ...packageData.devDependencies,
    };
    
    const dependencyNames = Object.keys(dependencies);
    
    // Check for Next.js
    const isNextJsProject = !!(
      dependencies.next ||
      dependencies['@next/core'] ||
      packageData.scripts?.dev?.includes('next') ||
      packageData.scripts?.build?.includes('next') ||
      packageData.scripts?.start?.includes('next')
    );
    
    // Check for React
    const isReactProject = !!(
      dependencies.react ||
      dependencies['react-dom'] ||
      isNextJsProject
    );
    
    // Check for TypeScript
    const hasTypeScript = !!(
      dependencies.typescript ||
      dependencies['@types/react'] ||
      dependencies['@types/node'] ||
      await githubClient.fileExists(owner, repo, 'tsconfig.json')
    );
    
    // Detect package manager
    let packageManager: 'npm' | 'yarn' | 'pnpm' | 'unknown' = 'npm';
    
    try {
      if (await githubClient.fileExists(owner, repo, 'yarn.lock')) {
        packageManager = 'yarn';
      } else if (await githubClient.fileExists(owner, repo, 'pnpm-lock.yaml')) {
        packageManager = 'pnpm';
      }
    } catch {
      // If we can't check lock files, default to npm
      packageManager = 'npm';
    }
    
    return {
      isReactProject,
      isNextJsProject,
      framework: isNextJsProject ? 'nextjs' : isReactProject ? 'react' : 'unknown',
      packageManager,
      hasTypeScript,
      dependencies: dependencyNames,
    };
  } catch (error) {
    console.error(`Error analyzing repository ${owner}/${repo}:`, error);
    return {
      isReactProject: false,
      isNextJsProject: false,
      framework: 'unknown',
      packageManager: 'unknown',
      hasTypeScript: false,
      dependencies: [],
    };
  }
}
