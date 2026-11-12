/* Contact form handler — posts to Google Apps Script endpoint */
(function () {
  'use strict';

  // Deployed Apps Script Web app URL (does: Sheet append + email alert)
  var ENDPOINT =
    'https://script.google.com/macros/s/AKfycbwA7GM2Xp717bFHnpyU0BY_vbSvZtmQIqC26DaQAmtlv3DJkaD1RuDqgiXDDRReP3zMSQ/exec';

  var form = document.querySelector('.fe-form');
  if (!form) return;

  var btn = form.querySelector('button[type="submit"]');
  var originalBtnText = btn ? btn.textContent : '';

  function field(n) {
    return form.querySelector('[name="' + n + '"]') || {};
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var payload = {
      name: field('name').value || '',
      email: field('email').value || '',
      message: field('message').value || ''
    };

    if (!payload.name || !payload.email || !payload.message) {
      alert('Please fill in all fields.');
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Sending…';
    }

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.text().then(function (text) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          try {
            var json = JSON.parse(text);
            if (json && json.ok === false) throw new Error(json.error || 'Server rejected');
          } catch (e) {
            if (e instanceof SyntaxError) return; // non-JSON, assume ok
            throw e;
          }
          form.reset();
          alert('Message sent! Thanks — I will get back to you.');
        });
      })
      .catch(function (err) {
        console.error('Contact form error:', err);
        alert('Something went wrong. Please try again.');
      })
      .then(function () {
        if (btn) {
          btn.disabled = false;
          btn.textContent = originalBtnText;
        }
      });
  });
})();
