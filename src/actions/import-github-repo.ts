"use server";

import { getUser } from "@/auth/stack-auth";
import { appsTable, appUsers } from "@/db/schema";
import { db } from "@/lib/db";
import { freestyle } from "@/lib/freestyle";

export async function importGitHubRepository({
  githubRepoUrl,
  name,
  description,
}: {
  githubRepoUrl: string;
  name: string;
  description: string;
}) {
  console.time("get user");
  const user = await getUser();
  console.timeEnd("get user");
  
  if (!user.githubAccount) {
    throw new Error("GitHub account not connected");
  }

  console.time("git");
  // Create Freestyle repository from GitHub source
  const repo = await freestyle.createGitRepository({
    name,
    public: true,
    source: {
      type: "git",
      url: githubRepoUrl,
    },
  });

  // Grant permissions (same as existing flow)
  await freestyle.grantGitPermission({
    identityId: user.freestyleIdentity,
    repoId: repo.repoId,
    permission: "write",
  });

  const token = await freestyle.createGitAccessToken({
    identityId: user.freestyleIdentity,
  });
  console.timeEnd("git");

  console.time("dev server");
  // Request dev server
  const { mcpEphemeralUrl } = await freestyle.requestDevServer({
    repoId: repo.repoId,
  });
  console.timeEnd("dev server");

  console.time("database: create app");
  // Create app record with GitHub metadata
  const app = await db.transaction(async (tx) => {
    const appInsertion = await tx
      .insert(appsTable)
      .values({
        gitRepo: repo.repoId,
        name,
        description,
        source: "github_import",
        githubRepoUrl,
        importedAt: new Date(),
      })
      .returning();

    await tx
      .insert(appUsers)
      .values({
        appId: appInsertion[0].id,
        userId: user.userId,
        permissions: "admin",
        freestyleAccessToken: token.token,
        freestyleAccessTokenId: token.id,
        freestyleIdentity: user.freestyleIdentity,
      })
      .returning();

    return appInsertion[0];
  });
  console.timeEnd("database: create app");

  return {
    app,
    mcpEphemeralUrl,
  };
}
