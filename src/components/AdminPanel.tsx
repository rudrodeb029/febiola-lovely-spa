import React, { useState, useEffect, useRef } from "react";
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  DollarSign,
  Download,
  Filter,
  Flower2,
  Home,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
  PhoneCall,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingUp,
  User,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  getChatThreads,
  sendAdminMessage,
  markThreadAsRead,
  subscribeToChat,
  ChatThread,
  ChatMessage,
} from "@/lib/chatStore";

export interface Reservation {
  id: string;
  guestName: string;
  guestPhone: string;
  service: string;
  state: string;
  city: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  price: string;
  createdAt: string;
}

const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: "RES-1049",
    guestName: "Jessica Miller",
    guestPhone: "+1 (646) 431-3060",
    service: "Traditional Massage + Totok Facial",
    state: "New York",
    city: "Manhattan, NY",
    date: "2026-10-02",
    timeSlot: "01:30 PM",
    notes: "Prefers organic lavender oil, shoulder tension focus.",
    status: "Pending",
    price: "$175",
    createdAt: "2026-09-29 14:20",
  },
  {
    id: "RES-1048",
    guestName: "Marcus Vance",
    guestPhone: "+1 (310) 849-2104",
    service: "Full Body Therapeutic Journey",
    state: "California",
    city: "Beverly Hills, CA",
    date: "2026-10-01",
    timeSlot: "11:30 AM",
    notes: "In-home luxury suite visit. Gated entrance code #4821.",
    status: "Confirmed",
    price: "$160",
    createdAt: "2026-09-29 11:05",
  },
  {
    id: "RES-1047",
    guestName: "Elena Rostova",
    guestPhone: "+1 (305) 774-9021",
    service: "Heritage Botanical Body Scrub",
    state: "Florida",
    city: "Miami Beach, FL",
    date: "2026-10-03",
    timeSlot: "03:30 PM",
    notes: "Mild nut allergy, use pure coconut and jojoba base only.",
    status: "Confirmed",
    price: "$145",
    createdAt: "2026-09-28 18:40",
  },
  {
    id: "RES-1046",
    guestName: "David Sterling",
    guestPhone: "+1 (512) 630-1928",
    service: "Aromatherapy Massage",
    state: "Texas",
    city: "Austin, TX",
    date: "2026-09-30",
    timeSlot: "05:30 PM",
    notes: "Deep tissue pressure preference.",
    status: "Completed",
    price: "$120",
    createdAt: "2026-09-28 09:15",
  },
  {
    id: "RES-1045",
    guestName: "Chloe Bennett",
    guestPhone: "+1 (312) 554-8901",
    service: "Traditional Massage + Reflexology",
    state: "Illinois",
    city: "Chicago, IL",
    date: "2026-10-04",
    timeSlot: "10:00 AM",
    notes: "Hotel suite visit at The Peninsula Chicago.",
    status: "Pending",
    price: "$150",
    createdAt: "2026-09-27 16:30",
  },
];

interface AdminPanelProps {
  onBackToSite: () => void;
}

