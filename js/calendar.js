// ========================
// FullCalendar + Firestore: μπλοκάρισμα ημερομηνιών με βάση κρατήσεις
// ========================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let calendar;
let blockedRanges = []; // [{start:'YYYY-MM-DD', end:'YYYY-MM-DD', title:'...'}]

document.addEventListener('DOMContentLoaded', async function () {
  const el = document.getElementById('calendar');
  if (!el) return;

  const iso = (d) => new Date(d).toISOString().split('T')[0];
  const todayISO = iso(new Date());

  let startDate = null;     // YYYY-MM-DD (check-in)
  let highlighted = [];     // για καθάρισμα classnames

  // --- Helpers για blocked λογική ---
  function isBlocked(dateStr) {
    const dt = new Date(dateStr);
    return blockedRanges.some(r => {
      const s = new Date(r.start);
      const e = new Date(r.end); // exclusive
      return dt >= s && dt < e;
    });
  }

  function rangeHasBlock(startStr, endStr) {
    const s = new Date(startStr);
    const e = new Date(endStr);
    for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
      if (isBlocked(iso(d))) return true;
    }
    return false;
  }

  function resetHighlight() {
    highlighted.forEach(id => {
      const cell = document.querySelector(`[data-date="${id}"]`);
      if (cell) cell.classList.remove('range-day', 'start-day', 'end-day', 'selected-day', 'preview-range');
    });
    highlighted = [];
  }

  function highlightRange(startStr, endStr) {
    const s = new Date(startStr);
    const e = new Date(endStr);
    const single = startStr === endStr;

    for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
      const id = iso(d);
      const cell = document.querySelector(`[data-date="${id}"]`);
      if (!cell) continue;
      if (single) cell.classList.add('selected-day');
      else {
        cell.classList.add('range-day');
        if (id === startStr) cell.classList.add('start-day');
        if (id === endStr)   cell.classList.add('end-day');
      }
      highlighted.push(id);
    }
  }

  function clearPreview() {
    document.querySelectorAll('.preview-range').forEach(c => c.classList.remove('preview-range'));
  }

  function previewRange(startStr, endStr) {
    clearPreview();
    const s = new Date(startStr);
    const e = new Date(endStr);
    for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
      const id = iso(d);
      const cell = document.querySelector(`[data-date="${id}"]`);
      if (cell && !cell.classList.contains('selected-day')) {
        cell.classList.add('preview-range');
      }
    }
  }

  // --- Αρχικοποίηση FullCalendar ---
  calendar = new FullCalendar.Calendar(el, {
    initialView: 'dayGridMonth',
    height: 520,
    showNonCurrentDates: false,
    fixedWeekCount: false,
    validRange: { start: todayISO },
    headerToolbar: { left:'prev,next today', center:'title', right:'dayGridMonth,listMonth' },

    // Θα γεμίσουμε events μετά το fetch

    datesSet() {
      document.querySelectorAll('.fc-daygrid-day').forEach(cell => {
        const d = cell.getAttribute('data-date');
        if (!d) return;

        // παρελθόν
        if (d < todayISO) {
          cell.classList.add('past-date');
          cell.style.pointerEvents = 'none';
        }

        // μπλοκαρισμένες (από Firestore)
        if (isBlocked(d)) {
          cell.classList.add('blocked-date');
          cell.style.pointerEvents = 'none';
        }

        // hover preview
        cell.addEventListener('mouseenter', () => {
          if (startDate && d && new Date(d) > new Date(startDate) && !isBlocked(d)) {
            previewRange(startDate, d);
          }
        });
        cell.addEventListener('mouseleave', clearPreview);
      });
    },

    dateClick(info) {
      const dateStr = info.dateStr;

      // αν είναι μπλοκαρισμένη, σταμάτα
      if (isBlocked(dateStr)) {
        alert('Η ημερομηνία είναι μη διαθέσιμη.');
        return;
      }

      const checkin  = document.getElementById('checkin');
      const checkout = document.getElementById('checkout');

      // 1ο κλικ — ορισμός άφιξης
      if (!startDate) {
        resetHighlight();
        startDate = dateStr;
        if (checkin)  checkin.value  = startDate;
        if (checkout) checkout.value = '';
        highlightRange(startDate, startDate);
        return;
      }

      // 2ο κλικ — ορισμός αναχώρησης
      let endStr = dateStr;

      // αν πάτησε πριν από την άφιξη, επανεκκίνηση
      if (new Date(endStr) < new Date(startDate)) {
        startDate = endStr;
        if (checkin)  checkin.value  = startDate;
        if (checkout) checkout.value = '';
        resetHighlight();
        highlightRange(startDate, startDate);
        return;
      }

      // έλεγχος σύγκρουσης με blocked
      if (rangeHasBlock(startDate, endStr)) {
        alert('Το επιλεγμένο διάστημα περιέχει μη διαθέσιμες ημέρες.');
        return;
      }

      // checkout = επόμενη μέρα της end (exclusive)
      const dep = new Date(endStr);
      dep.setDate(dep.getDate() + 1);
      if (checkout) checkout.value = iso(dep);

      highlightRange(startDate, endStr);
      startDate = null;
    },

    eventClick(info) {
      const start = info.event.start ? info.event.start.toLocaleDateString('el-GR') : '-';
      const end   = info.event.end   ? info.event.end.toLocaleDateString('el-GR')   : '-';
      alert(`Κράτηση: ${info.event.title}\nΑπό: ${start}\nΈως: ${end}`);
    }
  });

  calendar.render();
  window.calendar = calendar;

  // === Φόρτωμα κρατήσεων από Firestore και κλείδωμα ημερών ===
  await loadBookingsAndBlock();
});

// Φέρνουμε όλα τα bookings και ενημερώνουμε το calendar & blockedRanges
async function loadBookingsAndBlock() {
  try {
    const snap = await getDocs(collection(getFirestore(), "bookings"));
    blockedRanges = [];

    const events = [];

    snap.forEach(doc => {
      const data = doc.data();

      // Αν στη συλλογή σου τα πεδία είναι 'checkin' / 'checkout', χρησιμοποίησε τα:
      const start = data.start || data.checkin;   // <-- προσαρμογή ονομάτων
      const end   = data.end   || data.checkout;  // <-- προσαρμογή ονομάτων
      if (!start || !end) return;

      blockedRanges.push({
        start,
        end,
        title: data.title || 'Κράτηση'
      });

      // Προσθήκη ως background event για ορατότητα
      events.push({
      
        start,
        end,                // checkout (exclusive)
        display: 'background',
        color: 'rgba(220,53,69,0.35)'
      });
    });

    // καθάρισε τυχόν παλιά events και πρόσθεσε τα νέα
    calendar.getEvents().forEach(ev => ev.remove());
    events.forEach(ev => calendar.addEvent(ev));

    // Επανα-τρέχει το datesSet styling στο τρέχον view
    calendar.render();
  } catch (err) {
    console.error('Σφάλμα φόρτωσης κρατήσεων από Firestore:', err);
    alert('Σφάλμα φόρτωσης κρατήσεων. Ελέγξτε τα δικαιώματα Firestore ή τη σύνδεση.');
  }
}
