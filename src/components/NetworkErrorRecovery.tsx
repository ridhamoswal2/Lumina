import React, { useState, useEffect } from "react";
import { AlertTriangle, WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NetworkErrorRecoveryProps {
  onRetry: () => void;
  isRetrying?: boolean;
}

const NetworkErrorRecovery: React.FC<NetworkErrorRecoveryProps> = ({ onRetry, isRetrying = false }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="max-w-md w-full glass-morphism rounded-lg p-8 text-center">
        {isOnline ? (
          <>
            <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
            <h1 className="text-2xl font-bold mb-2">Unable to Load Content</h1>
            <p className="text-muted-foreground mb-6">
              The website failed to load the content. This might be a temporary issue with the server, your internet connection, or your browser's cache.
            </p>
            <div className="space-y-3 mb-6 text-left text-sm">
              <p className="font-semibold mb-2">Try these steps:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Clear your browser cache and cookies</li>
                <li>Disable browser extensions (especially ad blockers)</li>
                <li>Try a different browser</li>
                <li>Check if your WiFi or internet connection is stable</li>
                <li>Disable VPN if you're using one</li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <WifiOff className="h-16 w-16 mx-auto mb-4 text-red-500" />
            <h1 className="text-2xl font-bold mb-2">No Internet Connection</h1>
            <p className="text-muted-foreground mb-6">
              Your device appears to be offline. Please check your internet connection and try again.
            </p>
          </>
        )}

        <Button 
          onClick={onRetry} 
          disabled={isRetrying || !isOnline}
          className="rounded-full w-full"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRetrying ? "animate-spin" : ""}`} />
          {isRetrying ? "Loading..." : "Try Again"}
        </Button>

        <p className="text-xs text-muted-foreground mt-4">
          Status: {isOnline ? "Online" : "Offline"}
        </p>
      </div>
    </div>
  );
};

export default NetworkErrorRecovery;
