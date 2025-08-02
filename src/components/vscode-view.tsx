"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { ArrowLeftIcon, ExternalLinkIcon, RefreshCwIcon } from "lucide-react";

interface VSCodeViewProps {
  codeServerUrl: string;
  onBack: () => void;
}

export function VSCodeView({ codeServerUrl, onBack }: VSCodeViewProps) {
  const [iframeKey, setIframeKey] = useState(0);

  const refreshIframe = () => {
    setIframeKey(prev => prev + 1);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="h-12 border-b border-border items-center flex px-2 bg-background sticky top-0 justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-foreground hover:text-primary"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <img
              src="/logos/vscode.svg"
              className="h-4 w-4"
              alt="VS Code Logo"
            />
            <span className="text-sm font-medium text-foreground">VS Code</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={refreshIframe}
            title="Refresh VS Code"
          >
            <RefreshCwIcon className="h-4 w-4" />
          </Button>
          <a href={codeServerUrl} target="_blank" rel="noopener noreferrer">
            <Button
              variant="ghost"
              size="icon"
              title="Open in new tab"
            >
              <ExternalLinkIcon className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>

      {/* VS Code iframe */}
      <div className="flex-1 relative">
        <iframe
          key={iframeKey}
          src={codeServerUrl}
          className="w-full h-full border-0"
          title="VS Code Editor"
          allow="clipboard-read; clipboard-write"
          sandbox="allow-same-origin allow-scripts allow-forms allow-downloads allow-modals allow-popups allow-presentation"
        />
      </div>
    </div>
  );
}
