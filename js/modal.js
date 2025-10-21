// js/modal.js
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalClose = document.getElementById('modal-close');
let lastFocusEl = null;

function openModal(src, alt = '') {
  if (!modal || !modalImg || !modalClose) return;
  lastFocusEl = document.activeElement;
  modalImg.src = src;
  modalImg.alt = alt;
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeModal() {
  if (!modal || !modalImg) return;
  modal.setAttribute('aria-hidden', 'true');
  modalImg.src = '';
  document.body.style.overflow = '';
  if (lastFocusEl) lastFocusEl.focus();
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modal) {
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal?.getAttribute('aria-hidden') === 'false') closeModal();
});

// Κάν’ το διαθέσιμο στο inline HTML
window.openModal = openModal;
window.closeModal = closeModal;
