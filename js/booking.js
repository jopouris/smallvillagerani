// ========================
// Booking Form: EmailJS + Firestore
// ========================

// --- Firebase (CDN modular) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- Firebase config (smallvillagerani) ---
const firebaseConfig = {
  apiKey: "AIzaSyBuN5dn_PNC37CbiaRaQRx78gds6f-JXbI",
  authDomain: "smallvillagerani.firebaseapp.com",
  projectId: "smallvillagerani",
  storageBucket: "smallvillagerani.firebasestorage.app",
  messagingSenderId: "762742575521",
  appId: "1:762742575521:web:0fbd4b3bd62caafe013be0"
};

// init Firebase/Firestore
let db = null;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (e) {
  console.warn("Firebase init error:", e);
}

// --- EmailJS config ---
const PUBLIC_KEY  = "Cbdpxqrk3jcrg98Yh";
const SERVICE_ID  = "service_9t29d5f";
const TEMPLATE_ID = "client";

// helpers
const $ = (sel) => document.querySelector(sel);
const t = (en, el) => (window.currentLang === "en" ? en : el);

// elements
const form = $("#booking-form");
const submitBtn = $("#submit-btn");
const loadingSpinner = $(".loading-spinner");

// init EmailJS early
document.addEventListener("DOMContentLoaded", () => {
  const initEmail = () => {
    if (window.emailjs && typeof emailjs.init === "function") {
      try {
        emailjs.init({ publicKey: PUBLIC_KEY });
      } catch (e) {
        console.warn("EmailJS init error", e);
      }
    } else {
      setTimeout(initEmail, 120);
    }
  };
  initEmail();
});

// Show message helper
function showMessage(text, type = "success") {
  // Remove any existing messages
  const existingMsg = $(".booking-message-toast");
  if (existingMsg) {
    existingMsg.remove();
  }

  // Create new message
  const msg = document.createElement("div");
  msg.className = `booking-message-toast ${type}`;
  msg.innerHTML = `
    <div class="message-content">
      <span class="message-icon">${type === "success" ? "✓" : "⚠"}</span>
      <span class="message-text">${text}</span>
    </div>
    <button class="message-close-btn" aria-label="Close">×</button>
  `;
  
  document.body.appendChild(msg);
  
  // Trigger animation
  setTimeout(() => msg.classList.add("show"), 10);
  
  // Close button handler
  const closeBtn = msg.querySelector(".message-close-btn");
  closeBtn.addEventListener("click", () => {
    msg.classList.remove("show");
    setTimeout(() => msg.remove(), 400);
  });
  
  // Auto-hide success messages after 6 seconds
  if (type === "success") {
    setTimeout(() => {
      if (msg.parentNode) {
        msg.classList.remove("show");
        setTimeout(() => msg.remove(), 400);
      }
    }, 6000);
  }
}

// Validate dates
function validateDates(checkin, checkout) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const checkinDate = new Date(checkin);
  const checkoutDate = new Date(checkout);
  
  // Check if dates are in the past
  if (checkinDate < today) {
    return t(
      "Check-in date cannot be in the past.",
      "Η ημερομηνία άφιξης δεν μπορεί να είναι στο παρελθόν."
    );
  }
  
  // Check if checkout is after checkin
  if (checkoutDate <= checkinDate) {
    return t(
      "Check-out date must be after check-in date.",
      "Η ημερομηνία αναχώρησης πρέπει να είναι μετά την άφιξη."
    );
  }
  
  // Check minimum stay (at least 1 night)
  const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
  if (nights < 1) {
    return t(
      "Minimum stay is 1 night.",
      "Ελάχιστη διαμονή 1 διανυκτέρευση."
    );
  }
  
  return null; // No error
}

