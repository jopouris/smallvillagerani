// ========================
// Navigation & Menu Toggle
// ========================

const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile menu toggle
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('show');
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('show');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Close menu on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks?.classList.contains('show')) {
    navLinks.classList.remove('show');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }
});
