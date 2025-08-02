import { UIMessage } from "ai";

// Number of recent messages to keep intact
const keepIntact = 2;

/**
 * Non-destructively truncates file contents in tool calls and results to reduce token usage
 * Returns a new array of messages with truncated content while preserving the originals
 */
export function truncateFileToolCalls(messages: UIMessage[]): UIMessage[] {
  const messagesToProcess = messages.slice(0, -keepIntact);
  const messagesToKeep = messages.slice(-keepIntact);

  // Create deep copies and truncate the copies
  const truncatedMessages = messagesToProcess.map((message) => {
    // If not assistant message or no parts, return as is
    if (message.role !== "assistant" || !message.parts) {
      return structuredClone(message);
    }

    // Create a deep copy of the message
    const messageCopy = structuredClone(message);

    // Process each part in the copied message
    if (messageCopy.parts) {
      for (const part of messageCopy.parts) {
        if (!part.type.startsWith("tool-")) continue;

        // Extract tool name from the type (e.g., "tool-read_file" -> "read_file")
        const toolName = part.type.replace("tool-", "");

        if (!toolName) continue;

        // Cast to any to access tool invocation properties
        const toolPart = part as any;

        // Handle tool calls with file content
        if (toolName === "read_file" || toolName === "read_multiple_files") {
          // Truncate the result if it exists
          if (toolPart.state === "output-available" && toolPart.output) {
            if (typeof toolPart.output === "string") {
              toolPart.output = "[File content truncated to save tokens]";
            } else if (Array.isArray(toolPart.output)) {
              toolPart.output = [
                {
                  type: "text",
                  text: "[File content truncated to save tokens]",
                },
              ];
            }
          }
        }
        // Handle write_file and edit_file tool calls
        else if (toolName === "write_file" || toolName === "edit_file") {
          // Truncate the args in the tool call
          if (toolPart.input && typeof toolPart.input === "object") {
            if ("content" in toolPart.input) {
              toolPart.input.content =
                "[Content truncated to save tokens]";
            }
            if (
              "edits" in toolPart.input &&
              Array.isArray(toolPart.input.edits)
            ) {
              for (const edit of toolPart.input.edits) {
                if ("replacement" in edit) {
                  edit.replacement = "[Content truncated to save tokens]";
                }
              }
            }
          }

          // Also truncate any diff output in the results
          if (toolPart.state === "output-available" && toolPart.output) {
            if (
              typeof toolPart.output === "string" &&
              toolPart.output.includes("diff")
            ) {
              toolPart.output =
                "[Diff output truncated to save tokens]";
            } else if (Array.isArray(toolPart.output)) {
              toolPart.output = [
                {
                  type: "text",
                  text: "[Diff output truncated to save tokens]",
                },
              ];
            }
          }
        }
        // Handle directory listings - truncate large outputs
        else if (toolName === "list_directory" || toolName === "search_files") {
          if (toolPart.state === "output-available" && toolPart.output) {
            if (
              Array.isArray(toolPart.output) &&
              toolPart.output.length > 0 &&
              typeof toolPart.output[0].text === "string" &&
              toolPart.output[0].text.split("\n").length > 10
            ) {
              const originalText = toolPart.output[0].text;
              const firstFewLines = originalText
                .split("\n")
                .slice(0, 5)
                .join("\n");
              toolPart.output = [
                {
                  type: "text",
                  text: `${firstFewLines}\n\n[...Directory listing truncated to save tokens...]`,
                },
              ];
            }
          }
        }
        // Handle exec tool - truncate long commands and outputs
        else if (toolName === "exec") {
          // Truncate the command if it's very long
          if (
            toolPart.input &&
            typeof toolPart.input === "object" &&
            "command" in toolPart.input
          ) {
            const command = String(toolPart.input.command);
            if (command.length > 200) {
              toolPart.input.command =
                command.substring(0, 100) +
                "... [command truncated to save tokens]";
            }
          }

          // Truncate the result if it exists and is long
          if (toolPart.state === "output-available" && toolPart.output) {
            if (typeof toolPart.output === "string") {
              const content = toolPart.output;
              if (content.length > 500) {
                const lines = content.split("\n");
                if (lines.length > 20) {
                  // Keep first 10 and last 5 lines
                  const truncatedContent = [
                    ...lines.slice(0, 10),
                    "\n[... exec output truncated to save tokens (removed " +
                      (lines.length - 15) +
                      " lines) ...]\n",
                    ...lines.slice(-5),
                  ].join("\n");
                  toolPart.output = truncatedContent;
                } else if (content.length > 1000) {
                  // If it's just a few very long lines
                  toolPart.output =
                    content.substring(0, 300) +
                    "\n\n[... exec output truncated to save tokens (removed " +
                    (content.length - 600) +
                    " characters) ...]\n\n" +
                    content.substring(content.length - 300);
                }
              }
            } else if (
              Array.isArray(toolPart.output) &&
              toolPart.output.length > 0 &&
              typeof toolPart.output[0].text === "string"
            ) {
              const text = toolPart.output[0].text;
              if (text.length > 500) {
                const lines = text.split("\n");
                if (lines.length > 20) {
                  // Keep first 10 and last 5 lines
                  const truncatedText = [
                    ...lines.slice(0, 10),
                    "\n[... exec output truncated to save tokens (removed " +
                      (lines.length - 15) +
                      " lines) ...]\n",
                    ...lines.slice(-5),
                  ].join("\n");
                  toolPart.output = [
                    { type: "text", text: truncatedText },
                  ];
                } else if (text.length > 1000) {
                  // If it's just a few very long lines
                  const truncatedText =
                    text.substring(0, 300) +
                    "\n\n[... exec output truncated to save tokens (removed " +
                    (text.length - 600) +
                    " characters) ...]\n\n" +
                    text.substring(text.length - 300);
                  toolPart.output = [
                    { type: "text", text: truncatedText },
                  ];
                }
              }
            }
          }
        }
      }
    }

    return messageCopy;
  });

  // Combine truncated messages with messages to keep intact
  return [
    ...truncatedMessages,
    ...messagesToKeep.map((m) => structuredClone(m)),
  ];
}

export function repairBrokenMessages(messages: UIMessage[]) {
  for (const message of messages) {
    if (message.role !== "assistant" || !message.parts) continue;

    for (const part of message.parts) {
      if (!part.type.startsWith("tool-")) continue;

      const toolPart = part as any;
      if (toolPart.state === "output-available" && toolPart.output)
        continue;

      // Set the tool part to have an error output
      toolPart.state = "output-available";
      toolPart.output = [{ type: "text", text: "unknown error" }];
      toolPart.isError = true;
    }
  }
}
