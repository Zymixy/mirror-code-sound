import { useState, useRef } from "react";
import { ArrowLeft, ArrowRight, RotateCw, Home, Star, Search } from "lucide-react";

interface BrowserAppProps {
  initialSearch?: string;
}

export function BrowserApp({ initialSearch = "" }: BrowserAppProps) {
  const [url, setUrl] = useState(initialSearch);
  const [currentUrl, setCurrentUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const formatUrl = (input: string): string => {
    const trimmed = input.trim();
    if (!trimmed) return "";
    
    // Check if it's already a URL
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    
    // Check if it looks like a domain
    if (trimmed.includes(".") && !trimmed.includes(" ")) {
      return `https://${trimmed}`;
    }
    
    // Otherwise, search with Google
    return `https://www.google.com/search?igu=1&q=${encodeURIComponent(trimmed)}`;
  };

  const navigate = (input: string) => {
    const formattedUrl = formatUrl(input);
    if (formattedUrl) {
      setCurrentUrl(formattedUrl);
      setUrl(input);
      setIsLoading(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      navigate(url);
    }
  };

  const goHome = () => {
    setCurrentUrl("");
    setUrl("");
    setIsLoading(false);
  };

  const refresh = () => {
    if (iframeRef.current && currentUrl) {
      setIsLoading(true);
      iframeRef.current.src = currentUrl;
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Browser toolbar */}
      <div className="flex items-center gap-2 p-2 bg-secondary/50 border-b border-border">
        <button 
          onClick={() => window.history.back()}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <button 
          onClick={() => window.history.forward()}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </button>
        <button 
          onClick={refresh}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <RotateCw className={`w-4 h-4 text-muted-foreground ${isLoading ? "animate-spin" : ""}`} />
        </button>
        <button 
          onClick={goHome}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <Home className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-background rounded-full border border-border">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search Google or enter URL"
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
        <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <Star className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {!currentUrl ? (
          <div className="h-full flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full text-center">
              <h2 className="text-3xl font-bold mb-2">Search</h2>
              <p className="text-muted-foreground mb-6">Search the web or enter a URL</p>
              
              <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search Google or enter URL..."
                  className="w-full pl-12 pr-4 py-3 bg-secondary rounded-full text-sm outline-none focus:ring-2 focus:ring-primary/50"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value) {
                      navigate(e.currentTarget.value);
                    }
                  }}
                />
              </div>

              <div className="text-left">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Recent searches</h3>
                <div className="space-y-2">
                  {["do girls poop?", "67 meme", "shrek pics bikini"].map((term) => (
                    <button
                      key={term}
                      onClick={() => navigate(term)}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-left"
                    >
                      <Search className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{term}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={currentUrl}
            className="w-full h-full border-0"
            onLoad={() => setIsLoading(false)}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            title="Browser"
          />
        )}
      </div>
    </div>
  );
}
