// admin.js — Firestore viewer (read-only + edit/delete)
// Τρέχει ως ES module από CDN

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, getDocs, query, orderBy,
  doc, updateDoc, deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- Firebase config (το project σου) ---
const firebaseConfig = {
  apiKey: "AIzaSyBuN5dn_PNC37CbiaRaQRx78gds6f-JXbI",
  authDomain: "smallvillagerani.firebaseapp.com",
  projectId: "smallvillagerani",
  storageBucket: "smallvillagerani.firebasestorage.app",
  messagingSenderId: "762742575521",
  appId: "1:762742575521:web:0fbd4b3bd62caafe013be0"
};

// Init
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Elements
const $ = (s) => document.querySelector(s);
const tbody = $("#tbody");
const empty = $("#empty");
const statusEl = $("#status");
const searchInput = $("#search");
const sortSelect = $("#sort");
const refreshBtn = $("#refresh");
const exportBtn = $("#export");

// Edit modal els
const editModal = $("#edit-modal");
const editForm = $("#edit-form");
const editId = $("#edit-id");
const editName = $("#edit-name");
const editEmail = $("#edit-email");
const editCheckin = $("#edit-checkin");
const editCheckout = $("#edit-checkout");
const editMessage = $("#edit-message");
const editCancel = $("#edit-cancel");
const editClose = $("#edit-close");

// State
let allBookings = [];   // raw from DB
let viewBookings = [];  // filtered/sorted for UI

function fmtDate(d) {
  if (!d) return "";
  try {
    if (d.seconds) return new Date(d.seconds * 1000).toLocaleString("el-GR");
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return new Date(d + "T00:00:00").toLocaleDateString("el-GR");
    const asDate = new Date(d);
    return isNaN(asDate) ? String(d) : asDate.toLocaleString("el-GR");
  } catch { return String(d); }
}
const toISO = (date) => {
  const d = new Date(date);
  if (isNaN(d)) return "";
  return d.toISOString().slice(0,10);
};

