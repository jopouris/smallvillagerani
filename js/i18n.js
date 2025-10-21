// js/i18n.js
(() => {
  /* =========================
     1) ΛΕΞΙΚΑ ΜΕΤΑΦΡΑΣΕΩΝ
  ==========================*/
  const translations = {
    el: {
      // Nav
      nav_home: "Αρχική",
      nav_about: "Σχετικά",
      nav_gallery: "Γκαλερί",
      nav_suggestions: "Προτάσεις",
      nav_sights: "Αξιοθέατα",
      nav_booking: "Κράτηση",

      // Hero
      hero_title: "Small Villa Gerani",
      hero_text: "Η απόλαυση της χαλάρωσης απαιτεί χώρους φτιαγμένους για να την υποδέχονται",
      hero_cta: "Κάντε Αίτημα Κράτησης",
      view_gallery: "Δείτε τη Γκαλερί",

      // About
   // About
about_lead: "Μια μικρή, φιλόξενη βίλα στην Εύβοια — ιδανική για χαλαρωτικές διακοπές, εξερεύνηση παραλιών και δραστηριότητες στη φύση.",
about_text1: "Καλώς ήρθατε στη Small Villa Gerani: έναν ήρεμο χώρο για οικογένειες ή παρέες που αναζητούν ποιότητα και άνεση.",
about_text2: "Πλήρως εξοπλισμένη βίλα με κουζίνα, ευρύχωρα υπνοδωμάτια, εξωτερικό χώρο και εύκολη πρόσβαση σε παραλίες και μονοπάτια.",
about_feature1: "Γρήγορο Wi-Fi & Smart TV",
about_feature2: "Πλήρης κουζίνα & εξωτερική ψησταριά",
about_feature3: "Προσβάσιμο parking & κοντά σε δραστηριότητες",

      // Gallery overlays
      room1: "Υπνοδωμάτιο 1",
      room2: "Υπνοδωμάτιο 2",
      living_room: "Σαλόνι",
      kitchen: "Κουζίνα",
      exterior1: "Εξωτερικό 1",
      exterior2: "Εξωτερικό 2",

      // Suggestions (section)
      suggestions_title: "Προτάσεις για Επισκέπτες",
      suggestions_lead: "Επιλογές για παραλίες, αξιοθέατα και δραστηριότητες κοντά στη βίλα.",

      // Beaches (cards)
      beach_thapsa_title: "Παραλία Θαψά",
      beach_thapsa_text: "Μικρή, ήσυχη παραλία με αμμουδιά και κρυστάλλινα νερά — ιδανική για όσους θέλουν χαλάρωση μακριά από τα πλήθη.",
      beach_soutsini_title: "Παραλία Σουτσίνι",
      beach_soutsini_text: "Βραχώδης ακτή με καθαρά νερά και ωραίο βυθό — αγαπημένη για snorkeling και κοντινές βόλτες στην ακτή.",
      beach_stomio_title: "Παραλία Στόμιο",
      beach_stomio_text: "Το ενδιαφέρον τοπίο όπου ο ποταμός συναντά τη θάλασσα δημιουργεί μοναδική ατμόσφαιρα — ωραίο για φωτογραφίες και εξερεύνηση.",
      beach_mourteri_title: "Παραλία Μουρτερή",
      beach_mourteri_text: "Μεγάλη, οργανωμένη παραλία με επιλογές σε ταβέρνες και beach bars — ιδανική για οικογένειες και άνετες μέρες στη θάλασσα.",
      beach_kalamos_title: "Παραλία Κάλαμος",
      beach_kalamos_text: "Μία από τις πιο δημοφιλείς παραλίες της περιοχής με λευκή άμμο και τιρκουάζ νερά — πολύ όμορφη για κολύμβηση και ηλιοθεραπεία.",
      beach_mageiras_title: "Παραλία Μάγειρας",
      beach_mageiras_text: "Μικρή και ήσυχη παραλία, κατάλληλη για όσους θέλουν να χαλαρώσουν χωρίς πολυκοσμία — καλή επιλογή για ήσυχα μπάνια.",
      beach_kakolimano_title: "Παραλία Κακολίμανο",
      beach_kakolimano_text: "Βραχώδης κόλπος με βαθιά γαλάζια νερά — γραφικό τοπίο και ωραίο για βουτιές σε καθαρά νερά.",
      beach_almyrichi_title: "Παραλία Αλμυρίχι",
      beach_almyrichi_text: "Μοναδικοί βραχώδεις σχηματισμοί και καθαρά νερά — αγαπημένη των ντόπιων, καλή για βόλτες και εξερεύνηση της ακτής.",
      beach_almyropotamos_title: "Παραλία Αλμυροποτάμου",
      beach_almyropotamos_text: "Εκτεταμένη παραλία κοντά σε εκβολή ποταμού — κοσμοπολίτικη αίσθηση με επιλογές για φαγητό και θαλάσσιες δραστηριότητες.",

      // Climbing
      climb_title: "Μανίκια — Αναρριχητικά Πεδία",

      // Sights
      sights_title: "Αξιοθέατα",
      sight_manikia_title: "Φαράγγι-Καταράκτης Μανικίων",
      sight_manikia_text: "Εντυπωσιακό φαράγγι με μονοπάτια για πεζοπορία, φυσικά ρεύματα και μοναδική θέα, ιδανικό για εξερεύνηση και φωτογραφίες.",
      sight_theatre_title: "Αρχαίο Θέατρο Ερέτριας",
      sight_theatre_text: "Σημαντικό αρχαιολογικό μνημείο με εκπληκτική θέα και πλούσια ιστορία, σημείο αναφοράς για πολιτισμό και τέχνη.",
      sight_olive_title: "Αρχαία Ελιά στο χωριό Κήποι",
      sight_olive_text: "Μοναδικό δέντρο αιώνων, σύμβολο της ιστορίας και της παράδοσης της περιοχής, ιδανικό για μια ήσυχη επίσκεψη.",
      sight_kolethra_title: "Πηγή Κολέθρα",
      sight_kolethra_text: "Φυσική πηγή με καθαρά νερά και γραφικό περιβάλλον, ιδανική για σύντομη στάση ή πικνίκ στη φύση.",
      sight_panagia_title: "Κρυφή Παναγιά",
      sight_panagia_text: "Ιερό εκκλησάκι κρυμμένο μέσα στη φύση, προσφέρει γαλήνη και μοναδική αίσθηση απομόνωσης για επισκέπτες.",
      sight_papanikolaou_title: "Μουσείο Παπανικολάου",
      sight_papanikolaou_text: "Αφιερωμένο στον μεγάλο επιστήμονα, προσφέρει εκθέσεις και πληροφορίες για τη ζωή και το έργο του Κ. Παπανικολάου.",

      // Booking
      form_name: "Ονοματεπώνυμο *",
      form_email: "Email *",
      form_checkin: "Άφιξη",
      form_checkout: "Αναχώρηση",
      form_message: "Μήνυμα / Προτιμήσεις",
      form_submit: "Αποστολή",

      // Contact
      contact_title: "Επικοινωνία",
      map_button: "Δείτε τη θέση μας εδώ",

      view_on_map: "Δείτε στο χάρτη", 
    },

    en: {
      // Nav
      nav_home: "Home",
      nav_about: "About",
      nav_gallery: "Gallery",
      nav_suggestions: "Suggestions",
      nav_sights: "Sights",
      nav_booking: "Booking",

      // Hero
      hero_title: "Small Villa Gerani",
      hero_text: "True relaxation needs spaces designed to welcome it.",
      hero_cta: "Request a Booking",
      view_gallery: "View Gallery",

      // About
    // About
about_lead: "A cozy, compact villa in Evia—perfect for relaxing holidays, beach hopping and outdoor activities.",
about_text1: "Welcome to Small Villa Gerani: a tranquil place for families or friends seeking quality and comfort.",
about_text2: "Fully equipped villa with kitchen, spacious bedrooms, outdoor area and easy access to beaches and trails.",
about_feature1: "Fast Wi-Fi & Smart TV",
about_feature2: "Fully equipped kitchen & outdoor BBQ",
about_feature3: "Accessible parking & close to activities",

      // Gallery overlaysgallery_lead
      gallery_lead: "A selection of photos showcasing the villa's interior and exterior spaces.",
      room1: "Bedroom 1",
      room2: "Bedroom 2",
      living_room: "Living Room",
      kitchen: "Kitchen",
      exterior1: "Exterior 1",
      exterior2: "Exterior 2",

      // Suggestions (section)
      suggestions_title: "Suggestions for Guests",
      suggestions_lead: "Options for beaches, points of interest and activities near the villa.",

      // Beaches (cards)
      beach_thapsa_title: "Thapsa Beach",
      beach_thapsa_text: "Small, quiet beach with sand and crystal-clear waters—ideal for relaxing away from crowds.",
      beach_soutsini_title: "Soutsini Beach",
      beach_soutsini_text: "Rocky shore with clear waters and a nice seabed—popular for snorkeling and coastal walks.",
      beach_stomio_title: "Stomio Beach",
      beach_stomio_text: "Where the river meets the sea—unique landscape, great for photos and exploration.",
      beach_mourteri_title: "Mourteri Beach",
      beach_mourteri_text: "Long, organized beach with tavernas and beach bars—ideal for families and easy beach days.",
      beach_kalamos_title: "Kalamos Beach",
      beach_kalamos_text: "One of the area’s most popular beaches with white sand and turquoise waters—great for swimming and sunbathing.",
      beach_mageiras_title: "Mageiras Beach",
      beach_mageiras_text: "Small and quiet—perfect if you want a peaceful swim without the crowds.",
      beach_kakolimano_title: "Kakolimano Beach",
      beach_kakolimano_text: "Rocky cove with deep blue waters—scenic and great for dives in pristine water.",
      beach_almyrichi_title: "Almyrichi Beach",
      beach_almyrichi_text: "Unique rock formations and clear waters—local favorite for walks and coastal exploration.",
      beach_almyropotamos_title: "Almyropotamos Beach",
      beach_almyropotamos_text: "Wide beach near a river mouth—cosmopolitan vibe with food and water-sport options.",

      // Climbing
      climb_title: "Manikia — Climbing Fields",
      climb_lead: "An up-and-coming destination for climbers with excellent fields and Aegean views.",

      // Sights
      sights_title: "Sights",
      sights_lead: "Nearby points of interest—nature, culture and monuments worth seeing.",
      sight_manikia_title: "Manikia Gorge & Waterfall",
      sight_manikia_text: "Impressive gorge with hiking paths, streams and unique views—ideal for exploration and photography.",
      sight_theatre_title: "Ancient Theatre of Eretria",
      sight_theatre_text: "Important archaeological site with great views and rich history—cultural landmark.",
      sight_olive_title: "Ancient Olive Tree (Kipoi village)",
      sight_olive_text: "Centuries-old olive, a symbol of local history and tradition—perfect for a quiet visit.",
      sight_kolethra_title: "Kolethra Spring",
      sight_kolethra_text: "Natural spring with clear waters in a scenic setting—ideal for a short stop or picnic.",
      sight_panagia_title: "Kryfi Panagia",
      sight_panagia_text: "Hidden chapel in nature—offers serenity and a unique sense of seclusion.",
      sight_papanikolaou_title: "Papanikolaou Museum",
      sight_papanikolaou_text: "Dedicated to the great scientist—exhibitions and info about the life and work of G. Papanikolaou.",

      // Booking
      form_name: "Full Name *",
      form_email: "Email *",
      form_checkin: "Check-in",
      form_checkout: "Check-out",
      form_message: "Message / Preferences",
      form_submit: "Send",

      // Contact
      contact_title: "Contact",
      map_button: "See our location here",

      view_on_map: "View on map",
    }
  };

  /* =========================================
     2) ΒΟΗΘΗΤΙΚΑ: αποθήκευση/ανάκτηση γλώσσας
  ==========================================*/
  const STORAGE_KEY = "svgerani_lang";
  const DEFAULT_LANG = "el";

  function getInitialLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && translations[saved]) return saved;
    // fallback στον browser
    const nav = (navigator.language || "").toLowerCase();
    if (nav.startsWith("el")) return "el";
    return "en";
  }

  function saveLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
  }

  /* =======================================================
     3) ΕΦΑΡΜΟΓΗ ΜΕΤΑΦΡΑΣΕΩΝ σε text & attributes
     - data-i18n="key" => textContent
     - data-i18n-attrs='{"aria-label":"keyX","placeholder":"keyY"}'
  ========================================================*/
  function translateElement(el, lang) {
    // text
    const key = el.getAttribute("data-i18n");
    if (key && translations[lang]?.[key] != null) {
      el.textContent = translations[lang][key];
    }

    // attributes
    const attrs = el.getAttribute("data-i18n-attrs");
    if (attrs) {
      try {
        const map = JSON.parse(attrs);
        Object.entries(map).forEach(([attr, attrKey]) => {
          const val = translations[lang]?.[attrKey];
          if (val != null) el.setAttribute(attr, val);
        });
      } catch { /* σιωπηλή αποτυχία αν το JSON είναι λάθος */ }
    }
  }

  function applyTranslations(lang) {
    document.documentElement.setAttribute("lang", lang);
    document.querySelectorAll("[data-i18n]").forEach(el => translateElement(el, lang));
    document.querySelectorAll("[data-i18n-attrs]").forEach(el => translateElement(el, lang));

    // ενημέρωση κουμπιού toggle
    const btn = document.getElementById("lang-toggle");
    if (btn) {
      // δείξε ΠΟΙΑ γλώσσα θα μπει αν πατηθεί (αν είμαστε el, δείξε EN)
      btn.textContent = (lang === "el") ? "EN" : "EL";
      btn.setAttribute("aria-pressed", lang === "en" ? "true" : "false");
    }
  }

  /* ===============================
     4) PUBLIC t() για scripts
  ================================*/
  function t(key, lang = currentLang) {
    return translations[lang]?.[key] ?? translations[DEFAULT_LANG]?.[key] ?? key;
  }

  /* ===============================
     5) INIT + TOGGLE + OBSERVER
  ================================*/
  let currentLang = getInitialLang();

  function toggleLang() {
    currentLang = (currentLang === "el") ? "en" : "el";
    saveLang(currentLang);
    applyTranslations(currentLang);
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Αν δεν υπάρχει κουμπί, δεν τρέχει κάτι.
    const btn = document.getElementById("lang-toggle");
    if (btn) btn.addEventListener("click", toggleLang);

    applyTranslations(currentLang);

    // Παρακολούθηση δυναμικών αλλαγών (π.χ. περιεχόμενο που μπαίνει αργότερα)
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes?.forEach(node => {
          if (!(node instanceof HTMLElement)) return;
          if (node.hasAttribute?.("data-i18n") || node.hasAttribute?.("data-i18n-attrs")) {
            translateElement(node, currentLang);
          }
          node.querySelectorAll?.("[data-i18n], [data-i18n-attrs]").forEach(el => translateElement(el, currentLang));
        });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Κάνε διαθέσιμα global
    window.i18n = { t, applyTranslations, toggleLang, get current() { return currentLang; } };
  });
})();
// Κάνε όλα τα Google Maps links μεταφράσιμα (εκτός από το ειδικό κουμπί επαφής #mapLink)
document.querySelectorAll('a[href*="google.com/maps"]:not(#mapLink)').forEach(a => {
  // Αν δεν έχει ήδη data-i18n κάπου μέσα, όρισε το στο <a>
  if (!a.querySelector('[data-i18n]') && !a.hasAttribute('data-i18n')) {
    a.setAttribute('data-i18n', 'view_on_map');
  }
  // Δώσε και προσβάσιμα attributes μεταφράσιμα
  a.setAttribute('data-i18n-attrs', '{"title":"view_on_map","aria-label":"view_on_map"}');
});

// Επανεφάρμοσε μεταφράσεις μετά το auto-setup
applyTranslations(currentLang);
