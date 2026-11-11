(() => {
  const counterId = 111869181;
  const exclusionKey = '007a_analytics_excluded';
  const url = new URL(window.location.href);
  const preference = url.searchParams.get('analytics');
  let excluded = false;

  try {
    excluded = window.localStorage.getItem(exclusionKey) === '1';
  } catch (_) {}
  excluded = excluded || document.cookie.split(';').some((item) => item.trim() === exclusionKey + '=1');

  if (preference === 'off' || preference === 'on') {
    excluded = preference === 'off';
    try {
      if (excluded) window.localStorage.setItem(exclusionKey, '1');
      else window.localStorage.removeItem(exclusionKey);
    } catch (_) {}
    document.cookie = exclusionKey + '=' + (excluded ? '1' : '') +
      '; Path=/; Max-Age=' + (excluded ? '31536000' : '0') + '; SameSite=Lax; Secure';
  }

  if (preference === 'off' || preference === 'on' || preference === 'status') {
    url.searchParams.delete('analytics');
    try {
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
    } catch (_) {}

    const status = document.createElement('div');
    status.setAttribute('role', 'status');
    status.setAttribute('data-analytics-status', excluded ? 'excluded' : 'included');
    status.textContent = excluded
      ? 'Посещения этого браузера не учитываются в статистике 007-A.'
      : 'Учет посещений этого браузера включен.';
    status.style.cssText = 'position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483647;max-width:560px;margin:auto;padding:16px 20px;border:1px solid #c9aa68;border-radius:8px;background:#181818;color:#fff;font:16px/1.5 system-ui,sans-serif;box-shadow:0 4px 24px #0006;';
    document.body.append(status);
    window.setTimeout(() => status.remove(), 10000);
  }

  const production = /^(www\.)?007-a\.ru$/i.test(window.location.hostname);
  if (excluded || window.navigator.webdriver === true || !production || url.pathname.startsWith('/preview/')) {
    window.ym = function () {};
    return;
  }

  const script = document.createElement('script');
  window.ym = window.ym || function () {
    (window.ym.a = window.ym.a || []).push(arguments);
  };
  window.ym.l = Date.now();

  script.async = true;
  script.src = 'https://mc.yandex.ru/metrika/tag.js';
  document.head.append(script);

  window.ym(counterId, 'init', {
    clickmap: false,
    trackLinks: false,
    webvisor: false,
    disableYtm: true,
  });
})();
