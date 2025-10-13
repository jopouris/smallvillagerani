// ========================
// Booking Form & EmailJS (fixed)
// ========================
(function () {
  const PUBLIC_KEY = 'Cbdpxqrk3jcrg98Yh';
  const SERVICE_ID = 'service_9t29d5f';
  const TEMPLATE_ID = 'client';

  const form = document.getElementById('booking-form');
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return;

  const t = (en, el) => (window.currentLang === 'en' ? en : el);

  // Init EmailJS νωρίς και σταθερά
  document.addEventListener('DOMContentLoaded', () => {
    const initEmailJS = () => {
      if (window.emailjs && typeof emailjs.init === 'function') {
        try {
          emailjs.init({ publicKey: PUBLIC_KEY });
          // console.log('EmailJS init OK');
        } catch (e) {
          console.warn('EmailJS init error', e);
        }
      } else {
        setTimeout(initEmailJS, 100);
      }
    };
    initEmailJS();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name     = form.name?.value.trim();
    const email    = form.email?.value.trim();
    const checkin  = form.checkin?.value;
    const checkout = form.checkout?.value; // exclusive
    const message  = form.message?.value || '';

    if (!name || !email || !checkin || !checkout) {
      alert(t('Please fill all required fields.', 'Παρακαλώ συμπληρώστε όλα τα απαραίτητα πεδία.'));
      return;
    }
    if (new Date(checkin) >= new Date(checkout)) {
      alert(t('Check-out must be after check-in.', 'Η ημερομηνία αναχώρησης πρέπει να είναι μετά την άφιξη.'));
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert(t('Please enter a valid email address.', 'Παρακαλώ δώστε ένα έγκυρο email.'));
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = t('Sending...', 'Αποστολή...');
    }

    const params = { name, email, checkin, checkout, message };

    try {
      if (!(window.emailjs && typeof emailjs.send === 'function')) {
        throw new Error('EmailJS SDK not loaded');
      }

      // ΠΕΡΝΑΜΕ και το publicKey ως 4ο arg για σιγουριά
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, params, PUBLIC_KEY);

      alert(t('Your booking request has been sent!', 'Η αίτηση κράτησης στάλθηκε με επιτυχία!'));

      const cal = window.__SVG_CALENDAR || window.calendar;
      if (cal && typeof cal.addEvent === 'function') {
        cal.addEvent({
          title: t('Booking (Pending)', 'Κράτηση (Αναμονή)'),
          start: checkin,
          end: checkout,
          color: '#ecc94b',
          display: 'background'
        });
      }

      form.reset();
    } catch (err) {
      console.error('EmailJS send error:', err?.text || err);
      // 412 = origin not allowed
      if (String(err?.status || '').includes('412') || /precondition/i.test(err?.text || '')) {
        alert(t(
          'Send failed (origin not allowed). Add your domain to EmailJS Origins and try again.',
          'Αποτυχία αποστολής (μη επιτρεπτό origin). Πρόσθεσε το domain σου στα Origins του EmailJS και δοκίμασε ξανά.'
        ));
      } else {
        alert(t(
          'Send failed. Please try again or contact us directly.',
          'Η αποστολή απέτυχε. Προσπαθήστε ξανά ή επικοινωνήστε μαζί μας.'
        ));
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = t('Submit', 'Αποστολή');
      }
    }
  });
})();
