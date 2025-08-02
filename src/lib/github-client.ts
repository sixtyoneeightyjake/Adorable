export class GitHubClient {
  constructor(private accessToken: string) {}
  
  async getUserRepositories(page = 1, perPage = 30) {
    const response = await fetch(
      `https://api.github.com/user/repos?page=${page}&per_page=${perPage}&sort=updated&type=owner`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'MojoCode-App'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async getRepository(owner: string, repo: string) {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'MojoCode-App'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async getFileContent(owner: string, repo: string, path: string): Promise<string> {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'MojoCode-App'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`File not found: ${path}`);
    }
    
    const data = await response.json();
    
    // Handle if it's a file (not a directory)
    if (data.type === 'file' && data.content) {
      return Buffer.from(data.content, 'base64').toString('utf-8');
    }
    
    throw new Error(`${path} is not a file`);
  }
  
  async fileExists(owner: string, repo: string, path: string): Promise<boolean> {
    try {
      await this.getFileContent(owner, repo, path);
      return true;
    } catch {
      return false;
    }
  }
}
