// ========================
// Contact Page (Map link)
// ========================

const mapLink = document.getElementById('mapLink');
if (mapLink) {
  const userLang = navigator.language || 'el';
  const mapsUrl = "https://www.google.com/maps/place/%CE%9C%CE%B9%CE%BA%CF%81%CE%AE+%CE%92%CE%B9%CE%BB%CE%B1+%CE%93%CE%B5%CF%81%CE%B1%CE%BD%CE%AF/@38.5707471,24.046875,20z";
  mapLink.href = mapsUrl + (userLang.startsWith('en') ? "?hl=en" : "?hl=el");
}
