/* Nav active state — moves .is-active on click, before navigation. */
(function () {
  'use strict';

  var NAV_SELECTOR = '[data-fe-nav]';
  var LINK_SELECTOR = 'a[href]';
  var ACTIVE_CLASS = 'is-active';

  function shouldHandle(anchor) {
    if (!anchor || anchor.hasAttribute('download')) return false;
    if ((anchor.getAttribute('target') || '_self') !== '_self') return false;

    var href = anchor.getAttribute('href');
    if (!href || href.charAt(0) === '#') return false;

    // External / absolute-URL links are skipped.
    if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return false;

    return true;
  }

  function setActive(anchor) {
    var navs = document.querySelectorAll(NAV_SELECTOR);
    navs.forEach(function (nav) {
      var links = nav.querySelectorAll('.' + ACTIVE_CLASS);
      links.forEach(function (link) {
        link.classList.remove(ACTIVE_CLASS);
      });
      var match = nav.querySelector('a[href="' + anchor.getAttribute('href') + '"]');
      if (match) match.classList.add(ACTIVE_CLASS);
    });
  }

  function currentPath() {
    var path = window.location.pathname || '';
    // Normalize: strip trailing slash and leading directory so bare filenames match.
    path = path.replace(/\\/g, '/');
    path = path.replace(/\/+$/, '');
    if (path === '') path = '/';
    return path;
  }

  function pathMatches(href) {
    if (!href) return false;
    var current = currentPath();
    // Compare by filename so the site works from any subdirectory.
    var currentFile = current.split('/').pop();
    var hrefPath = href.split('#')[0].split('?')[0];
    if (hrefPath === '' || hrefPath.charAt(0) === '#') return false;
    hrefPath = hrefPath.replace(/\\/g, '/').replace(/\/+$/, '');
    var hrefFile = hrefPath.split('/').pop();
    if (currentFile === hrefFile) return true;
    // Treat a directory-style href ("/") as the index file.
    if ((hrefPath === '/' || hrefPath === '') && (currentFile === '' || currentFile === 'index.html')) {
      return true;
    }
    return false;
  }

  function initActiveFromLocation() {
    // Resolve per nav set (desktop + mobile) so every copy highlights correctly.
    var navs = document.querySelectorAll(NAV_SELECTOR);
    for (var n = 0; n < navs.length; n++) {
      var nav = navs[n];
      var links = nav.querySelectorAll('a');
      var match = null;
      for (var i = 0; i < links.length; i++) {
        if (pathMatches(links[i].getAttribute('href'))) {
          match = links[i];
          break;
        }
      }
      // No match (e.g. case-study pages): mark Projects as active since case studies
      // belong to the Projects section.
      if (!match) {
        if (/case-study/.test(window.location.pathname)) {
          match = nav.querySelector('a[href="projects.html"]');
        } else {
          continue;
        }
      }
      // Clear any hardcoded stale state before applying the resolved one.
      var active = nav.querySelectorAll('a.is-active');
      for (var j = 0; j < active.length; j++) {
        active[j].classList.remove(ACTIVE_CLASS);
      }
      match.classList.add(ACTIVE_CLASS);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initActiveFromLocation);
  } else {
    initActiveFromLocation();
  }

  document.addEventListener('click', function (event) {
    var anchor = event.target.closest('a');
    if (!anchor) return;
    if (!anchor.closest(NAV_SELECTOR)) return;
    if (!shouldHandle(anchor)) return;
    setActive(anchor);
  });
})();
