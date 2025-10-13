// ========================
// Language Toggle (i18n)
// ========================

const translations = {
  en: {
    nav_home: "Home",
    nav_about: "About",
    nav_gallery: "Gallery",
    nav_suggestions: "Suggestions",
    nav_sights: "Sights",
    nav_booking: "Booking",
    hero_title: "Small Villa Gerani",
    hero_text: "Relaxing times demand relaxing places",
    hero_cta: "Make a Booking Request",
    view_gallery: "View Gallery",
    about_lead: "A cozy villa in Evia — perfect for relaxation, beaches and nature activities.",
    about_text1: "Welcome to Small Villa Gerani: a peaceful place for families or groups seeking comfort.",
    about_text2: "Fully equipped villa with kitchen, spacious bedrooms, outdoor space and easy access to beaches and trails.",
    gallery_lead: "Photos of interior and exterior spaces of the villa.",
    suggestions_title: "Guest Suggestions",
    suggestions_lead: "Beaches, sights and activities near the villa.",
    form_name: "Full Name *",
    form_email: "Email *",
    form_checkin: "Check-in",
    form_checkout: "Check-out",
    form_message: "Message / Preferences",
    form_submit: "Submit",
    contact_title: "Contact"
  }
};

const originals = {};
document.querySelectorAll('[data-i18n]').forEach(el => {
  originals[el.getAttribute('data-i18n')] = el.textContent;
});

let currentLang = 'el';
const langToggle = document.getElementById('lang-toggle');

function applyLang(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = lang === 'en' && translations.en[key]
      ? translations.en[key]
      : originals[key] || el.textContent;
  });
  document.documentElement.lang = lang;
}

langToggle?.addEventListener('click', () => {
  const newLang = currentLang === 'el' ? 'en' : 'el';
  applyLang(newLang);
  langToggle.textContent = newLang === 'el' ? 'EN' : 'ΕΛ';
  currentLang = newLang;
});