function setStatus(txt) { statusEl.textContent = txt || "—"; }

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function render() {
  tbody.innerHTML = "";
  const term = (searchInput.value || "").toLowerCase().trim();

  viewBookings = allBookings
    .filter(b => {
      if (!term) return true;
      return (b.name || "").toLowerCase().includes(term)
          || (b.email || "").toLowerCase().includes(term);
    });

  // sorting
  const mode = sortSelect.value;
  const dir = (m) => (m.endsWith("_desc") ? -1 : 1);
  const key = (m) => m.split("_")[0];

  viewBookings.sort((a, b) => {
    const k = key(mode);
    const d = dir(mode);

    const av = a[k] || a[k + "At"];
    const bv = b[k] || b[k + "At"];

    const ad = new Date(av);
    const bd = new Date(bv);
    if (!isNaN(ad) && !isNaN(bd)) return (ad - bd) * d;

    return (String(av || "")).localeCompare(String(bv || "")) * d;
  });

  if (viewBookings.length === 0) {
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");

  viewBookings.forEach((b, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${escapeHtml(b.name || "")}</td>
      <td>${escapeHtml(b.email || "")}</td>
      <td>${escapeHtml(fmtDate(b.checkin || b.start))}</td>
      <td>${escapeHtml(fmtDate(b.checkout || b.end))}</td>
      <td>${escapeHtml((b.message || "").slice(0, 200))}</td>
      <td>${escapeHtml(fmtDate(b.createdAt))}</td>
      <td>
        <button class="btn edit" data-act="edit" data-id="${b.id}">Edit</button>
        <button class="btn delete" data-act="delete" data-id="${b.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  setStatus(`${viewBookings.length} εγγραφές`);
}

async function loadBookings() {
  setStatus("Φόρτωση…");
  try {
    let snap;
    try {
      const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
      snap = await getDocs(q);
    } catch {
      snap = await getDocs(collection(db, "bookings"));
    }

    allBookings = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
    render();
  } catch (err) {
    console.error("Load error:", err);
    setStatus("Σφάλμα φόρτωσης");
    empty.classList.remove("hidden");
    empty.textContent = "Σφάλμα φόρτωσης δεδομένων.";
  }
}

// Export CSV
function exportCSV() {
  const rows = [
    ["#", "name", "email", "checkin", "checkout", "message", "createdAt"],
    ...viewBookings.map((b, i) => [
      i + 1,
      b.name || "",
      b.email || "",
      b.checkin || b.start || "",
      b.checkout || b.end || "",
      (b.message || "").replace(/\r?\n/g, " ").slice(0, 500),
      fmtDate(b.createdAt)
    ])
  ];
  const csv = rows.map(r => r.map(cell => `"${String(cell).replaceAll('"','""')}"`).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `bookings_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ====== Edit / Delete Handlers ======
function openEditModal(booking) {
  editId.value = booking.id;
  editName.value = booking.name || "";
  editEmail.value = booking.email || "";
  editCheckin.value = toISO(booking.checkin || booking.start || "");
  editCheckout.value = toISO(booking.checkout || booking.end || "");
  editMessage.value = booking.message || "";
  editModal.classList.remove("hidden");
}

function closeEditModal() {
  editModal.classList.add("hidden");
  editForm.reset();
}

// Event delegation για Actions
tbody.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-act]");
  if (!btn) return;
  const id = btn.getAttribute("data-id");
  const act = btn.getAttribute("data-act");
  const booking = allBookings.find(b => b.id === id);
  if (!booking) return;

  if (act === "edit") {
    openEditModal(booking);
  } else if (act === "delete") {
    const ok = confirm(`Διαγραφή κράτησης του "${booking.name || booking.email || id}" ;`);
    if (!ok) return;
    try {
      await deleteDoc(doc(db, "bookings", id));
      // remove locally & re-render
      allBookings = allBookings.filter(b => b.id !== id);
      render();
      setStatus("Διαγράφηκε.");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Αποτυχία διαγραφής. Έλεγξε τα Firestore rules / δικαιώματα.");
    }
  }
});

// Modal close/cancel
editCancel.addEventListener("click", closeEditModal);
editClose.addEventListener("click", closeEditModal);
editModal.addEventListener("click", (e) => {
  if (e.target === editModal) closeEditModal();
});

// Save edit
editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = editId.value;
  const payload = {
    name: editName.value.trim(),
    email: editEmail.value.trim(),
    checkin: editCheckin.value,   // ή χρησιμοποίησε start/end αν αυτά έχεις παντού
    checkout: editCheckout.value, // π.χ. start/end (exclusive)
    message: editMessage.value.trim()
  };

  // Βασικοί έλεγχοι
  if (!payload.name || !payload.email || !payload.checkin || !payload.checkout) {
    alert("Συμπλήρωσε όλα τα απαιτούμενα πεδία.");
    return;
  }
  if (new Date(payload.checkin) >= new Date(payload.checkout)) {
    alert("Το check-out πρέπει να είναι μετά το check-in.");
    return;
  }

  try {
    await updateDoc(doc(db, "bookings", id), payload);
    // update locally
    const i = allBookings.findIndex(b => b.id === id);
    if (i >= 0) {
      allBookings[i] = { ...allBookings[i], ...payload };
    }
    render();
    closeEditModal();
    setStatus("Αποθηκεύτηκε.");
  } catch (err) {
    console.error("Update error:", err);
    alert("Αποτυχία αποθήκευσης. Έλεγξε τα Firestore rules / δικαιώματα.");
  }
});

searchInput.addEventListener("input", render);
sortSelect.addEventListener("change", render);
refreshBtn.addEventListener("click", loadBookings);
exportBtn.addEventListener("click", exportCSV);

// αρχική φόρτωση
loadBookings();
