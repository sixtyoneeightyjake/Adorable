import { SYSTEM_MESSAGE } from "@/lib/system";
import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { createTool } from "@mastra/core/tools";
import { Memory } from "@mastra/memory";
import { PostgresStore, PgVector } from "@mastra/pg";
import { z } from "zod";

export const memory = new Memory({
  options: {
    lastMessages: 1000,
    semanticRecall: false,
    threads: {
      generateTitle: true,
    },
  },
  vector: new PgVector({
    connectionString: process.env.DATABASE_URL!,
  }),
  storage: new PostgresStore({
    connectionString: process.env.DATABASE_URL!,
  }),
  processors: [
    // new ToolCallFilter({
    //   exclude: ["read_file", "read_multiple_files"],
    // }),
    // new TokenLimiter(100_000),
  ],
});

// Using OpenAI directly instead of OpenRouter

export const builderAgent = new Agent({
  name: "BuilderAgent",
  model: openai("o4-mini"),
  instructions: SYSTEM_MESSAGE,
  memory,
  tools: {
    update_todo_list: createTool({
      id: "update_todo_list",
      description:
        "Use the update todo list tool to keep track of the tasks you need to do to accomplish the user's request. You should should update the todo list each time you complete an item. You can remove tasks from the todo list, but only if they are no longer relevant or you've finished the user's request completely and they are asking for something else. Make sure to update the todo list each time the user asks you do something new. If they're asking for something new, you should probably just clear the whole todo list and start over with new items. For complex logic, use multiple todos to ensure you get it all right rather than just a single todo for implementing all logic.",
      inputSchema: z.object({
        items: z.array(
          z.object({
            description: z.string(),
            completed: z.boolean(),
          })
        ),
      }),
      execute: async ({}) => {
        return {};
      },
    }),

    // Context7 Tools
    resolve_library_id: createTool({
      id: "resolve_library_id",
      description: "Resolves a package/product name to a Context7-compatible library ID and returns a list of matching libraries.",
      inputSchema: z.object({
        libraryName: z.string().describe("Library name to search for and retrieve a Context7-compatible library ID."),
      }),
      execute: async ({ libraryName }) => {
        try {
          const response = await fetch("http://mcpo-app.eastus.azurecontainer.io:8000/context7/resolve-library-id", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ libraryName }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          return await response.json();
        } catch (error) {
          return { error: `Failed to resolve library ID: ${error instanceof Error ? error.message : String(error)}` };
        }
      },
    }),

    get_library_docs: createTool({
      id: "get_library_docs",
      description: "Fetches up-to-date documentation for a library. You must call 'resolve_library_id' first to obtain the exact Context7-compatible library ID required to use this tool.",
      inputSchema: z.object({
        context7CompatibleLibraryID: z.string().describe("Exact Context7-compatible library ID (e.g., '/mongodb/docs', '/vercel/next.js') retrieved from 'resolve_library_id'."),
        tokens: z.number().optional().describe("Maximum number of tokens of documentation to retrieve (default: 10000)."),
        topic: z.string().optional().describe("Topic to focus documentation on (e.g., 'hooks', 'routing')."),
      }),
      execute: async ({ context7CompatibleLibraryID, tokens, topic }) => {
        try {
          const body: any = { context7CompatibleLibraryID };
          if (tokens !== undefined) body.tokens = tokens;
          if (topic !== undefined) body.topic = topic;

          const response = await fetch("http://mcpo-app.eastus.azurecontainer.io:8000/context7/get-library-docs", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          return await response.json();
        } catch (error) {
          return { error: `Failed to get library docs: ${error instanceof Error ? error.message : String(error)}` };
        }
      },
    }),

    // Tavily Tools
    tavily_search: createTool({
      id: "tavily_search",
      description: "Search the web for information using Tavily. Returns results in markdown format with URLs, titles, and snippets.",
      inputSchema: z.object({
        query: z.string().describe("The search query to send."),
        max_results: z.number().optional().describe("Number of results to return (default: 5, max: 10)."),
      }),
      execute: async ({ query, max_results }) => {
        try {
          const body: any = { query };
          if (max_results !== undefined) body.max_results = max_results;

          const response = await fetch("http://mcpo-app.eastus.azurecontainer.io:8000/tavily/tavily-search", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          return await response.json();
        } catch (error) {
          return { error: `Failed to search with Tavily: ${error instanceof Error ? error.message : String(error)}` };
        }
      },
    }),

    tavily_extract: createTool({
      id: "tavily_extract",
      description: "Fetches data from a webpage and converts it into Markdown using Tavily.",
      inputSchema: z.object({
        url: z.string().describe("The URL to fetch and extract content from."),
      }),
      execute: async ({ url }) => {
        try {
          const response = await fetch("http://mcpo-app.eastus.azurecontainer.io:8000/tavily/tavily-extract", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          return await response.json();
        } catch (error) {
          return { error: `Failed to extract content with Tavily: ${error instanceof Error ? error.message : String(error)}` };
        }
      },
    }),

    // Sequential Thinking Tool
    sequential_thinking: createTool({
      id: "sequential_thinking",
      description: "A detailed tool for dynamic and reflective problem-solving through thoughts. This tool helps analyze problems through a flexible thinking process that can adapt and evolve.",
      inputSchema: z.object({
        thought: z.string().describe("Your current thinking step, which can include regular analytical steps, revisions, questions, realizations, changes in approach, hypothesis generation, or verification."),
        nextThoughtNeeded: z.boolean().describe("Whether another thought step is needed."),
        thoughtNumber: z.number().min(1).describe("Current thought number."),
        totalThoughts: z.number().min(1).describe("Estimated total thoughts needed (can be adjusted up/down)."),
        isRevision: z.boolean().optional().describe("Whether this revises previous thinking."),
        revisesThought: z.number().min(1).optional().describe("Which thought number is being reconsidered."),
        branchFromThought: z.number().min(1).optional().describe("Branching point thought number."),
        branchId: z.string().optional().describe("Branch identifier."),
        needsMoreThoughts: z.boolean().optional().describe("If more thoughts are needed."),
      }),
      execute: async ({ thought, nextThoughtNeeded, thoughtNumber, totalThoughts, isRevision, revisesThought, branchFromThought, branchId, needsMoreThoughts }) => {
        try {
          const body: any = {
            thought,
            nextThoughtNeeded,
            thoughtNumber,
            totalThoughts,
          };

          if (isRevision !== undefined) body.isRevision = isRevision;
          if (revisesThought !== undefined) body.revisesThought = revisesThought;
          if (branchFromThought !== undefined) body.branchFromThought = branchFromThought;
          if (branchId !== undefined) body.branchId = branchId;
          if (needsMoreThoughts !== undefined) body.needsMoreThoughts = needsMoreThoughts;

          const response = await fetch("http://mcpo-app.eastus.azurecontainer.io:8000/sequential-thinking/sequentialthinking", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          return await response.json();
        } catch (error) {
          return { error: `Failed to process sequential thinking: ${error instanceof Error ? error.message : String(error)}` };
        }
      },
    }),
  },
});
