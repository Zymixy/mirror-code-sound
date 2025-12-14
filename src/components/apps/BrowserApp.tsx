import { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCw, Home, Star } from "lucide-react";

const recentSearches = [
  "67 meme",
  "how to sigma alfa",
  "how to drink water",
];

export function BrowserApp() {
  const [url, setUrl] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (query: string) => {
    setUrl(query);
    setIsSearching(true);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Browser toolbar */}
      <div className="flex items-center gap-2 p-2 bg-secondary/50 border-b border-border">
        <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </button>
        <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <RotateCw className="w-4 h-4 text-muted-foreground" />
        </button>
        <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <Home className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-background rounded-full">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Search or enter URL"
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
        <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <Star className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        {!isSearching ? (
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Search</h2>

            <div className="relative mb-8">
              <input
                type="text"
                placeholder="Search the web..."
                className="w-full px-4 py-3 bg-secondary rounded-full text-sm outline-none focus:ring-2 focus:ring-primary/50"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value) {
                    handleSearch(e.currentTarget.value);
                  }
                }}
              />
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Recent Searches</h3>
              <div className="space-y-1">
                {recentSearches.map((search, i) => (
                  <button
                    key={i}
                    onClick={() => handleSearch(search)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-left"
                  >
                    <RotateCw className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Searching for "{url}"...</p>
            <button
              onClick={() => setIsSearching(false)}
              className="mt-4 px-4 py-2 bg-secondary rounded-lg text-sm hover:bg-secondary/80"
            >
              Back to Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
