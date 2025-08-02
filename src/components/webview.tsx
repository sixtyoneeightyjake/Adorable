"use client";

import { requestDevServer as requestDevServerInner } from "./webview-actions";
import "./loader.css";
import {
  FreestyleDevServer,
  FreestyleDevServerHandle,
} from "freestyle-sandboxes/react/dev-server";
import { useRef } from "react";
import { Button } from "./ui/button";
import { RefreshCwIcon } from "lucide-react";
import { ShareButton } from "./share-button";
import Image from "next/image";

export default function WebView(props: {
  repo: string;
  baseId: string;
  appId: string;
  domain?: string;
}) {
  function requestDevServer({ repoId }: { repoId: string }) {
    return requestDevServerInner({ repoId });
  }

  const devServerRef = useRef<FreestyleDevServerHandle>(null);

  return (
    <div className="flex flex-col overflow-hidden h-screen border-l border-border transition-opacity duration-700 mt-[2px] bg-background">
      <div className="h-12 border-b border-border items-center flex px-2 bg-background sticky top-0 justify-end gap-2">
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => devServerRef.current?.refresh()}
        >
          <RefreshCwIcon />
        </Button>
        <ShareButton domain={props.domain} appId={props.appId} />
      </div>
      <FreestyleDevServer
        ref={devServerRef}
        actions={{ requestDevServer }}
        repoId={props.repo}
        loadingComponent={({ iframeLoading, devCommandRunning }) =>
          !devCommandRunning && (
            <div className="flex items-center justify-center h-full bg-background">
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <Image
                    src="/logos/mojo.svg"
                    alt="Mojo Code"
                    width={120}
                    height={120}
                    className="animate-pulse"
                    priority
                  />
                </div>
                <div className="text-foreground text-lg font-medium mb-2">
                  {iframeLoading ? "JavaScript Loading" : "Starting VM"}
                </div>
                <div className="text-muted-foreground text-sm">
                  Please wait while we prepare your environment...
                </div>
              </div>
            </div>
          )
        }
      />
    </div>
  );
}
