// ========================
// FullCalendar — επιλογή εύρους (χωρίς Firebase & χωρίς blockedRanges)
// ========================

let calendar;

document.addEventListener('DOMContentLoaded', function () {
  const el = document.getElementById('calendar');
  if (!el) return;

  // === Helpers ===
  const iso = (d) => new Date(d).toISOString().split('T')[0];
  const todayISO = iso(new Date());

  let startDate = null;   // YYYY-MM-DD
  let highlighted = [];   // επιλεγμένες μέρες
  const blockedRanges = []; // πλέον άδειο (αν χρειαστεί, μπορείς να το γεμίσεις αργότερα)

  function isBlocked(dateStr) {
    const dt = new Date(dateStr);
    return blockedRanges.some(r => {
      const s = new Date(r.start);
      const e = new Date(r.end);
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
      if (cell)
        cell.classList.remove('range-day', 'start-day', 'end-day', 'selected-day', 'preview-range');
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
        if (id === endStr) cell.classList.add('end-day');
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

  // === FullCalendar ===
  calendar = new FullCalendar.Calendar(el, {
    initialView: 'dayGridMonth',
    height: 520,
    showNonCurrentDates: false,
    fixedWeekCount: false,
    validRange: { start: todayISO },
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,listMonth'
    },
    events: [], // δεν υπάρχουν αρχικές κρατήσεις

    datesSet() {
      document.querySelectorAll('.fc-daygrid-day').forEach(cell => {
        const d = cell.getAttribute('data-date');
        if (d && d < todayISO) cell.classList.add('past-date');
        if (d && isBlocked(d)) {
          cell.classList.add('blocked-date');
          cell.style.pointerEvents = 'none';
        }
        // Hover για προεπισκόπηση
        cell.addEventListener('mouseenter', () => {
          const dstr = cell.getAttribute('data-date');
          if (startDate && dstr && new Date(dstr) > new Date(startDate) && !isBlocked(dstr)) {
            previewRange(startDate, dstr);
          }
        });
        cell.addEventListener('mouseleave', clearPreview);
      });
    },

    dateClick(info) {
      const dateStr = info.dateStr;
      if (isBlocked(dateStr)) {
        alert('Η ημερομηνία είναι μη διαθέσιμη.');
        return;
      }

      const checkin = document.getElementById('checkin');
      const checkout = document.getElementById('checkout');

      // 1ο κλικ — άφιξη
      if (!startDate) {
        resetHighlight();
        startDate = dateStr;
        if (checkin) checkin.value = startDate;
        if (checkout) checkout.value = '';
        highlightRange(startDate, startDate);
        return;
      }

      // 2ο κλικ — αναχώρηση
      let endStr = dateStr;
      if (new Date(endStr) < new Date(startDate)) {
        startDate = endStr;
        if (checkin) checkin.value = startDate;
        if (checkout) checkout.value = '';
        resetHighlight();
        highlightRange(startDate, startDate);
        return;
      }

      if (rangeHasBlock(startDate, endStr)) {
        alert('Το επιλεγμένο διάστημα περιέχει μη διαθέσιμες ημέρες.');
        return;
      }

      // checkout = επόμενη μέρα (exclusive)
      const dep = new Date(endStr);
      dep.setDate(dep.getDate() + 1);
      if (checkout) checkout.value = iso(dep);

      highlightRange(startDate, endStr);
      startDate = null;
    },

    eventClick(info) {
      const start = info.event.start ? info.event.start.toLocaleDateString('el-GR') : '-';
      const end = info.event.end ? info.event.end.toLocaleDateString('el-GR') : '-';
      alert(`Κράτηση: ${info.event.title}\nΑπό: ${start}\nΈως: ${end}`);
    }
  });

  calendar.render();
  window.calendar = calendar; // προσβάσιμο παγκοσμίως
});
