// Placeholder API functions for Valorant stats and chat

export interface PlayerStats {
  username: string;
  region: string;
  rank: string;
  level: number;
  rankImage: string;
  wins: number;
  losses: number;
  kda: string;
  kdRatio: number;
  adr: number;
  headshotPercent: number;
  winRate: number;
  kast: number;
  ddaRound: number;
  kills: number;
  deaths: number;
  assists: number;
  acs: number;
  kadRatio: number;
  killsRound: number;
  firstBloods: number;
  flawlessRounds: number;
  aces: number;
  trackerScore: number;
  roundWinPercent: number;
  recentMatches: MatchData[];
  agentStats: AgentStat[];
  roleStats: RoleStat[];
  weaponStats: WeaponStat[];
  mapStats: MapStat[];
}

export interface RoleStat {
  role: string;
  winRate: number;
  kda: number;
  matches: string;
}

export interface WeaponStat {
  weapon: string;
  kills: number;
  headPercent: number;
  bodyPercent: number;
  legPercent: number;
}

export interface MapStat {
  map: string;
  winRate: number;
  matches: string;
}

export interface MatchData {
  date: string;
  map: string;
  result: "win" | "loss";
  kills: number;
  deaths: number;
  assists: number;
}

export interface AgentStat {
  agent: string;
  matches: number;
  winRate: number;
  avgKills: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchPlayerStats = async (username: string, region: string): Promise<PlayerStats> => {
  await delay(800);
  
  // Mock data
  return {
    username,
    region,
    rank: "Immortal 1",
    level: 328,
    rankImage: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=100&h=100&fit=crop",
    wins: 12,
    losses: 12,
    kda: "1.32",
    kdRatio: 0.80,
    adr: 177.6,
    headshotPercent: 19.5,
    winRate: 50.0,
    kast: 68.9,
    ddaRound: -24,
    kills: 300,
    deaths: 375,
    assists: 123,
    acs: 179.1,
    kadRatio: 1.13,
    killsRound: 0.6,
    firstBloods: 41,
    flawlessRounds: 19,
    aces: 1,
    trackerScore: 251,
    roundWinPercent: 49.8,
    recentMatches: [
      { date: "1d ago", map: "Pearl", result: "loss", kills: 11, deaths: 16, assists: 4 },
      { date: "1d ago", map: "Abyss", result: "loss", kills: 9, deaths: 17, assists: 4 },
      { date: "1d ago", map: "Sunset", result: "win", kills: 7, deaths: 18, assists: 3 },
      { date: "1d ago", map: "Abyss", result: "win", kills: 11, deaths: 9, assists: 7 },
      { date: "1d ago", map: "Sunset", result: "loss", kills: 10, deaths: 17, assists: 4 },
      { date: "2d ago", map: "Split", result: "win", kills: 20, deaths: 20, assists: 3 },
      { date: "2d ago", map: "Bind", result: "loss", kills: 11, deaths: 18, assists: 11 },
      { date: "3d ago", map: "Corrode", result: "win", kills: 14, deaths: 16, assists: 6 },
    ],
    agentStats: [
      { agent: "Clove", matches: 6, winRate: 33.3, avgKills: 18.3 },
      { agent: "Vyse", matches: 5, winRate: 20.0, avgKills: 16.8 },
      { agent: "Sova", matches: 4, winRate: 100.0, avgKills: 15.2 },
    ],
    roleStats: [
      { role: "Initiator", winRate: 80.0, kda: 1.35, matches: "8W - 2L" },
      { role: "Controller", winRate: 28.6, kda: 1.06, matches: "2W - 5L" },
      { role: "Sentinel", winRate: 20.0, kda: 0.92, matches: "1W - 4L" },
      { role: "Duelist", winRate: 50.0, kda: 0.97, matches: "1W - 1L" },
    ],
    weaponStats: [
      { weapon: "Phantom", kills: 124, headPercent: 31, bodyPercent: 65, legPercent: 5 },
      { weapon: "Vandal", kills: 75, headPercent: 33, bodyPercent: 64, legPercent: 3 },
      { weapon: "Classic", kills: 24, headPercent: 31, bodyPercent: 66, legPercent: 3 },
    ],
    mapStats: [
      { map: "Haven", winRate: 100.0, matches: "3W - 0L" },
      { map: "Bind", winRate: 66.7, matches: "2W - 1L" },
      { map: "Pearl", winRate: 50.0, matches: "2W - 2L" },
      { map: "Abyss", winRate: 50.0, matches: "3W - 3L" },
      { map: "Sunset", winRate: 33.3, matches: "1W - 2L" },
      { map: "Corrode", winRate: 33.3, matches: "1W - 2L" },
      { map: "Split", winRate: 0.0, matches: "0W - 2L" },
    ],
  };
};

export const sendChatMessage = async (
  username: string,
  region: string,
  message: string,
  conversationHistory: ChatMessage[]
): Promise<string> => {
  await delay(1200);
  
  // Mock AI responses based on keywords
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes("improve") || lowerMessage.includes("better")) {
    return `Based on your stats, ${username}, I'd recommend:\n\n1. **Crosshair Placement**: Your headshot % is at 24.5%, which is solid but has room for improvement. Focus on keeping your crosshair at head level.\n\n2. **Positioning**: Your ADR of 168 is decent, but consistent positioning can help you trade more effectively.\n\n3. **Agent Pool**: You have a 55.6% win rate with Phoenix - consider playing him more often in your ranked games.`;
  }
  
  if (lowerMessage.includes("agent") || lowerMessage.includes("character")) {
    return `Looking at your agent stats:\n\n• **Jett** (54.2% WR) - Your most played and successful agent\n• **Phoenix** (55.6% WR) - Highest win rate! Consider playing more\n• **Reyna** (50.0% WR) - Decent, but might benefit from VOD review\n\nI'd suggest sticking with Jett and Phoenix for ranked climbs, as they match your playstyle well.`;
  }
  
  if (lowerMessage.includes("rank") || lowerMessage.includes("climb")) {
    return `To climb from Diamond 2:\n\n1. **Consistency**: Your 52.3% win rate is good for steady climbing\n2. **Focus on high-impact rounds**: Your KDA of 1.32 suggests you're trading well\n3. **Communication**: In Diamond, good comms can win rounds\n4. **Map knowledge**: You perform best on Ascent and Split - queue these more\n\nKeep grinding and you'll hit Diamond 3 soon!`;
  }
  
  // Default response
  return `Hey ${username}! I've analyzed your stats from ${region}. With a ${1.32} KDA and 52.3% win rate in Diamond 2, you're on the right track.\n\nWhat specific aspect of your gameplay would you like to improve? I can help with:\n• Agent selection\n• Aim and crosshair placement\n• Game sense and positioning\n• Rank climbing strategies`;
};
