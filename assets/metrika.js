(() => {
  const counterId = 111869181;
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
