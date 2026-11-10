'use strict';

const previewVideo = document.querySelector('#preview-video');
const previewMotion = document.querySelector('#preview-motion');
const landscapeVideo = document.querySelector('#landscape-video');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
let previewPaused = false;

function updatePreviewMotion() {
  previewMotion.textContent = previewVideo.paused ? 'Играть' : 'Пауза';
}

async function playPreview() {
  if (reduceMotion.matches || previewPaused) return;
  try {
    await previewVideo.play();
    previewMotion.hidden = false;
  } catch {
    previewMotion.hidden = true;
  }
}

const previewVisibility = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) void playPreview();
  else previewVideo.pause();
}, { threshold: .45 });
previewVisibility.observe(previewVideo);
reduceMotion.addEventListener('change', () => {
  if (reduceMotion.matches) {
    previewVideo.pause();
    previewMotion.hidden = true;
  } else {
    void playPreview();
  }
});
previewMotion.addEventListener('click', () => {
  previewPaused = !previewPaused;
  if (previewPaused) previewVideo.pause();
  else void playPreview();
});
previewVideo.addEventListener('play', updatePreviewMotion);
previewVideo.addEventListener('pause', updatePreviewMotion);
document.querySelector('.landscape-preview').addEventListener('click', () => {
  void landscapeVideo.play().catch(() => {});
});
