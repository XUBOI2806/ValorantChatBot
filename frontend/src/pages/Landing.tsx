import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Target, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const Landing = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [region, setRegion] = useState("");

  const handleSearch = () => {
    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }
    if (!region) {
      toast.error("Please select a region");
      return;
    }
    
    navigate(`/dashboard?username=${encodeURIComponent(username)}&region=${region}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Target className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Valorant Coach</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Level Up Your Game
            </h1>
            <p className="text-xl text-muted-foreground">
              Get AI-powered coaching insights and track your Valorant performance
            </p>
          </div>

          <div className="bg-gradient-card border border-border/50 rounded-2xl p-8 shadow-glow space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Username
                </label>
                <Input
                  placeholder="Enter your Valorant username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="h-12 bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Region
                </label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger className="h-12 bg-background border-border">
                    <SelectValue placeholder="Select your region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NA">North America</SelectItem>
                    <SelectItem value="EU">Europe</SelectItem>
                    <SelectItem value="AP">Asia Pacific</SelectItem>
                    <SelectItem value="KR">Korea</SelectItem>
                    <SelectItem value="BR">Brazil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleSearch}
              className="w-full h-12 bg-gradient-primary hover:opacity-90 text-white font-semibold text-lg"
              size="lg"
            >
              <Search className="mr-2 h-5 w-5" />
              Search Stats
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Analyze your performance • Get personalized coaching • Improve your rank</p>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Valorant Coach - AI-Powered Performance Analytics</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
