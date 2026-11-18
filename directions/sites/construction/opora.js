"use strict";
const cover = document.querySelector(".hero");
if (cover) {
  const buttons = [...cover.querySelectorAll("[data-pick]")];
  const scenes = [...cover.querySelectorAll("[data-scene]")];
  cover.querySelector(".scene-choices").hidden = false;
  for (const [index, button] of buttons.entries()) {
    button.addEventListener("click", () => {
      scenes.forEach((scene, n) => { scene.hidden = n !== index; });
      buttons.forEach((item, n) => item.setAttribute("aria-pressed", String(n === index)));
    });
  }
}
const menu = document.querySelector(".mobile-menu");
if (menu) {
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu.open) {
      menu.open = false;
      menu.querySelector("summary").focus();
    }
  });
  document.addEventListener("pointerdown", event => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
}
