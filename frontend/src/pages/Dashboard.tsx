import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MessageCircle, Trophy } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchPlayerStats, PlayerStats } from "@/lib/api";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");
  const region = searchParams.get("region");
  const [activeTab, setActiveTab] = useState("overview");
  
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username || !region) {
      toast.error("Missing username or region");
      navigate("/");
      return;
    }

    const loadStats = async () => {
      try {
        const data = await fetchPlayerStats(username, region);
        setStats(data);
      } catch (error) {
        toast.error("Failed to load stats");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [username, region, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBack />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground">Loading stats...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const tabs = [
    "Overview", "Matches", "Performance", "Agents", "Maps", 
    "Weapons", "Encounters", "Customs", "Crosshairs", "Lineups"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header showBack />

      {/* Profile Header */}
      <div className="border-b border-border/50 bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center overflow-hidden border-2 border-primary/20">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 bg-muted rounded flex items-center justify-center">
                  <span className="text-xs">👁️</span>
                </div>
                <span className="text-sm text-muted-foreground">1,625 Views</span>
              </div>
              <h1 className="text-3xl font-bold">{stats.username}</h1>
              <div className="text-sm text-muted-foreground">#{stats.username} • {stats.region}</div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`py-3 px-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.toLowerCase()
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
                {tab === "Encounters" && (
                  <span className="ml-2 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">NEW</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Game Mode Filters */}
      <div className="border-b border-border/50 bg-background/95">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 overflow-x-auto">
            <button className="px-4 py-2 text-sm rounded-lg bg-muted text-muted-foreground hover:bg-muted/80">
              PC
            </button>
            <button className="px-4 py-2 text-sm rounded-lg bg-muted text-muted-foreground hover:bg-muted/80">
              Console
            </button>
            <div className="w-px h-6 bg-border" />
            <button className="px-6 py-2 text-sm rounded-lg bg-primary text-primary-foreground font-medium">
              Competitive
            </button>
            <button className="px-6 py-2 text-sm rounded-lg bg-muted text-foreground hover:bg-muted/80">
              Premier
            </button>
            <button className="px-6 py-2 text-sm rounded-lg bg-muted text-foreground hover:bg-muted/80">
              Unrated
            </button>
            <button className="px-6 py-2 text-sm rounded-lg bg-muted text-foreground hover:bg-muted/80">
              Team Deathmatch
            </button>
            <button className="px-3 py-2 text-sm rounded-lg bg-muted text-foreground hover:bg-muted/80">
              •••
            </button>
            <div className="ml-auto flex items-center gap-3">
              <button className="px-6 py-2 text-sm rounded-lg bg-primary text-primary-foreground font-medium">
                All Acts
              </button>
              <button className="px-6 py-2 text-sm rounded-lg bg-muted text-foreground hover:bg-muted/80">
                V25: A6
              </button>
              <button className="px-3 py-2 text-sm rounded-lg bg-muted text-foreground hover:bg-muted/80">
                •••
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Current Rating */}
            <Card className="p-4 bg-card border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-sm font-bold uppercase">Current Rating</h3>
                <button className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs">?</button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/50" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }} />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Rating</div>
                  <div className="text-lg font-bold">{stats.rank}</div>
                </div>
              </div>
            </Card>

            {/* Peak Rating */}
            <Card className="p-4 bg-card border-border/50">
              <h3 className="text-sm font-bold uppercase mb-4">Peak Rating</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }} />
                </div>
                <div>
                  <div className="text-lg font-bold">Immortal 1</div>
                  <div className="text-xs text-muted-foreground">50 RR</div>
                  <div className="text-xs text-muted-foreground mt-1">EPISODE 3: ACT II</div>
                </div>
              </div>
            </Card>

            {/* Roles */}
            <Card className="p-4 bg-card border-border/50">
              <h3 className="text-lg font-bold mb-4">ROLES</h3>
              <div className="space-y-3">
                {stats.roleStats.map((role) => (
                  <div key={role.role} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-primary/20" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{role.role}</span>
                        <span className={role.winRate > 50 ? "text-success" : "text-destructive"}>
                          WR {role.winRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>KDA {role.kda}</span>
                        <span>{role.matches}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Top Weapons */}
            <Card className="p-4 bg-card border-border/50">
              <h3 className="text-lg font-bold mb-4">TOP WEAPONS</h3>
              <div className="space-y-4">
                {stats.weaponStats.map((weapon) => (
                  <div key={weapon.weapon}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                        <div className="w-8 h-1 bg-foreground/50" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{weapon.weapon}</div>
                        <div className="text-xs text-muted-foreground">Assault Rifles</div>
                      </div>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-foreground/10 rounded" />
                        <span>{weapon.headPercent}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-foreground/10 rounded" />
                        <span>{weapon.bodyPercent}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-foreground/10 rounded" />
                        <span>{weapon.legPercent}%</span>
                      </div>
                    </div>
                    <div className="text-sm mt-1">
                      <span className="text-muted-foreground">Kills </span>
                      <span className="font-semibold">{weapon.kills}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Top Maps */}
            <Card className="p-4 bg-card border-border/50">
              <h3 className="text-lg font-bold mb-4">TOP MAPS</h3>
              <div className="space-y-2">
                {stats.mapStats.map((map) => (
                  <div key={map.map} className="flex items-center justify-between py-2">
                    <span className="font-medium">{map.map}</span>
                    <div className="text-right">
                      <div className={`font-semibold ${map.winRate > 50 ? "text-success" : map.winRate === 0 ? "text-destructive" : "text-foreground"}`}>
                        {map.winRate.toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">{map.matches}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Rating Overview */}
            <Card className="p-6 bg-gradient-card border-border/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">V25: AG COMPETITIVE OVERVIEW</h2>
                <span className="text-sm text-muted-foreground">12h Playtime / 24 Matches</span>
              </div>

              <div className="flex items-start gap-8 mb-8">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Trophy className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Rating</div>
                  <div className="text-4xl font-bold mb-2">{stats.rank}</div>
                  <div className="text-muted-foreground">Level <span className="text-foreground font-semibold">{stats.level}</span></div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-success">{stats.wins}W</span>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-destructive">{stats.losses}L</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Primary Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-background/50 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">Damage/Round</div>
                  <div className="text-2xl font-bold">{stats.adr}</div>
                  <div className="text-xs text-muted-foreground">Bottom 14.0%</div>
                </div>
                <div className="bg-background/50 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">K/D Ratio</div>
                  <div className="text-2xl font-bold">{stats.kdRatio}</div>
                  <div className="text-xs text-muted-foreground">Bottom 13.0%</div>
                </div>
                <div className="bg-background/50 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">Headshot %</div>
                  <div className="text-2xl font-bold">{stats.headshotPercent}%</div>
                  <div className="text-xs text-muted-foreground">Bottom 45.0%</div>
                </div>
                <div className="bg-background/50 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">Win %</div>
                  <div className="text-2xl font-bold">{stats.winRate}%</div>
                  <div className="text-xs text-muted-foreground">Bottom 50.0%</div>
                </div>
              </div>

              {/* Secondary Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Wins</div>
                  <div className="text-xl font-bold">{stats.wins}</div>
                  <div className="text-xs text-muted-foreground">Top 28.0%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">KAST</div>
                  <div className="text-xl font-bold">{stats.kast}%</div>
                  <div className="text-xs text-muted-foreground">Bottom 34.0%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">DDA/Round</div>
                  <div className="text-xl font-bold">{stats.ddaRound}</div>
                  <div className="text-xs text-muted-foreground">Bottom 13.0%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Kills</div>
                  <div className="text-xl font-bold">{stats.kills}</div>
                  <div className="text-xs text-muted-foreground">Top 44.0%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Deaths</div>
                  <div className="text-xl font-bold">{stats.deaths}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Assists</div>
                  <div className="text-xl font-bold">{stats.assists}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">ACS</div>
                  <div className="text-xl font-bold">{stats.acs}</div>
                  <div className="text-xs text-muted-foreground">Bottom 14.0%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">KAD Ratio</div>
                  <div className="text-xl font-bold">{stats.kadRatio}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Kills/Round</div>
                  <div className="text-xl font-bold">{stats.killsRound}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">First Bloods</div>
                  <div className="text-xl font-bold">{stats.firstBloods}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Flawless Roun...</div>
                  <div className="text-xl font-bold">{stats.flawlessRounds}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Aces</div>
                  <div className="text-xl font-bold">{stats.aces}</div>
                </div>
              </div>

              {/* Tracker Score */}
              <div className="mt-6 bg-background/50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Tracker Score</div>
                    <div className="text-2xl font-bold">{stats.trackerScore} <span className="text-sm text-muted-foreground">/1000</span></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Round Win %</div>
                  <div className="text-xl font-bold">{stats.roundWinPercent}%</div>
                  <div className="text-xs text-muted-foreground">C - Bottom 45.0%</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">KAST</div>
                  <div className="text-xl font-bold">{stats.kast}%</div>
                  <div className="text-xs text-muted-foreground">C - Bottom 34.0%</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">ACS</div>
                  <div className="text-xl font-bold">{stats.acs}</div>
                  <div className="text-xs text-muted-foreground">D - Bottom 14.0%</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">DDA/Round</div>
                  <div className="text-xl font-bold">{stats.ddaRound}</div>
                  <div className="text-xs text-muted-foreground">D - Bottom 13.0%</div>
                </div>
              </div>
            </Card>

            {/* Top Agents */}
            <Card className="p-6 bg-card border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">TOP AGENTS</h3>
                <span className="text-sm text-muted-foreground">Based on total agent playtime during V25: A6.</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="py-3 px-4 text-sm font-medium text-muted-foreground">Agent</th>
                      <th className="py-3 px-4 text-sm font-medium text-muted-foreground text-center">Matches</th>
                      <th className="py-3 px-4 text-sm font-medium text-muted-foreground text-center">Win %</th>
                      <th className="py-3 px-4 text-sm font-medium text-muted-foreground text-center">K/D</th>
                      <th className="py-3 px-4 text-sm font-medium text-muted-foreground text-center">ADR</th>
                      <th className="py-3 px-4 text-sm font-medium text-muted-foreground text-center">ACS</th>
                      <th className="py-3 px-4 text-sm font-medium text-muted-foreground text-center">DDA</th>
                      <th className="py-3 px-4 text-sm font-medium text-muted-foreground text-right">Most Played</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.agentStats.map((agent, idx) => (
                      <tr key={agent.agent} className="border-b border-border/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-primary/10" />
                            <div>
                              <div className="font-medium">{agent.agent}</div>
                              <div className="text-xs text-muted-foreground">3.2 hours</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-medium">{agent.matches}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={agent.winRate > 50 ? "text-success font-medium" : agent.winRate === 100 ? "text-success font-medium" : "text-destructive font-medium"}>
                            {agent.winRate.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-medium">
                          {idx === 0 ? "0.75" : idx === 1 ? "0.73" : "1.07"}
                        </td>
                        <td className="py-3 px-4 text-center font-medium">
                          {idx === 0 ? "125.3" : idx === 1 ? "117.9" : "127.2"}
                        </td>
                        <td className="py-3 px-4 text-center font-medium">
                          {idx === 0 ? "191.3" : idx === 1 ? "174.6" : "192.4"}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={idx === 2 ? "text-success" : "text-destructive"}>
                            {idx === 0 ? "-35" : idx === 1 ? "-24" : "+7"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-sm">
                            {idx === 0 ? "Pearl 50%" : idx === 1 ? "Sunset 0%" : "Abyss 100%"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Last 20 Matches */}
            <Card className="p-6 bg-card border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">LAST 20 MATCHES</h3>
              </div>
              <div className="space-y-3">
                {stats.recentMatches.map((match, idx) => (
                  <div 
                    key={idx}
                    className={`p-4 rounded-lg border ${
                      match.result === "win" 
                        ? "bg-success/5 border-success/20" 
                        : "bg-destructive/5 border-destructive/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded bg-background/50 flex items-center justify-center">
                          <Trophy className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-semibold">{match.map}</div>
                          <div className="text-sm text-muted-foreground">{match.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-center">
                        <div>
                          <div className="text-xs text-muted-foreground">Score</div>
                          <div className="font-bold">
                            <span className={match.result === "win" ? "text-success" : "text-destructive"}>
                              {match.kills}
                            </span>
                            {" : "}
                            <span className={match.result === "loss" ? "text-destructive" : "text-success"}>
                              {match.deaths}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">K/D/A</div>
                          <div className="font-medium text-sm">{match.kills} / {match.deaths} / {match.assists}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">K/D</div>
                          <div className="font-medium">{(match.kills / Math.max(match.deaths, 1)).toFixed(1)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Chat CTA */}
            <Card className="p-8 bg-gradient-primary border-0 text-center shadow-glow">
              <h3 className="text-2xl font-bold text-white mb-2">
                Want Personalized Coaching?
              </h3>
              <p className="text-white/90 mb-6">
                Chat with our AI coach to get insights on how to improve your gameplay
              </p>
              <Button
                onClick={() => navigate(`/chat?username=${username}&region=${region}`)}
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Chat with Coach
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
