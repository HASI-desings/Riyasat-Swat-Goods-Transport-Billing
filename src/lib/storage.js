// Local draft/offline-cache read/write helpers. This is NOT the primary
// database (Supabase is) — it's used only for:
//   1. Autosaving the in-progress bill form so a closed browser / lost
//      connection never loses typed data.
//   2. Queuing bills created while offline until they can sync.

const DRAFT_KEY = 'rsgt:draft-bill';
const QUEUE_KEY = 'rsgt:offline-queue';
const BRANCH_KEY = 'rsgt:branch';

function safeParse(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    // Corrupted local draft — never crash, just start fresh (security.md).
    return fallback;
  }
}

export const draftStorage = {
  save(bill) {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ bill, savedAt: Date.now() }));
    } catch {
      /* storage full or unavailable — non-fatal */
    }
  },
  load() {
    return safeParse(localStorage.getItem(DRAFT_KEY), null)?.bill ?? null;
  },
  clear() {
    localStorage.removeItem(DRAFT_KEY);
  },
};

export const offlineQueue = {
  getAll() {
    return safeParse(localStorage.getItem(QUEUE_KEY), []);
  },
  add(bill) {
    const queue = offlineQueue.getAll();
    const entry = { localId: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`, bill };
    queue.push(entry);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    return entry;
  },
  remove(localId) {
    const queue = offlineQueue.getAll().filter((e) => e.localId !== localId);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  },
  clear() {
    localStorage.removeItem(QUEUE_KEY);
  },
};

export const branchStorage = {
  get() {
    return localStorage.getItem(BRANCH_KEY) || null;
  },
  set(branchId) {
    localStorage.setItem(BRANCH_KEY, branchId);
  },
  clear() {
    localStorage.removeItem(BRANCH_KEY);
  },
};
