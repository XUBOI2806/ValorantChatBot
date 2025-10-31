import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Send, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import ChatBubble from "@/components/ChatBubble";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { sendChatMessage, ChatMessage } from "@/lib/api";
import { toast } from "sonner";

const suggestedQuestions = [
  "How can I improve my gameplay?",
  "Which agent should I play?",
  "Tips for ranking up?",
  "How's my aim?",
];

const Chat = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");
  const region = searchParams.get("region");
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!username || !region) {
      toast.error("Missing username or region");
      navigate("/");
      return;
    }

    // Initial greeting
    const greeting: ChatMessage = {
      role: "assistant",
      content: `Hey ${username}! I'm your AI Valorant coach. I've analyzed your stats and I'm here to help you improve. What would you like to know?`,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages([greeting]);
  }, [username, region, navigate]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendChatMessage(
        username!,
        region!,
        input,
        messages
      );

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast.error("Failed to send message");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        showBack
        playerInfo={username && region ? { username, region } : undefined}
      />

      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 max-h-[calc(100vh-80px)]">
        {/* Sidebar with suggested questions */}
        <aside className="lg:w-64 flex-shrink-0">
          <Card className="p-4 bg-gradient-card border-border/50 sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Suggested Questions</h3>
            </div>
            <div className="space-y-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-sm transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </Card>
        </aside>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-h-0">
          <Card className="flex-1 bg-gradient-card border-border/50 flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <ChatBubble
                  key={index}
                  message={message.content}
                  isUser={message.role === "user"}
                  timestamp={message.timestamp}
                />
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything about your gameplay..."
                  className="flex-1 bg-background border-border"
                  disabled={loading}
                />
                <Button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Chat;
