(function () {
  'use strict';

  /* open / closed chip from the real hours, Kyiv time */
  var HOURS = { 0: [9, 15], 1: [8, 17], 2: [8, 17], 3: [8, 17], 4: [8, 17], 5: [8, 17], 6: [9, 15] };
  var DAY = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  function pad(h) { return (h < 10 ? '0' : '') + h + ':00'; }
  try {
    var tz = 'Europe/Kyiv';
    try { new Intl.DateTimeFormat('uk', { timeZone: tz }); } catch (e) { tz = 'Europe/Kiev'; }
    var parts = new Intl.DateTimeFormat('en-GB', { timeZone: tz, weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    var get = function (t) { for (var i = 0; i < parts.length; i++) if (parts[i].type === t) return parts[i].value; return ''; };
    var d = DAY[get('weekday')];
    var mins = (parseInt(get('hour'), 10) % 24) * 60 + parseInt(get('minute'), 10);
    var h = HOURS[d];
    var open = mins >= h[0] * 60 && mins < h[1] * 60;
    var text;
    if (open) {
      text = 'Зараз відчинено, до ' + pad(h[1]);
    } else if (mins < h[0] * 60) {
      text = 'Зараз зачинено, відчинимо о ' + pad(h[0]);
    } else {
      text = 'Зараз зачинено, завтра з ' + pad(HOURS[(d + 1) % 7][0]);
    }
    Array.prototype.forEach.call(document.querySelectorAll('[data-status]'), function (el) {
      el.textContent = text;
      el.setAttribute('data-open', open ? '1' : '0');
      el.hidden = false;
    });
    Array.prototype.forEach.call(document.querySelectorAll('tr[data-days]'), function (tr) {
      if (tr.getAttribute('data-days').split(',').indexOf(String(d)) !== -1) tr.classList.add('today');
    });
  } catch (e) { /* the chip is optional */ }

  /* mobile menu: close after a link, on Escape and on outside click */
  var menu = document.querySelector('.menu');
  if (menu) {
    Array.prototype.forEach.call(menu.querySelectorAll('a'), function (a) {
      a.addEventListener('click', function () { menu.open = false; });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary').focus(); }
    });
    document.addEventListener('click', function (e) {
      if (menu.open && !menu.contains(e.target)) menu.open = false;
    });
  }
})();
