
import React from "react";
import { Play, X, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ServerSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onServerSelect: (serverUrl: string) => void;
  item: {
    id: number;
    title?: string;
    name?: string;
  };
  mediaType: "movie" | "tv";
  season?: number;
  episode?: number;
}

const ServerSelector: React.FC<ServerSelectorProps> = ({
  isOpen,
  onClose,
  onServerSelect,
  item,
  mediaType,
  season = 1,
  episode = 1,
}) => {
  const servers = [
    {
      id: 1,
      getUrl: () => {
        if (mediaType === "movie") {
          return `https://player.videasy.net/movie/${item.id}`;
        } else {
          return `https://player.videasy.net/tv/${item.id}/${season}/${episode}?nextEpisode=true&episodeSelector=true`;
        }
      },
    },
    
    {
      id: 2,
      getUrl: () => {
        if (mediaType === "movie") {
          return `https://vidsrc.xyz/embed/movie/${item.id}`;
        } else {
          return `https://vidsrc.xyz/embed/tv/${item.id}/${season}/${episode}`;
        }
      },
    },
    {
      id: 3,
      getUrl: () => {
        if (mediaType === "movie") {
          return `https://vidfast.pro/movie/${item.id}?autoPlay=true`;
        } else {
          return `https://vidfast.pro/tv/${item.id}/${season}/${episode}?autoPlay=true`;
        }
      },
    },
    {
      id: 4,
      getUrl: () => {
        if (mediaType === "movie") {
          return `https://anyembed.xyz/movie/${item.id}?server=${3}`;
        } else {
          return `https://anyembed.xyz/tv/${item.id}/${season}/${episode}?server=${4}`;
        }
      },
    },
    {
      id: 5,
      getUrl: () => {
        if (mediaType === "movie") {
          return `https://www.2embed.stream/embed/movie/${item.id}`;
        } else {
          return `https://vidsrc.me/embed/tv/${item.id}/${season}/${episode}?server=${4}`;
        }
      },
    },
    
  ];

  const handleServerSelect = (server: typeof servers[0]) => {
    const url = server.getUrl();
    onServerSelect(url);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Select Server
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Choose a server to watch {item.title || item.name}
          </p>
          
          <div className="space-y-2">
            {servers.map((server) => (
              <Button
                key={server.id}
                variant="outline"
                className="w-full justify-center h-12 hover:bg-primary/5"
                onClick={() => handleServerSelect(server)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                    <Play className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Server {server.id}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServerSelector;
