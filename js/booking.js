// ========================
// Booking Form & EmailJS
// ========================

const form = document.getElementById('booking-form');
const submitBtn = document.getElementById('submit-btn');

document.addEventListener('DOMContentLoaded', () => {
  const initEmailJS = () => {
    if (window.emailjs) {
      try { emailjs.init('Cbdpxqrk3jcrg98Yh'); } catch(e) { console.warn('EmailJS init error', e); }
    } else setTimeout(initEmailJS, 100);
  };
  initEmailJS();
});

form?.addEventListener('submit', e => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const checkin = form.checkin.value;
  const checkout = form.checkout.value;

  if (!name || !email || !checkin || !checkout) {
    alert('Παρακαλώ συμπληρώστε όλα τα απαραίτητα πεδία');
    return;
  }
  if (new Date(checkin) >= new Date(checkout)) {
    alert('Η ημερομηνία αναχώρησης πρέπει να είναι μετά την άφιξη');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Αποστολή...';

  const params = { name, email, checkin, checkout, message: form.message.value || '' };

  if (window.emailjs && emailjs.send) {
    emailjs.send('service_9t29d5f', 'SmallVillaGerani', params)
      .then(() => {
        alert('Η κράτησή σας στάλθηκε με επιτυχία!');
        if (window.calendar) {
          window.calendar.addEvent({ title:'Κράτηση (Αναμονή)', start:checkin, end:checkout, color:'#ecc94b' });
        }
        form.reset();
      })
      .catch(() => alert('Σφάλμα κατά την αποστολή. Προσπαθήστε ξανά.'))
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Αποστολή';
      });
  } else {
    setTimeout(() => {
      alert('Η κράτηση καταχωρήθηκε (δοκιμαστική λειτουργία)');
      if (window.calendar) {
        window.calendar.addEvent({ title:'Κράτηση (Αναμονή)', start:checkin, end:checkout, color:'#ecc94b' });
      }
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Αποστολή';
    }, 800);
  }
});
