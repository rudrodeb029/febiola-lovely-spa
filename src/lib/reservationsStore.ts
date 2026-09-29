import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { toast } from "sonner";

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
  timestamp?: number;
}

export const INITIAL_RESERVATIONS: Reservation[] = [
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
    timestamp: Date.now() - 1000 * 60 * 30,
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
    timestamp: Date.now() - 1000 * 60 * 180,
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
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
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
    timestamp: Date.now() - 1000 * 60 * 60 * 36,
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
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
  },
];

const LOCAL_KEY = "febiola_spa_reservations";

export function getLocalReservations(): Reservation[] {
  if (typeof window === "undefined") return INITIAL_RESERVATIONS;
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return INITIAL_RESERVATIONS;
}

export function saveLocalReservations(resList: Reservation[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(resList));
    window.dispatchEvent(new CustomEvent("febiola_res_update", { detail: resList }));
  } catch {
    // ignore
  }
}

/**
 * Save new reservation to Cloud Firestore & LocalStorage
 */
export async function createReservation(resData: Omit<Reservation, "id" | "createdAt" | "timestamp"> & { id?: string }): Promise<Reservation> {
  const id = resData.id || `RES-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date();
  const createdAt = now.toISOString().slice(0, 16).replace("T", " ");
  const timestamp = now.getTime();

  const newRes: Reservation = {
    ...resData,
    id,
    createdAt,
    timestamp,
  };

  // 1. Save to local storage for immediate UI update & offline reliability
  const current = getLocalReservations();
  const updated = [newRes, ...current.filter((r) => r.id !== id)];
  saveLocalReservations(updated);

  // 2. Persist directly to Firebase Cloud Firestore
  try {
    const docRef = doc(db, "reservations", id);
    await setDoc(docRef, {
      ...newRes,
      serverTime: serverTimestamp(),
    });
  } catch (err) {
    console.warn("Firestore save fallback to local storage:", err);
  }

  return newRes;
}

/**
 * Update status in Cloud Firestore & LocalStorage
 */
export async function updateReservationStatus(id: string, status: Reservation["status"]) {
  const current = getLocalReservations();
  const updated = current.map((r) => (r.id === id ? { ...r, status } : r));
  saveLocalReservations(updated);

  try {
    const docRef = doc(db, "reservations", id);
    await updateDoc(docRef, { status });
  } catch (err) {
    console.warn("Firestore update fallback:", err);
  }
}

/**
 * Delete reservation from Cloud Firestore & LocalStorage
 */
export async function deleteReservation(id: string) {
  const current = getLocalReservations();
  const updated = current.filter((r) => r.id !== id);
  saveLocalReservations(updated);

  try {
    const docRef = doc(db, "reservations", id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn("Firestore delete fallback:", err);
  }
}

/**
 * Subscribe to real-time reservation changes from Cloud Firestore
 */
export function subscribeToReservations(onUpdate: (data: Reservation[]) => void): () => void {
  // Initial local delivery
  onUpdate(getLocalReservations());

  let unsubscribeFirestore = () => {};

  try {
    const q = query(collection(db, "reservations"));
    unsubscribeFirestore = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Reservation[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Reservation;
            list.push({ ...data, id: docSnap.id });
          });
          // Sort newest first
          list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          saveLocalReservations(list);
          onUpdate(list);
        } else {
          // Seed Firestore with initial mock records if completely empty
          INITIAL_RESERVATIONS.forEach((seed) => {
            setDoc(doc(db, "reservations", seed.id), seed).catch(() => {});
          });
          onUpdate(getLocalReservations());
        }
      },
      (error) => {
        console.warn("Firestore subscription error, using local data:", error);
        onUpdate(getLocalReservations());
      }
    );
  } catch (err) {
    console.warn("Firestore init error:", err);
  }

  const handleLocal = () => {
    onUpdate(getLocalReservations());
  };

  window.addEventListener("febiola_res_update", handleLocal as EventListener);
  window.addEventListener("storage", handleLocal);

  return () => {
    unsubscribeFirestore();
    window.removeEventListener("febiola_res_update", handleLocal as EventListener);
    window.removeEventListener("storage", handleLocal);
  };
}
