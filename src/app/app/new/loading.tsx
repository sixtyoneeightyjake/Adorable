import "@/components/loader.css";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen bg-background">
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
        <div className="text-foreground text-lg font-medium mb-2">Creating App</div>
        <div className="text-muted-foreground text-sm">
          Please wait while we create your new application...
        </div>
      </div>
    </div>
  );
}
