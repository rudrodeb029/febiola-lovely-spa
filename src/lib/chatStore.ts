export interface ChatMessage {
  id: string;
  sender: "guest" | "admin" | "bot";
  senderName: string;
  text: string;
  timestamp: string;
  timeStr: string;
}

export interface ChatThread {
  id: string;
  guestName: string;
  guestPhone?: string;
  location?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: "active" | "closed";
  messages: ChatMessage[];
}

const DEFAULT_THREADS: ChatThread[] = [
  {
    id: "thread-live-visitor",
    guestName: "Online Visitor (Live)",
    guestPhone: "+1 (646) 431-3060",
    location: "United States",
    lastMessage: "Hello! Welcome to Febiola Lovely Spa USA. How can our wellness concierge assist you?",
    lastMessageTime: "Just now",
    unreadCount: 0,
    status: "active",
    messages: [
      {
        id: "msg-1",
        sender: "bot",
        senderName: "Febiola Concierge",
        text: "Hello! Welcome to Febiola Lovely Spa USA. How can our wellness concierge assist your spa or in-home visit today?",
        timestamp: new Date().toISOString(),
        timeStr: "Just now",
      },
    ],
  },
  {
    id: "thread-jessica",
    guestName: "Jessica Miller",
    guestPhone: "+1 (646) 431-3060",
    location: "Manhattan, New York",
    lastMessage: "Can we request organic eucalyptus oil for our in-home massage?",
    lastMessageTime: "12 mins ago",
    unreadCount: 1,
    status: "active",
    messages: [
      {
        id: "msg-jm-1",
        sender: "guest",
        senderName: "Jessica Miller",
        text: "Hi! I submitted a booking request for the Traditional Massage + Totok Facial on Oct 2nd.",
        timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        timeStr: "02:15 PM",
      },
      {
        id: "msg-jm-2",
        sender: "admin",
        senderName: "Spa Concierge",
        text: "Hello Jessica! We received your reservation for Manhattan. Our certified therapist will arrive with a heated luxury table and fresh linens.",
        timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
        timeStr: "02:22 PM",
      },
      {
        id: "msg-jm-3",
        sender: "guest",
        senderName: "Jessica Miller",
        text: "Wonderful! Can we request organic eucalyptus oil for our in-home massage?",
        timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        timeStr: "02:28 PM",
      },
    ],
  },
  {
    id: "thread-marcus",
    guestName: "Marcus Vance",
    guestPhone: "+1 (310) 849-2104",
    location: "Beverly Hills, California",
    lastMessage: "Thank you, therapist has gate access code #4821.",
    lastMessageTime: "45 mins ago",
    unreadCount: 0,
    status: "active",
    messages: [
      {
        id: "msg-mv-1",
        sender: "guest",
        senderName: "Marcus Vance",
        text: "Hi, just confirming the mobile therapist brings all organic oils and linens for the Full Body Journey?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        timeStr: "01:40 PM",
      },
      {
        id: "msg-mv-2",
        sender: "admin",
        senderName: "Spa Concierge",
        text: "Yes Marcus! Our licensed California therapist brings a complete luxury spa setup including heated table, organic cold-pressed botanicals, and tranquil soundscapes.",
        timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
        timeStr: "01:50 PM",
      },
      {
        id: "msg-mv-3",
        sender: "guest",
        senderName: "Marcus Vance",
        text: "Thank you, therapist has gate access code #4821.",
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        timeStr: "01:55 PM",
      },
    ],
  },
  {
    id: "thread-elena",
    guestName: "Elena Rostova",
    guestPhone: "+1 (305) 774-9021",
    location: "Miami Beach, Florida",
    lastMessage: "Is there availability for a couples scrub this Saturday afternoon?",
    lastMessageTime: "2 hours ago",
    unreadCount: 1,
    status: "active",
    messages: [
      {
        id: "msg-er-1",
        sender: "guest",
        senderName: "Elena Rostova",
        text: "Hello! Is there availability for a couples scrub this Saturday afternoon in Miami?",
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        timeStr: "12:10 PM",
      },
    ],
  },
];

const STORAGE_KEY = "febiola_spa_chat_threads";

