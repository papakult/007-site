(() => {
  const list = document.getElementById("work-projects");
  if (!list) return;

  const page = list.closest(".work-page");
  const filters = page.querySelector(".work-filters");
  const buttons = Array.from(filters.querySelectorAll("button[data-choice]"));
  const cards = Array.from(list.querySelectorAll("[data-group]"));
  const status = filters.querySelector("[role=status]");

  function showGroup(group) {
    for (const button of buttons) {
      button.setAttribute("aria-pressed", String(button.dataset.choice === group));
    }
    let count = 0;
    for (const card of cards) {
      const matches = group === "all" || card.dataset.group === group;
      card.hidden = !matches;
      if (matches) count++;
    }
    status.textContent = "Показано проектов: " + count;
  }

  filters.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-choice]");
    if (button) showGroup(button.dataset.choice);
  });
  filters.hidden = false;
  page.dataset.ready = "";
})();
