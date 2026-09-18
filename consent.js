/* Consent Mode v2 + aviso de cookies.
   Cargar de forma síncrona en <head> ANTES de AdSense y de gtag.js.
   Si no hay elección, el banner se crea en document.body (no depende del CSS de la página). */
(function () {
  var GA_ID = 'G-854J0T42H0';
  var KEY = 'cc_consent';
  var DAYS = 180;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  function granted() {
    return {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted'
    };
  }
  function denied() {
    return {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied'
    };
  }

  function readConsent() {
    try {
      var m = document.cookie.match(/(?:^|; )cc_consent=([^;]*)/);
      if (m) {
        var cv = decodeURIComponent(m[1]);
        if (cv === 'accepted' || cv === 'rejected') return cv;
      }
    } catch (e) {}
    try {
      var ls = localStorage.getItem(KEY);
      if (ls === 'accepted' || ls === 'rejected') {
        writeConsent(ls);
        return ls;
      }
    } catch (e2) {}
    return null;
  }

  function writeConsent(v) {
    try {
      var exp = new Date(Date.now() + DAYS * 864e5).toUTCString();
      document.cookie = KEY + '=' + encodeURIComponent(v) + '; path=/; expires=' + exp + '; SameSite=Lax';
    } catch (e) {}
    try { localStorage.setItem(KEY, v); } catch (e2) {}
  }

  function apply(v) {
    window.gtag('consent', 'update', v === 'accepted' ? granted() : denied());
  }

  function loadAnalytics() {
    if (window._gaLoaded) return;
    window._gaLoaded = true;
    var s = document.createElement('script');
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    s.async = true;
    (document.head || document.documentElement).appendChild(s);
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
  }

  var stored = readConsent();
  if (stored) {
    apply(stored);
    if (stored === 'accepted') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAnalytics);
      } else {
        loadAnalytics();
      }
    }
  }

  function css() {
    return [
      '#cc-banner{position:fixed;left:0;right:0;bottom:0;z-index:2147483000;background:#1a1814;color:#f2f0eb;padding:1.15rem 1.35rem 1.25rem;font-family:DM Sans,system-ui,sans-serif;box-shadow:0 -8px 28px rgba(0,0,0,.22)}',
      '#cc-banner .cc-inner{max-width:920px;margin:0 auto}',
      '#cc-banner .cc-title{font-size:1.02rem;font-weight:500;margin:0 0 .35rem;color:#fff}',
      '#cc-banner .cc-desc{font-size:.84rem;line-height:1.55;font-weight:300;color:#c8c4bc;margin:0 0 1rem}',
      '#cc-banner .cc-desc a{color:#7fc4a0;text-underline-offset:2px}',
      '#cc-banner .cc-actions{display:flex;flex-wrap:wrap;gap:.55rem}',
      '#cc-banner .cc-btn{font-family:inherit;font-size:.88rem;font-weight:500;padding:.65rem 1.15rem;border-radius:8px;cursor:pointer;border:1.5px solid transparent;flex:1;min-width:140px}',
      '#cc-banner .cc-reject{background:transparent;color:#f2f0eb;border-color:#5a5850}',
      '#cc-banner .cc-reject:hover{border-color:#a8a6a0}',
      '#cc-banner .cc-accept{background:#1a6b4a;color:#fff}',
      '#cc-banner .cc-accept:hover{opacity:.92}',
      'body.cc-open{padding-bottom:9rem}',
      '@media(max-width:560px){#cc-banner .cc-btn{flex:1 1 100%;min-width:0}}'
    ].join('');
  }

  function injectStyle() {
    if (document.getElementById('cc-banner-css')) return;
    var s = document.createElement('style');
    s.id = 'cc-banner-css';
    s.textContent = css();
    (document.head || document.documentElement).appendChild(s);
  }

  function hideBanner() {
    var b = document.getElementById('cc-banner');
    if (b) b.parentNode.removeChild(b);
    if (document.body) document.body.classList.remove('cc-open');
  }

  function openBanner() {
    if (document.getElementById('cc-banner') || !document.body) return;
    injectStyle();
    var bar = document.createElement('div');
    bar.id = 'cc-banner';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Aviso de cookies');
    bar.innerHTML =
      '<div class="cc-inner">' +
      '<p class="cc-title">Usamos cookies</p>' +
      '<p class="cc-desc">Google Analytics y Google AdSense solo se activan si las aceptas. ' +
      '<a href="/privacidad/">Más información</a>.</p>' +
      '<div class="cc-actions">' +
      '<button type="button" class="cc-btn cc-reject" id="cc-reject">Solo necesarias</button>' +
      '<button type="button" class="cc-btn cc-accept" id="cc-accept">Aceptar todas</button>' +
      '</div></div>';
    document.body.appendChild(bar);
    document.body.classList.add('cc-open');
    document.getElementById('cc-reject').addEventListener('click', function () {
      writeConsent('rejected');
      apply('rejected');
      hideBanner();
    });
    document.getElementById('cc-accept').addEventListener('click', function () {
      writeConsent('accepted');
      apply('accepted');
      loadAnalytics();
      hideBanner();
    });
  }

  window.cookieOpen = function () {
    hideBanner();
    openBanner();
  };

  function boot() {
    injectStyle();
    if (!readConsent()) openBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