export function getChatThreads(): ChatThread[] {
  if (typeof window === "undefined") return DEFAULT_THREADS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_THREADS));
      return DEFAULT_THREADS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // fallback
  }
  return DEFAULT_THREADS;
}

export function saveChatThreads(threads: ChatThread[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
    window.dispatchEvent(new CustomEvent("febiola_chat_update", { detail: threads }));
  } catch {
    // ignore
  }
}

export function sendGuestMessage(
  threadId: string,
  text: string,
  guestName = "Website Visitor"
): { threads: ChatThread[]; autoReplyText?: string } {
  const currentThreads = getChatThreads();
  const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  let thread = currentThreads.find((t) => t.id === threadId);
  if (!thread) {
    thread = {
      id: threadId,
      guestName,
      lastMessage: text,
      lastMessageTime: "Just now",
      unreadCount: 1,
      status: "active",
      messages: [],
    };
    currentThreads.unshift(thread);
  }

  const newMsg: ChatMessage = {
    id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    sender: "guest",
    senderName: guestName,
    text,
    timestamp: new Date().toISOString(),
    timeStr: timeNow,
  };

  thread.messages.push(newMsg);
  thread.lastMessage = text;
  thread.lastMessageTime = "Just now";
  thread.unreadCount += 1;

  // Determine smart concierge answer
  let autoReplyText: string | undefined;
  const lower = text.toLowerCase();
  if (lower.includes("price") || lower.includes("cost") || lower.includes("rate") || lower.includes("menu")) {
    autoReplyText = "Our signature rituals start at $95 (60-min Traditional Massage) up to $175 (105-min Massage + Totok Facial). In-home spa visits are available in all 50 US states!";
  } else if (lower.includes("book") || lower.includes("reserve") || lower.includes("schedule") || lower.includes("home")) {
    autoReplyText = "You can book directly using our Book Now form above. Our US Concierge also answers calls at +1 (646) 431-3060 and WhatsApp at +1 (646) 244-6370.";
  } else if (lower.includes("phone") || lower.includes("call")) {
    autoReplyText = "You can reach our concierge hotline directly at +1 (646) 431-3060 (available 7 days a week, 8 AM – 10 PM EST).";
  } else if (lower.includes("whatsapp")) {
    autoReplyText = "Our WhatsApp concierge is available at +1 (646) 244-6370 for instant booking confirmations and questions.";
  }

  if (autoReplyText) {
    const botMsg: ChatMessage = {
      id: `bot-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sender: "bot",
      senderName: "Febiola Concierge",
      text: autoReplyText,
      timestamp: new Date().toISOString(),
      timeStr: timeNow,
    };
    thread.messages.push(botMsg);
    thread.lastMessage = autoReplyText;
  }

  saveChatThreads(currentThreads);
  return { threads: currentThreads, autoReplyText };
}

export function sendAdminMessage(threadId: string, text: string): ChatThread[] {
  const currentThreads = getChatThreads();
  const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const thread = currentThreads.find((t) => t.id === threadId);
  if (thread) {
    const newMsg: ChatMessage = {
      id: `admin-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sender: "admin",
      senderName: "Spa Concierge (Admin)",
      text,
      timestamp: new Date().toISOString(),
      timeStr: timeNow,
    };
    thread.messages.push(newMsg);
    thread.lastMessage = text;
    thread.lastMessageTime = "Just now";
    thread.unreadCount = 0; // cleared by admin viewing/replying
    saveChatThreads(currentThreads);
  }

  return currentThreads;
}

export function markThreadAsRead(threadId: string): ChatThread[] {
  const currentThreads = getChatThreads();
  const thread = currentThreads.find((t) => t.id === threadId);
  if (thread && thread.unreadCount > 0) {
    thread.unreadCount = 0;
    saveChatThreads(currentThreads);
  }
  return currentThreads;
}

export function subscribeToChat(callback: (threads: ChatThread[]) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleUpdate = () => {
    callback(getChatThreads());
  };

  window.addEventListener("febiola_chat_update", handleUpdate as EventListener);
  window.addEventListener("storage", handleUpdate);

  return () => {
    window.removeEventListener("febiola_chat_update", handleUpdate as EventListener);
    window.removeEventListener("storage", handleUpdate);
  };
}