// Validate email
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// save to Firestore
async function saveBookingToFirestore({ name, email, checkin, checkout, message }) {
  if (!db) throw new Error("Firestore not initialized");
  const docRef = await addDoc(collection(db, "bookings"), {
    name,
    email,
    checkin,   // YYYY-MM-DD
    checkout,  // YYYY-MM-DD (exclusive)
    message,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

// Set loading state
function setLoading(isLoading) {
  if (submitBtn) {
    submitBtn.disabled = isLoading;
    if (isLoading) {
      submitBtn.innerHTML = `
        <span class="loading-spinner" style="display: inline-block;"></span>
        ${t("Sending...", "Αποστολή...")}
      `;
    } else {
      submitBtn.innerHTML = t("Submit", "Αποστολή");
    }
  }
}

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name     = form.name?.value.trim();
  const email    = form.email?.value.trim();
  const checkin  = form.checkin?.value;
  const checkout = form.checkout?.value; // exclusive από το calendar
  const message  = form.message?.value.trim() || "";

  // Validation
  if (!name || !email || !checkin || !checkout) {
    showMessage(
      t("Please fill all required fields.", "Παρακαλώ συμπληρώστε όλα τα απαραίτητα πεδία."),
      "error"
    );
    return;
  }

  // Validate email
  if (!validateEmail(email)) {
    showMessage(
      t("Please enter a valid email address.", "Παρακαλώ εισάγετε ένα έγκυρο email."),
      "error"
    );
    return;
  }

  // Validate dates
  const dateError = validateDates(checkin, checkout);
  if (dateError) {
    showMessage(dateError, "error");
    return;
  }

  // Set loading state
  setLoading(true);

  const params = { name, email, checkin, checkout, message };

  try {
    // --- send via EmailJS ---
    if (!(window.emailjs && typeof emailjs.send === "function")) {
      throw new Error("EmailJS SDK not loaded");
    }
   // await emailjs.send(SERVICE_ID, TEMPLATE_ID, params, PUBLIC_KEY);

    // --- save to Firestore (αν διαθέσιμο) ---
    try {
      const id = await saveBookingToFirestore(params);
      console.log("Firestore booking saved with id:", id);
    } catch (dbErr) {
      // δεν μπλοκάρουμε τον χρήστη αν αποτύχει η βάση
      console.warn("Firestore save failed:", dbErr);
    }

    // ενημέρωση ημερολογίου - κοκκινίζουμε τις ημέρες
    const cal = window.__SVG_CALENDAR || window.calendar;
    if (cal && typeof cal.addEvent === "function") {
      cal.addEvent({
        start: checkin,
        end: checkout,   // exclusive
        color: "#ef4444",  // κόκκινο χρώμα
        display: "background"
      });
    }

    // Success message
    showMessage(
      t(
        "Your booking request has been sent successfully! We'll get back to you soon.",
        "Η αίτηση κράτησης στάλθηκε με επιτυχία! Θα επικοινωνήσουμε σύντομα μαζί σας."
      ),
      "success"
    );

    // Reset form
    form.reset();

  } catch (err) {
    console.error("Send error:", err?.status, err?.text || err?.message || err);

    let errorMessage = t(
      "Failed to send your booking request. Please try again or contact us directly.",
      "Αποτυχία αποστολής της κράτησης. Παρακαλώ δοκιμάστε ξανά ή επικοινωνήστε μαζί μας."
    );

    // Specific error messages
    if (String(err?.text || "").toLowerCase().includes("outlook")) {
      errorMessage = t(
        "Email service temporarily unavailable (Outlook reconnection needed). Please try again later or contact us directly.",
        "Η υπηρεσία email είναι προσωρινά μη διαθέσιμη (απαιτείται επανασύνδεση Outlook). Δοκιμάστε αργότερα ή επικοινωνήστε μαζί μας."
      );
    } else if (String(err?.status || "") === "412" || /precondition/i.test(err?.text || "")) {
      errorMessage = t(
        "Configuration error detected. Please contact the site administrator.",
        "Εντοπίστηκε σφάλμα διαμόρφωσης. Παρακαλώ επικοινωνήστε με τον διαχειριστή."
      );
    } else if (/network|failed to fetch/i.test(err?.message || "")) {
      errorMessage = t(
        "Network error. Please check your internet connection and try again.",
        "Σφάλμα δικτύου. Παρακαλώ ελέγξτε τη σύνδεσή σας και δοκιμάστε ξανά."
      );
    }

    showMessage(errorMessage, "error");

  } finally {
    setLoading(false);
  }
});

// Add CSS for toast messages and loading spinner
if (!document.getElementById("booking-form-styles")) {
  const style = document.createElement("style");
  style.id = "booking-form-styles";
  style.textContent = `
    @keyframes slideInDown {
      from {
        opacity: 0;
        transform: translate(-50%, -100%);
      }
      to {
        opacity: 1;
        transform: translate(-50%, 0);
      }
    }

    @keyframes slideOutUp {
      from {
        opacity: 1;
        transform: translate(-50%, 0);
      }
      to {
        opacity: 0;
        transform: translate(-50%, -100%);
      }
    }

    .booking-message-toast {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translate(-50%, -100%);
      min-width: 320px;
      max-width: 500px;
      padding: 1.2rem 1.5rem;
      border-radius: 16px;
      box-shadow: 
        0 10px 40px rgba(0, 0, 0, 0.2),
        0 5px 20px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(20px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .booking-message-toast.show {
      opacity: 1;
      transform: translate(-50%, 0);
      animation: slideInDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .booking-message-toast.success {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .booking-message-toast.error {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: #ffffff;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .message-content {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      flex: 1;
    }

    .message-icon {
      font-size: 1.5rem;
      font-weight: bold;
      line-height: 1;
      flex-shrink: 0;
    }

    .message-text {
      font-size: 0.95rem;
      font-weight: 600;
      line-height: 1.5;
    }

    .message-close-btn {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      opacity: 0.9;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      flex-shrink: 0;
      line-height: 1;
      padding: 0;
    }

    .message-close-btn:hover {
      opacity: 1;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
    }

    @media (max-width: 768px) {
      .booking-message-toast {
        top: 10px;
        left: 10px;
        right: 10px;
        min-width: auto;
        max-width: none;
        transform: translateY(-100%);
      }

      .booking-message-toast.show {
        transform: translateY(0);
      }

      .message-text {
        font-size: 0.9rem;
      }

      .message-icon {
        font-size: 1.3rem;
      }

      .message-close-btn {
        width: 28px;
        height: 28px;
        font-size: 1.3rem;
      }
    }
  `;
  document.head.appendChild(style);
}