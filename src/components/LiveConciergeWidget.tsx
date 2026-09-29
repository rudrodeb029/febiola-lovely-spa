import React, { useState, useRef, useEffect } from "react";
import {
  Flower2,
  X,
  MessageCircle,
  Phone,
  PhoneCall,
  MessageSquare,
  Send,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Check,
  Clock,
  ShieldCheck,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getChatThreads,
  sendGuestMessage,
  subscribeToChat,
  ChatMessage,
} from "@/lib/chatStore";

interface LiveConciergeWidgetProps {
  onOpenBooking: (serviceName?: string) => void;
}

export function LiveConciergeWidget({ onOpenBooking }: LiveConciergeWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMode, setChatMode] = useState<"menu" | "livechat">("menu");
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const threads = getChatThreads();
    const liveThread = threads.find((t) => t.id === "thread-live-visitor");
    return (
      liveThread?.messages || [
        {
          id: "msg-1",
          sender: "bot",
          senderName: "Febiola Concierge",
          text: "Hello! Welcome to Febiola Lovely Spa USA. How can our wellness concierge assist your spa or in-home visit today?",
          timestamp: new Date().toISOString(),
          timeStr: "Just now",
        },
      ]
    );
  });
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to real-time chat updates (Admin replies or storage updates)
  useEffect(() => {
    const unsubscribe = subscribeToChat((threads) => {
      const liveThread = threads.find((t) => t.id === "thread-live-visitor");
      if (liveThread?.messages) {
        setMessages(liveThread.messages);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (chatMode === "livechat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, chatMode, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    if (!textToSend) setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const result = sendGuestMessage("thread-live-visitor", text, "Website Visitor");
      const liveThread = result.threads.find((t) => t.id === "thread-live-visitor");
      if (liveThread) {
        setMessages(liveThread.messages);
      }
      setIsTyping(false);
    }, 400);
  };

  const phoneHref = "tel:+16464313060";
  const smsHref = "sms:+16464313060";
  const whatsappHref =
    "https://wa.me/16462446370?text=Hello%20Febiola%20Spa%2C%20I'd%20like%20to%20inquire%20about%20a%20spa%20ritual.";

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {/* Floating Action Modal / Flyout Menu */}
      {isOpen && (
        <div className="fixed inset-x-3.5 bottom-20 sm:static sm:inset-x-auto sm:mb-3 w-auto sm:w-[380px] max-w-[380px] mx-auto overflow-hidden rounded-2xl border border-gold/30 bg-card text-card-foreground shadow-2xl animate-in fade-in zoom-in-95 duration-200 backdrop-blur-md">
          {/* Header */}
          <div className="bg-[#4A3423] p-4 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {chatMode === "livechat" && (
                  <button
                    onClick={() => setChatMode("menu")}
                    className="mr-1 rounded-full p-1 hover:bg-white/10 transition-colors"
                    aria-label="Back to menu"
                  >
                    <ArrowLeft className="size-4" />
                  </button>
                )}
                <div className="relative">
                  <div className="grid size-10 place-items-center rounded-full border border-gold/60 bg-[#352519] text-gold">
                    <Flower2 className="size-5" strokeWidth={1.4} />
                  </div>
                  <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-[#4A3423]" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-medium tracking-wide">
                    Febiola Concierge
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Menu Mode: WhatsApp, Phone Call/SMS, Live Web Chat */}
          {chatMode === "menu" ? (
            <div className="p-4 space-y-3 bg-card">
              {/* 1. Live Web Chat Option */}
              <button
                onClick={() => setChatMode("livechat")}
                className="w-full group flex items-center justify-between p-3.5 rounded-xl border border-border/80 bg-background hover:border-gold/60 hover:bg-gold/5 transition-all text-left shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-full bg-gold/15 text-gold group-hover:bg-gold group-hover:text-[#4A3423] transition-colors">
                    <MessageSquare className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-foreground">
                      Live Web Chat
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Instant chat with wellness assistant
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-muted-foreground group-hover:text-gold transition-colors" />
              </button>

              {/* 2. WhatsApp Direct */}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="w-full group flex items-center justify-between p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/60 transition-all text-left shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-full bg-emerald-500 text-white shadow-sm">
                    <MessageCircle className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-semibold text-foreground">
                        WhatsApp Concierge
                      </h4>
                      <span className="text-[9px] font-medium bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.2 rounded-full">
                        Fastest
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-muted-foreground">
                      +1 (646) 244-6370
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-muted-foreground group-hover:text-emerald-600 transition-colors" />
              </a>

              {/* 3. Phone Call & SMS */}
              <div className="p-3.5 rounded-xl border border-border/80 bg-background shadow-sm space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary">
                    <PhoneCall className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-foreground">
                      Phone &amp; SMS Inquiries
                    </h4>
                    <p className="text-[11px] font-medium text-primary">
                      +1 (646) 431-3060
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={phoneHref}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm text-center"
                  >
                    <Phone className="size-3.5" /> Call Now
                  </a>
                  <a
                    href={smsHref}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-border bg-card text-foreground text-xs font-medium hover:bg-accent transition-colors text-center"
                  >
                    <MessageSquare className="size-3.5 text-muted-foreground" /> Send SMS
                  </a>
                </div>
              </div>

              {/* Quick Booking Button */}
              <Button
                variant="spa"
                size="sm"
                className="w-full rounded-xl mt-1"
                onClick={() => {
                  setIsOpen(false);
                  onOpenBooking();
                }}
              >
                Book a Ritual Online
              </Button>
            </div>
          ) : (
            /* Live Chat Mode */
            <div className="flex flex-col h-[360px] bg-background">
              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
                {messages.map((msg) => {
                  const isGuest = msg.sender === "guest";
                  const isAdmin = msg.sender === "admin";
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isGuest ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[84%] rounded-2xl px-3.5 py-2.5 shadow-sm leading-relaxed ${
                          isGuest
                            ? "bg-primary text-primary-foreground rounded-br-none"
                            : isAdmin
                            ? "bg-gold/15 text-foreground border border-gold/40 rounded-bl-none"
                            : "bg-muted/80 text-foreground border border-border/50 rounded-bl-none"
                        }`}
                      >
                        {isAdmin && (
                          <div className="flex items-center gap-1 mb-1 text-[10px] font-semibold text-gold">
                            <ShieldCheck className="size-3" />
                            <span>Spa Concierge (Verified)</span>
                          </div>
                        )}
                        <p>{msg.text}</p>
                        <span className="block text-[9px] mt-1 opacity-60 text-right">
                          {msg.timeStr}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted/80 text-muted-foreground rounded-2xl rounded-bl-none px-3 py-2 border border-border/50 flex items-center gap-1 text-[11px]">
                      <span className="size-1.5 rounded-full bg-gold animate-bounce" />
                      <span className="size-1.5 rounded-full bg-gold animate-bounce [animation-delay:0.2s]" />
                      <span className="size-1.5 rounded-full bg-gold animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestion Pills */}
              <div className="px-3 py-1.5 border-t border-border/50 bg-muted/20 flex gap-1.5 overflow-x-auto no-scrollbar">
                {[
                  "Book In-Home Visit",
                  "View Pricing",
                  "Call Concierge",
                ].map((pill) => (
                  <button
                    key={pill}
                    onClick={() => {
                      if (pill === "Book In-Home Visit") {
                        setIsOpen(false);
                        onOpenBooking("In-Home Spa Ritual (US Nationwide)");
                      } else {
                        handleSendMessage(pill);
                      }
                    }}
                    className="shrink-0 px-2.5 py-1 rounded-full bg-background border border-border/70 text-[10px] text-muted-foreground hover:text-gold hover:border-gold transition-colors"
                  >
                    {pill}
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-2.5 border-t border-border flex items-center gap-2 bg-card"
              >
                <input
                  type="text"
                  placeholder="Type a message to concierge..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 bg-background border border-input rounded-full px-3.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="grid size-8 place-items-center rounded-full bg-[#4A3423] text-gold hover:bg-[#352519] disabled:opacity-40 disabled:pointer-events-none transition-all shadow"
                  aria-label="Send message"
                >
                  <Send className="size-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Main Floating Trigger Button (Matches Favicon Logo Mark) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex size-14 items-center justify-center rounded-full bg-[#4A3423] text-[#E5C378] shadow-2xl ring-2 ring-[#E5C378]/70 hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Open live chat and contact concierge"
      >
        {/* Animated Ripple Halo */}
        <span className="absolute inset-0 rounded-full bg-[#E5C378]/20 animate-ping duration-1000 -z-10" />

        {/* Brand Flower2 Icon matching Favicon or Close Icon */}
        {isOpen ? (
          <X className="size-6 transition-transform duration-200" />
        ) : (
          <Flower2 className="size-7 stroke-[1.4] transition-transform duration-300 group-hover:rotate-12" />
        )}

        {/* Live Status Badge Dot */}
        <span className="absolute top-0 right-0 flex size-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-background">
          <span className="size-1.5 rounded-full bg-white animate-pulse" />
        </span>
      </button>
    </div>
  );
}