export function AdminPanel({ onBackToSite }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"reservations" | "livechat">("reservations");

  // Reservations State
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    if (typeof window === "undefined") return INITIAL_RESERVATIONS;
    try {
      const saved = localStorage.getItem("febiola_spa_reservations");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_RESERVATIONS;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Form State for Add Reservation
  const [newGuestName, setNewGuestName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newService, setNewService] = useState("Traditional Massage");
  const [newState, setNewState] = useState("California");
  const [newCity, setNewCity] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTimeSlot, setNewTimeSlot] = useState("11:30 AM");
  const [newPrice, setNewPrice] = useState("$95");
  const [newNotes, setNewNotes] = useState("");

  // Live Chat State
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(() => getChatThreads());
  const [selectedThreadId, setSelectedThreadId] = useState<string>("thread-live-visitor");
  const [adminReplyText, setAdminReplyText] = useState("");
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem("febiola_spa_reservations", JSON.stringify(reservations));
    } catch {
      // ignore
    }
  }, [reservations]);

  // Subscribe to real-time chat updates
  useEffect(() => {
    const unsubscribe = subscribeToChat((threads) => {
      setChatThreads(threads);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (activeTab === "livechat") {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      if (selectedThreadId) {
        markThreadAsRead(selectedThreadId);
      }
    }
  }, [activeTab, selectedThreadId, chatThreads]);

  // Calculations with safe fallbacks
  const totalBookings = reservations?.length || 0;
  const pendingBookings = (reservations || []).filter((r) => (r?.status || "Pending") === "Pending").length;
  const confirmedBookings = (reservations || []).filter((r) => r?.status === "Confirmed").length;
  const totalRevenue = (reservations || [])
    .filter((r) => r?.status !== "Cancelled")
    .reduce((acc, curr) => {
      const num = parseInt(String(curr?.price || "0").replace(/[^0-9]/g, ""), 10) || 0;
      return acc + num;
    }, 0);

  const totalUnreadChats = (chatThreads || []).reduce((acc, t) => acc + (t.unreadCount || 0), 0);

  const filteredReservations = (reservations || []).filter((r) => {
    const name = String(r?.guestName || "").toLowerCase();
    const phone = String(r?.guestPhone || "").toLowerCase();
    const service = String(r?.service || "").toLowerCase();
    const city = String(r?.city || "").toLowerCase();
    const state = String(r?.state || "").toLowerCase();
    const q = (searchQuery || "").toLowerCase();

    const matchesSearch =
      !q ||
      name.includes(q) ||
      phone.includes(q) ||
      service.includes(q) ||
      city.includes(q) ||
      state.includes(q);

    const matchesStatus = statusFilter === "All" || r?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: string, newStatus: Reservation["status"]) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    if (selectedRes && selectedRes.id === id) {
      setSelectedRes({ ...selectedRes, status: newStatus });
    }
    toast.success(`Reservation #${id} status updated to ${newStatus}`);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this reservation?")) {
      setReservations((prev) => prev.filter((r) => r.id !== id));
      setSelectedRes(null);
      toast.success("Reservation removed successfully.");
    }
  };

  const handleAddReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim() || !newPhone.trim()) {
      toast.error("Please fill in guest name and phone number.");
      return;
    }

    const newEntry: Reservation = {
      id: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
      guestName: newGuestName,
      guestPhone: newPhone,
      service: newService,
      state: newState,
      city: newCity || newState,
      date: newDate || new Date().toISOString().split("T")[0]!,
      timeSlot: newTimeSlot,
      price: newPrice,
      notes: newNotes,
      status: "Confirmed",
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };

    setReservations([newEntry, ...reservations]);
    setAddModalOpen(false);
    toast.success("New reservation recorded successfully!");

    // Reset Form
    setNewGuestName("");
    setNewPhone("");
    setNewCity("");
    setNewNotes("");
  };

  const handleSendAdminReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim() || !selectedThreadId) return;

    const updated = sendAdminMessage(selectedThreadId, adminReplyText);
    setChatThreads(updated);
    setAdminReplyText("");
    toast.success("Message sent to guest!");
  };

  const exportCSV = () => {
    const headers = "ID,Guest Name,Phone,Service,State,City,Date,Time Slot,Price,Status,Notes,Created At\n";
    const rows = (reservations || [])
      .map(
        (r) =>
          `"${r.id}","${r.guestName}","${r.guestPhone}","${r.service}","${r.state}","${r.city}","${r.date}","${r.timeSlot}","${r.price}","${r.status}","${r.notes || ""}","${r.createdAt}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `febiola_reservations_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Reservations exported to CSV!");
  };

  const currentChatThread = (chatThreads || []).find((t) => t.id === selectedThreadId);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-body antialiased">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-900/95 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="grid size-10 place-items-center rounded-full border border-gold/60 bg-[#4A3423] text-gold shadow-md">
              <Flower2 className="size-5" strokeWidth={1.4} />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-wide text-neutral-100">
                Febiola Spa
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Switcher Tabs */}
            <div className="flex items-center rounded-xl bg-neutral-800 p-1 border border-neutral-700/80">
              <button
                onClick={() => setActiveTab("reservations")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "reservations"
                    ? "bg-gold text-neutral-950 shadow-md font-bold"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <Calendar className="size-3.5" />
                <span>Reservations</span>
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-neutral-900/40">
                  {totalBookings}
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("livechat");
                  if (selectedThreadId) markThreadAsRead(selectedThreadId);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "livechat"
                    ? "bg-gold text-neutral-950 shadow-md font-bold"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <MessageSquare className="size-3.5" />
                <span>Live Chat</span>
                {totalUnreadChats > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-white font-bold animate-pulse">
                    {totalUnreadChats}
                  </span>
                )}
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={exportCSV}
              className="hidden md:flex items-center gap-1.5 border-neutral-700 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 text-xs rounded-lg px-3.5 py-2"
            >
              <Download className="size-3.5" /> Export CSV
            </Button>
            <Button
              variant="spa"
              size="sm"
              onClick={() => setAddModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 text-xs rounded-lg px-3.5 py-2 shadow"
            >
              <Plus className="size-4" /> Add Booking
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToSite}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded-lg px-3"
            >
              <LogOut className="size-3.5" /> Website
            </Button>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="mx-auto max-w-7xl p-6 sm:p-8 space-y-7">
        {activeTab === "reservations" ? (
          <>
            {/* KPI Stats Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Total Bookings</p>
                  <Users className="size-4 text-neutral-500" />
                </div>
                <p className="mt-3 font-display text-3xl sm:text-4xl font-bold text-neutral-100">
                  {totalBookings}
                </p>
                <p className="mt-1.5 text-[11px] text-neutral-500">Across all 50 US states</p>
              </div>

              <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">Pending Review</p>
                  <Clock className="size-4 text-amber-400" />
                </div>
                <p className="mt-3 font-display text-3xl sm:text-4xl font-bold text-amber-300">
                  {pendingBookings}
                </p>
                <p className="mt-1.5 text-[11px] text-amber-500">Requires confirmation</p>
              </div>

              <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Confirmed</p>
                  <CheckCircle2 className="size-4 text-emerald-400" />
                </div>
                <p className="mt-3 font-display text-3xl sm:text-4xl font-bold text-emerald-300">
                  {confirmedBookings}
                </p>
                <p className="mt-1.5 text-[11px] text-emerald-500">Scheduled therapists</p>
              </div>

              <div className="rounded-2xl border border-gold/30 bg-neutral-900/80 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gold-soft">Est. Revenue</p>
                  <DollarSign className="size-4 text-gold" />
                </div>
                <p className="mt-3 font-display text-3xl sm:text-4xl font-bold text-gold">
                  ${totalRevenue.toLocaleString()}
                </p>
                <p className="mt-1.5 text-[11px] text-neutral-400">Active bookings value</p>
              </div>
            </div>

            {/* Filter and Search Toolbar */}
            <div className="flex flex-col gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4 sm:p-5 sm:flex-row sm:items-center sm:justify-between shadow-sm">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search by guest, phone, city, state, or service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-800 pl-10 pr-4 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mr-1">
                  <Filter className="size-3.5 text-neutral-500" />
                  <span>Filter:</span>
                </div>
                {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                      statusFilter === status
                        ? "bg-gold text-neutral-950 font-bold shadow-md"
                        : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Reservations Table */}
            <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/70 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-neutral-800 bg-neutral-900/90 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                    <tr>
                      <th className="px-5 py-4">Guest &amp; Contact</th>
                      <th className="px-5 py-4">Ritual / Service</th>
                      <th className="px-5 py-4">Location (US State)</th>
                      <th className="px-5 py-4">Date &amp; Time</th>
                      <th className="px-5 py-4">Price</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {filteredReservations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-14 text-center text-neutral-500">
                          No reservations found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredReservations.map((res) => (
                        <tr
                          key={res.id}
                          onClick={() => setSelectedRes(res)}
                          className="group cursor-pointer hover:bg-neutral-800/50 transition-colors"
                        >
                          <td className="px-5 py-4">
                            <div className="font-semibold text-neutral-100 group-hover:text-gold transition-colors text-sm">
                              {res.guestName}
                            </div>
                            <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                              {res.guestPhone}
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="font-medium text-neutral-200">
                              {res.service}
                            </div>
                            <div className="text-[10px] text-neutral-400 mt-0.5">
                              ID: {res.id}
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5 text-neutral-300">
                              <MapPin className="size-3.5 text-gold shrink-0" />
                              <span>{res.city}</span>
                            </div>
                            <div className="text-[10px] text-neutral-400 mt-0.5">
                              {res.state}
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5 text-neutral-200">
                              <Calendar className="size-3.5 text-neutral-400 shrink-0" />
                              <span>{res.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 mt-0.5">
                              <Clock className="size-3 text-neutral-500 shrink-0" />
                              <span>{res.timeSlot}</span>
                            </div>
                          </td>

                          <td className="px-5 py-4 font-bold text-neutral-100 text-sm">
                            {res.price}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                                res.status === "Confirmed"
                                  ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/60"
                                  : res.status === "Pending"
                                  ? "bg-amber-950/60 text-amber-400 border-amber-800/60"
                                  : res.status === "Completed"
                                  ? "bg-blue-950/60 text-blue-400 border-blue-800/60"
                                  : "bg-red-950/60 text-red-400 border-red-800/60"
                              }`}
                            >
                              <span
                                className={`size-1.5 rounded-full ${
                                  res.status === "Confirmed"
                                    ? "bg-emerald-400"
                                    : res.status === "Pending"
                                    ? "bg-amber-400 animate-pulse"
                                    : res.status === "Completed"
                                    ? "bg-blue-400"
                                    : "bg-red-400"
                                }`}
                              />
                              {res.status}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-right">
                            <div
                              className="flex items-center justify-end gap-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <a
                                href={`tel:${res.guestPhone}`}
                                title="Call Guest"
                                className="p-2 rounded-lg hover:bg-neutral-700 text-neutral-400 hover:text-neutral-100 transition-colors"
                              >
                                <Phone className="size-3.5" />
                              </a>
                              <a
                                href={`https://wa.me/${res.guestPhone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(res.guestName)}%2C%20confirming%20your%20Febiola%20Spa%20reservation%20for%20${encodeURIComponent(res.service)}.`}
                                target="_blank"
                                rel="noreferrer"
                                title="WhatsApp Guest"
                                className="p-2 rounded-lg hover:bg-emerald-950 text-neutral-400 hover:text-emerald-400 transition-colors"
                              >
                                <MessageCircle className="size-3.5" />
                              </a>
                              <button
                                onClick={() => setSelectedRes(res)}
                                title="View Details"
                                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 transition-colors"
                              >
                                Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* Live Chat Console Section */
          <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] rounded-2xl border border-neutral-800 bg-neutral-900/80 shadow-2xl overflow-hidden min-h-[620px]">
            {/* Left Thread List */}
            <div className="border-r border-neutral-800 bg-neutral-900/90 flex flex-col">
              <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-neutral-100">Live Guest Chats</h2>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Website visitors &amp; inquiries</p>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-800/40">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-neutral-800/60">
                {(chatThreads || []).map((thread) => {
                  const isSelected = thread.id === selectedThreadId;
                  return (
                    <button
                      key={thread.id}
                      onClick={() => {
                        setSelectedThreadId(thread.id);
                        markThreadAsRead(thread.id);
                      }}
                      className={`w-full text-left p-4 transition-all flex items-start justify-between gap-3 ${
                        isSelected
                          ? "bg-neutral-800/90 border-l-4 border-gold pl-3.5"
                          : "hover:bg-neutral-800/40"
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="relative mt-0.5">
                          <div className="grid size-9 place-items-center rounded-full bg-neutral-800 border border-neutral-700 text-neutral-300">
                            <User className="size-4" />
                          </div>
                          {thread.unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 size-4 rounded-full bg-emerald-500 text-white text-[10px] font-bold grid place-items-center shadow">
                              {thread.unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-xs font-semibold text-neutral-200 truncate">
                              {thread.guestName}
                            </p>
                            <span className="text-[10px] text-neutral-500 shrink-0">
                              {thread.lastMessageTime}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 truncate mt-1">
                            {thread.lastMessage}
                          </p>
                          {thread.location && (
                            <span className="text-[10px] text-gold-soft opacity-80 flex items-center gap-1 mt-1.5">
                              <MapPin className="size-3" /> {thread.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Chat Window */}
            {currentChatThread ? (
              <div className="flex flex-col h-full bg-neutral-950/60">
                {/* Chat Top Bar */}
                <div className="p-4 border-b border-neutral-800 bg-neutral-900/60 flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="grid size-10 place-items-center rounded-full bg-neutral-800 border border-gold/40 text-gold">
                      <User className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-100 flex items-center gap-2">
                        <span>{currentChatThread.guestName}</span>
                        {currentChatThread.id === "thread-live-visitor" && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-medium">
                            Current Web Visitor
                          </span>
                        )}
                      </h3>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        {currentChatThread.guestPhone || "Direct Website Channel"} · {currentChatThread.location || "USA"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {currentChatThread.guestPhone && (
                      <a
                        href={`tel:${currentChatThread.guestPhone}`}
                        className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="size-3.5 text-gold" /> Call
                      </a>
                    )}
                    {currentChatThread.guestPhone && (
                      <a
                        href={`https://wa.me/${currentChatThread.guestPhone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-xs font-medium text-emerald-400 border border-emerald-800 flex items-center gap-1.5 transition-colors"
                      >
                        <MessageCircle className="size-3.5" /> WhatsApp
                      </a>
                    )}
                  </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {currentChatThread.messages.map((msg) => {
                    const isGuest = msg.sender === "guest";
                    const isAdmin = msg.sender === "admin";
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isGuest ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-[78%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                            isGuest
                              ? "bg-neutral-800 text-neutral-200 rounded-bl-none border border-neutral-700"
                              : isAdmin
                              ? "bg-[#4A3423] text-gold border border-gold/40 rounded-br-none"
                              : "bg-neutral-900 text-neutral-400 rounded-bl-none border border-neutral-800"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3 mb-1">
                            <span className="text-[11px] font-bold text-neutral-300">
                              {msg.senderName || (isGuest ? "Guest" : "Admin")}
                            </span>
                            <span className="text-[10px] text-neutral-400">
                              {msg.timeStr}
                            </span>
                          </div>
                          <p className="text-neutral-100">{msg.text}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatMessagesEndRef} />
                </div>

                {/* Quick Canned Responses */}
                <div className="px-4 py-2.5 border-t border-neutral-800 bg-neutral-900/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
                  <span className="text-[10px] text-neutral-500 uppercase font-semibold shrink-0">
                    Quick replies:
                  </span>
                  {[
                    "Hello! How can we assist your spa booking today?",
                    "Our licensed therapists arrive with all luxury equipment and heated tables.",
                    "We have confirmed your appointment! See you soon.",
                    "Rituals are available across all 50 US states.",
                  ].map((quick) => (
                    <button
                      key={quick}
                      onClick={() => setAdminReplyText(quick)}
                      className="shrink-0 px-3 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700 text-[11px] text-neutral-300 transition-colors"
                    >
                      {quick.length > 34 ? quick.substring(0, 34) + "..." : quick}
                    </button>
                  ))}
                </div>

                {/* Admin Message Input */}
                <form
                  onSubmit={handleSendAdminReply}
                  className="p-3.5 border-t border-neutral-800 bg-neutral-900 flex items-center gap-2.5"
                >
                  <input
                    type="text"
                    placeholder={`Reply to ${currentChatThread.guestName} as Spa Admin...`}
                    value={adminReplyText}
                    onChange={(e) => setAdminReplyText(e.target.value)}
                    className="flex-1 rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                  <Button
                    type="submit"
                    variant="spa"
                    size="sm"
                    disabled={!adminReplyText.trim()}
                    className="flex items-center gap-1.5 text-xs rounded-xl px-5 py-2.5"
                  >
                    <Send className="size-3.5" /> Send Reply
                  </Button>
                </form>
              </div>
            ) : (
              <div className="grid place-items-center p-14 text-neutral-500 text-xs">
                Select a conversation thread to start live chatting.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reservation Details Modal with Flawless Spacing & Hierarchy */}
      <Dialog open={!!selectedRes} onOpenChange={(open) => !open && setSelectedRes(null)}>
        <DialogContent className="max-w-lg w-[calc(100%-2rem)] max-h-[85vh] overflow-y-auto bg-neutral-900 border-neutral-800 text-neutral-100 sm:rounded-2xl p-5 sm:p-7 shadow-2xl overscroll-contain">
          {selectedRes && (
            <div className="space-y-4">
              {/* Modal Top Header with Clean Spacing & Non-overlapping Close Button */}
              <DialogHeader className="space-y-1.5 text-left pr-8">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-[11px] font-semibold text-gold bg-gold/10 px-2.5 py-0.5 rounded-md border border-gold/30">
                    Booking #{selectedRes.id}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                      selectedRes.status === "Confirmed"
                        ? "bg-emerald-950/70 text-emerald-400 border-emerald-800"
                        : selectedRes.status === "Pending"
                        ? "bg-amber-950/70 text-amber-400 border-amber-800"
                        : selectedRes.status === "Completed"
                        ? "bg-blue-950/70 text-blue-400 border-blue-800"
                        : "bg-red-950/70 text-red-400 border-red-800"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        selectedRes.status === "Confirmed"
                          ? "bg-emerald-400"
                          : selectedRes.status === "Pending"
                          ? "bg-amber-400 animate-pulse"
                          : selectedRes.status === "Completed"
                          ? "bg-blue-400"
                          : "bg-red-400"
                      }`}
                    />
                    {selectedRes.status}
                  </span>
                </div>

                <DialogTitle className="font-display text-3xl font-semibold text-neutral-100 pt-1 tracking-wide">
                  {selectedRes.guestName}
                </DialogTitle>
                <DialogDescription className="text-xs text-neutral-400 font-normal">
                  Registered on {selectedRes.createdAt}
                </DialogDescription>
              </DialogHeader>

              {/* Structured Field Cards with Generous Breathing Room */}
              <div className="space-y-3 pt-1">
                {/* 1. Ritual & Rate Card */}
                <div className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-xl border border-neutral-800 bg-neutral-800/40 p-3.5">
                  <div>
                    <span className="text-[10px] font-semibold text-neutral-400 block">
                      Selected ritual
                    </span>
                    <p className="text-sm font-semibold text-neutral-100 mt-0.5">
                      {selectedRes.service}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-semibold text-neutral-400 block">
                      Rate / price
                    </span>
                    <p className="text-base font-bold text-gold mt-0.5">
                      {selectedRes.price}
                    </p>
                  </div>
                </div>

                {/* 2. Schedule & Location Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-neutral-800 bg-neutral-800/40 p-3.5">
                    <span className="text-[10px] font-semibold text-neutral-400 block">
                      Appointment time
                    </span>
                    <div className="flex items-center gap-2 text-xs font-semibold text-neutral-200 mt-1">
                      <Calendar className="size-3.5 text-gold shrink-0" />
                      <span>{selectedRes.date}</span>
                      <span className="text-neutral-500">·</span>
                      <Clock className="size-3.5 text-gold shrink-0" />
                      <span>{selectedRes.timeSlot}</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-neutral-800 bg-neutral-800/40 p-3.5">
                    <span className="text-[10px] font-semibold text-neutral-400 block">
                      State &amp; city
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-200 mt-1">
                      <MapPin className="size-3.5 text-gold shrink-0" />
                      <span className="truncate">{selectedRes.city}, {selectedRes.state}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Direct Contact & Action Bar */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-800/40 p-3.5">
                  <span className="text-[10px] font-semibold text-neutral-400 block">
                    Guest phone &amp; instant actions
                  </span>
                  <div className="flex items-center justify-between gap-3 mt-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Phone className="size-3.5 text-gold" />
                      <span className="font-mono text-xs font-bold text-neutral-100">
                        {selectedRes.guestPhone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${selectedRes.guestPhone}`}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-700/80 hover:bg-neutral-600 text-neutral-200 text-xs font-medium transition-colors"
                        title="Call Phone"
                      >
                        <PhoneCall className="size-3" /> Call
                      </a>
                      <a
                        href={`sms:${selectedRes.guestPhone}`}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-700/80 hover:bg-neutral-600 text-neutral-200 text-xs font-medium transition-colors"
                        title="Send SMS"
                      >
                        <MessageSquare className="size-3" /> SMS
                      </a>
                      <a
                        href={`https://wa.me/${selectedRes.guestPhone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(selectedRes.guestName)}%2C%20Febiola%20Spa%20concierge%20here%20regarding%20your%20${encodeURIComponent(selectedRes.service)}%20booking.`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800 text-xs font-medium transition-colors"
                        title="WhatsApp Chat"
                      >
                        <MessageCircle className="size-3" /> WhatsApp
                      </a>
                    </div>
                  </div>
                </div>

                {/* 4. Special Notes & Preferences */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-800/40 p-3.5">
                  <span className="text-[10px] font-semibold text-neutral-400 block mb-1">
                    Special notes / preferences
                  </span>
                  <p className="text-xs text-neutral-300 bg-neutral-900/80 p-3 rounded-lg leading-relaxed border border-neutral-800">
                    {selectedRes.notes || "No special requests or allergies noted by guest."}
                  </p>
                </div>

                {/* 5. Status Management Actions */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-800/40 p-3.5 space-y-2">
                  <span className="text-[10px] font-semibold text-neutral-400 block">
                    Update reservation status
                  </span>
                  <div className="grid grid-cols-3 gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(selectedRes.id, "Confirmed")}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                        selectedRes.status === "Confirmed"
                          ? "bg-emerald-600 text-white shadow-md ring-1 ring-emerald-400 font-bold"
                          : "bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/60"
                      }`}
                    >
                      <CheckCircle2 className="size-3.5" /> Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(selectedRes.id, "Completed")}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                        selectedRes.status === "Completed"
                          ? "bg-blue-600 text-white shadow-md ring-1 ring-blue-400 font-bold"
                          : "bg-blue-950/40 border border-blue-800/60 text-blue-300 hover:bg-blue-900/60"
                      }`}
                    >
                      <Sparkles className="size-3.5" /> Complete
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(selectedRes.id, "Cancelled")}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                        selectedRes.status === "Cancelled"
                          ? "bg-red-600 text-white shadow-md ring-1 ring-red-400 font-bold"
                          : "bg-red-950/40 border border-red-800/60 text-red-300 hover:bg-red-900/60"
                      }`}
                    >
                      <XCircle className="size-3.5" /> Cancel
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Bottom Footer */}
              <div className="mt-4 flex items-center justify-between border-t border-neutral-800 pt-4">
                <button
                  type="button"
                  onClick={() => handleDelete(selectedRes.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-950/50 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="size-3.5" /> Delete Booking
                </button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedRes(null)}
                  className="border-neutral-700 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 px-5 text-xs rounded-lg"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Manual Reservation Modal with Matching Clean Spacing */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-lg w-[calc(100%-2rem)] max-h-[85vh] overflow-y-auto bg-neutral-900 border-neutral-800 text-neutral-100 sm:rounded-2xl p-5 sm:p-7 shadow-2xl overscroll-contain">
          <DialogHeader className="space-y-1 text-left pr-8">
            <DialogTitle className="font-display text-3xl font-semibold text-neutral-100">
              Create New Reservation
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-400">
              Add a new phone or in-person guest booking to the schedule.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddReservation} className="space-y-4 pt-2 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                Guest full name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rachel Adams"
                value={newGuestName}
                onChange={(e) => setNewGuestName(e.target.value)}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-xs text-neutral-100 placeholder-neutral-500 focus:ring-1 focus:ring-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                Phone number
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. +1 (646) 555-0199"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-xs text-neutral-100 placeholder-neutral-500 focus:ring-1 focus:ring-gold focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                  Ritual service
                </label>
                <select
                  value={newService}
                  onChange={(e) => {
                    setNewService(e.target.value);
                    if (e.target.value.includes("Aromatherapy")) setNewPrice("$120");
                    else if (e.target.value.includes("Lulur") || e.target.value.includes("Scrub")) setNewPrice("$145");
                    else if (e.target.value.includes("Full Body")) setNewPrice("$160");
                    else if (e.target.value.includes("Totok")) setNewPrice("$175");
                    else if (e.target.value.includes("Reflexology")) setNewPrice("$150");
                    else setNewPrice("$95");
                  }}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2.5 text-xs text-neutral-100 focus:ring-1 focus:ring-gold focus:outline-none"
                >
                  <option value="Traditional Massage">Traditional Massage ($95)</option>
                  <option value="Aromatherapy Massage">Aromatherapy Massage ($120)</option>
                  <option value="Heritage Botanical Body Scrub">Heritage Botanical Scrub ($145)</option>
                  <option value="Full Body Therapeutic Journey">Full Body Journey ($160)</option>
                  <option value="Traditional Massage + Totok Facial">Massage + Totok Facial ($175)</option>
                  <option value="Traditional Massage + Reflexology">Massage + Reflexology ($150)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                  Rate / price
                </label>
                <input
                  type="text"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-xs text-neutral-100 focus:ring-1 focus:ring-gold focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                  US state
                </label>
                <input
                  type="text"
                  placeholder="e.g. New York"
                  value={newState}
                  onChange={(e) => setNewState(e.target.value)}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-xs text-neutral-100 focus:ring-1 focus:ring-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                  City / zip
                </label>
                <input
                  type="text"
                  placeholder="e.g. Brooklyn, NY"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-xs text-neutral-100 focus:ring-1 focus:ring-gold focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2 text-xs text-neutral-100 focus:ring-1 focus:ring-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                  Time slot
                </label>
                <select
                  value={newTimeSlot}
                  onChange={(e) => setNewTimeSlot(e.target.value)}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2.5 text-xs text-neutral-100 focus:ring-1 focus:ring-gold focus:outline-none"
                >
                  <option value="10:00 AM">10:00 AM (Morning)</option>
                  <option value="11:30 AM">11:30 AM (Noon)</option>
                  <option value="01:30 PM">01:30 PM (Afternoon)</option>
                  <option value="03:30 PM">03:30 PM (Afternoon)</option>
                  <option value="05:30 PM">05:30 PM (Evening)</option>
                  <option value="07:00 PM">07:00 PM (Night)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                Special notes / preferences
              </label>
              <textarea
                rows={2}
                placeholder="Allergies, preferences, residence entry notes..."
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-xs text-neutral-100 placeholder-neutral-500 focus:ring-1 focus:ring-gold focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddModalOpen(false)}
                className="border-neutral-700 bg-neutral-800 text-neutral-200 text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button variant="spa" type="submit" className="text-xs rounded-xl px-5">
                Save &amp; Confirm Booking
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
