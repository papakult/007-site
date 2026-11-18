(() => {
  "use strict";

  const courses = [
    { id: "start", name: "С нуля", detail: "От первого знакомства с машиной до поездки в потоке." },
    { id: "city", name: "Мой маршрут", detail: "Отработать дорогу на работу, сложную развязку или въезд во двор." },
    { id: "return", name: "Снова за руль", detail: "Вспомнить габариты, парковку и перестроения после перерыва." }
  ];
  const days = [
    { id: "weekdays", name: "В будни" }, { id: "weekend", name: "В выходные" }, { id: "either", name: "В любые дни" }
  ];
  const times = [
    { id: "morning", name: "Утром", detail: "08:00–12:00" },
    { id: "afternoon", name: "Днём", detail: "12:00–17:00" },
    { id: "evening", name: "Вечером", detail: "17:00–21:00" }
  ];
  const icon = (path) => `<svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="${path}" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const arrow = icon("M4 12h15m-6-6 6 6-6 6");
  const closeIcon = icon("M6 6l12 12M18 6 6 18");
  const downloadIcon = icon("M12 3v12m-4-4 4 4 4-4M5 18v3h14v-3");

  function choice(group, item, index) {
    return `<label class="adb-choice">
      <input type="radio" name="${group}" value="${item.id}" ${index === 0 ? "checked" : ""}>
      <span class="adb-choice-inner">
        <span class="adb-choice-copy"><strong>${item.name}</strong>${item.detail ? `<small>${item.detail}</small>` : ""}</span>
        <span class="adb-dot" aria-hidden="true"></span>
      </span>
    </label>`;
  }

  function init() {
    const dialog = document.createElement("dialog");
    dialog.className = "adb-dialog";
    dialog.setAttribute("aria-labelledby", "adb-heading");
    dialog.innerHTML = `
      <div class="adb-body">
        <div class="adb-mast">
          <span class="adb-mast-label"><i aria-hidden="true"></i> Персональный план</span>
          <button type="button" class="adb-close" data-adb-close aria-label="Закрыть подбор занятий">${closeIcon}</button>
        </div>
        <div class="adb-progress"><span class="adb-stage"></span><span class="adb-track" aria-hidden="true"><i></i><i></i><i></i></span></div>
        <h2 id="adb-heading" class="adb-heading" tabindex="-1"></h2>
        <form class="adb-form">
          <div data-adb-panel="1">
            <fieldset class="adb-set adb-courses">
              <legend class="adb-visually-hidden">Выберите программу</legend>
              ${courses.map((item, i) => choice("course", item, i)).join("")}
            </fieldset>
          </div>
          <div data-adb-panel="2" hidden>
            <fieldset class="adb-set adb-options">
              <legend>Дни занятий</legend>
              ${days.map((item, i) => choice("day", item, i)).join("")}
            </fieldset>
            <fieldset class="adb-set adb-options">
              <legend>Время по Москве</legend>
              ${times.map((item, i) => choice("time", item, i)).join("")}
            </fieldset>
          </div>
          <div data-adb-panel="3" hidden>
            <dl class="adb-summary"></dl>
            <p class="adb-note">Это демонстрационный подбор. План можно сохранить себе. Время занятия он не бронирует.</p>
          </div>
          <div class="adb-actions">
            <button type="button" class="adb-back">Назад</button>
            <button type="submit" class="adb-next"></button>
          </div>
          <p class="adb-status" role="status"></p>
        </form>
      </div>`;
    document.body.appendChild(dialog);

    const form = dialog.querySelector("form");
    const title = dialog.querySelector("h2");
    const back = dialog.querySelector(".adb-back");
    const next = dialog.querySelector(".adb-next");
    const status = dialog.querySelector(".adb-status");
    let current = 1;
    let trigger;

    function selections() {
      return [
        ["Программа", courses.find((item) => item.id === form.elements.course.value).name],
        ["Дни занятий", days.find((item) => item.id === form.elements.day.value).name],
        ["Время по Москве", (() => {
          const time = times.find((item) => item.id === form.elements.time.value);
          return `${time.name}, ${time.detail}`;
        })()]
      ];
    }
    function showStep(step) {
      current = step;
      const steps = ["Чему хотите научиться?", "Когда вам удобно?", "Ваш план занятий"];
      title.textContent = steps[step - 1];
      dialog.querySelector(".adb-stage").textContent = `Шаг ${step} из 3`;
      dialog.querySelectorAll(".adb-track i").forEach((part, index) => {
        part.classList.toggle("adb-active", index < step);
      });
      dialog.querySelectorAll("[data-adb-panel]").forEach((panel) => {
        panel.hidden = Number(panel.dataset.adbPanel) !== step;
      });
      back.hidden = step === 1;
      next.innerHTML = step === 3 ? `Скачать план ${downloadIcon}` : `Продолжить ${arrow}`;
      status.textContent = "";
      if (step === 3) {
        dialog.querySelector(".adb-summary").innerHTML = selections()
          .map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("");
      }
      dialog.scrollTop = 0;
      title.focus({ preventScroll: true });
    }

    function open(courseId, opener) {
      if (dialog.open) return;
      trigger = opener;
      form.reset();
      const course = courses.find((item) => item.id === courseId);
      if (course) form.elements.course.value = course.id;
      dialog.showModal();
      document.documentElement.classList.add("adb-modal-open");
      showStep(1);
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (current < 3) {
        showStep(current + 1);
        return;
      }
      const content = ["ATELIER DRIVE", "Персональный план занятий", "", ...selections().map(([k, v]) => `${k} — ${v}`), "",
        "План составлен в демонстрационной версии сайта. Он не подтверждает бронирование."].join("\r\n");
      const url = URL.createObjectURL(new Blob(["\uFEFF", content], { type: "text/plain;charset=utf-8" }));
      const link = document.createElement("a");
      link.download = "atelier-drive-plan.txt";
      link.href = url;
      dialog.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 15000);
      status.textContent = "Файл с планом подготовлен.";
    });
    back.addEventListener("click", () => showStep(current - 1));
    dialog.querySelector("[data-adb-close]").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    dialog.addEventListener("close", () => {
      document.documentElement.classList.remove("adb-modal-open");
      if (trigger && trigger.isConnected) trigger.focus({ preventScroll: true });
    });
    document.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      const opener = event.target.closest("[data-book]");
      if (!opener) return;
      event.preventDefault();
      open(opener.dataset.book, opener);
    });
    const query = new URLSearchParams(location.search);
    if (query.get("book") === "1") open(query.get("course"), null);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
