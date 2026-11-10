'use strict';

const openHotelTour = (() => {
  const tourAssets = new URL('.', document.currentScript.src);
  const detail = document.querySelector('#room-detail');
  const viewport = document.querySelector('#detail-panorama');
  const fallback = document.querySelector('#detail-image');
  const help = document.querySelector('#look-help');
  const hotspot = document.querySelector('#tour-door');
  const controls = document.querySelector('.tour-controls');
  const tabs = [...document.querySelectorAll('[data-scene]')];
  const book = document.querySelector('#book-detail');
  const stageLabel = document.querySelector('#tour-stage-label');
  const scenes = [
    { name: 'Комната', destination: 'В санузел' },
    { name: 'Санузел', destination: 'В комнату' },
  ];
  const doorLocations = {
    '03': [[.194, .515], [.754, .52]],
    '05': [[.10, .515], [.13, .51]],
    '07': [[.772, .53], [.725, .53]],
  };
  const partialPanorama = {
    fullWidth: 2880, fullHeight: 1440,
    croppedWidth: 1774, croppedHeight: 887, croppedX: 553, croppedY: 276,
  };
  const scripts = new Map();
  const home = { yaw: 0, pitch: -.06 };
  const zoom = 25;
  let room;
  let viewer;
  let scene = 0;
  let request = 0;
  let marker;
  let sceneReady = false;

  function loadScript(file) {
    if (!scripts.has(file)) {
      const loaded = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = new URL(file + '?v=2', tourAssets);
        script.onload = resolve;
        script.onerror = reject;
        document.head.append(script);
      });
      scripts.set(file, loaded);
      loaded.catch(() => scripts.delete(file));
    }
    return scripts.get(file);
  }

  function positionHotspot() {
    if (!marker || !viewer || !viewer.dataHelper.isPointVisible(marker)) {
      hotspot.hidden = true;
      return;
    }
    const { x, y } = viewer.dataHelper.sphericalCoordsToViewerCoords(marker);
    const bounds = viewport.getBoundingClientRect();
    hotspot.hidden = x < 57 || x > bounds.width - 57 || y < 30 || y > bounds.height - 39;
    hotspot.style.left = x + 'px';
    hotspot.style.top = y + 'px';
  }

  async function showScene(index) {
    if (!room || (sceneReady && scene === index)) return;
    const key = ++request;
    const selectedRoom = room;
    const selectedScene = scenes[index];
    const previousScene = scene;
    const canTransition = sceneReady && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    scene = index;
    sceneReady = false;
    marker = undefined;
    hotspot.hidden = true;
    stageLabel.textContent = '0' + (index + 1) + ' / ' + selectedScene.name;
    tabs.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    help.textContent = 'Загружаем панораму…';
    let pictures;
    try {
      await Promise.all([loadScript('panorama.js'), loadScript('panoramas-' + selectedRoom.id + '.js')]);
      if (key !== request || !detail.open) return;
      pictures = window.HotelRoomPanoramas[selectedRoom.id];
      const { Viewer, VisibleRangePlugin } = window.HotelPanorama;
      viewport.hidden = false;
      if (!viewer) {
        viewer = new Viewer({
          container: viewport,
          navbar: false,
          keyboard: 'fullscreen',
          defaultZoomLvl: zoom,
          plugins: [VisibleRangePlugin.withConfig({
            usePanoData: true, verticalRange: ['-65deg', '68deg'],
          })],
        });
        for (const event of ['position-updated', 'zoom-updated', 'size-updated', 'render']) {
          viewer.addEventListener(event, positionHotspot);
        }
      }
      const loaded = await viewer.setPanorama(pictures[index], {
        panoData: selectedRoom.id === '05' ? partialPanorama : undefined,
        transition: canTransition ? { effect: 'fade', speed: 520 } : false,
        position: home, zoom,
      });
      if (key !== request || !detail.open || !loaded) return;
      const [x, y] = doorLocations[selectedRoom.id][index];
      marker = viewer.dataHelper.textureCoordsToSphericalCoords({
        textureX: Math.round(1774 * x), textureY: Math.round(887 * y),
      });
      fallback.hidden = true;
      controls.hidden = false;
      sceneReady = true;
      hotspot.textContent = selectedScene.destination;
      positionHotspot();
      help.textContent = 'Потяните панораму, чтобы осмотреться. Нажмите на метку у двери или выберите сцену.';
    } catch {
      if (key !== request || !detail.open) return;
      viewer?.destroy();
      viewer = undefined;
      viewport.hidden = true;
      controls.hidden = true;
      if (pictures?.[index]) {
        fallback.src = pictures[index];
        fallback.alt = selectedScene.name + ', ' + selectedRoom.name;
        fallback.hidden = false;
        help.textContent = 'В этом браузере доступен статичный вид. Сцены можно переключать.';
      } else {
        help.textContent = 'Сцена не загрузилась. Нажмите на ее название, чтобы попробовать снова.';
        scene = previousScene;
      }
    }
  }

  function turn(amount) {
    if (!viewer || !sceneReady) return;
    const { yaw, pitch } = viewer.getPosition();
    viewer.rotate({ yaw: yaw + amount, pitch });
  }

  tabs.forEach(button => button.addEventListener('click', () => { void showScene(Number(button.dataset.scene)); }));
  hotspot.addEventListener('click', () => { void showScene(1 - scene); });
  document.querySelector('#look-left').addEventListener('click', () => turn(-.44));
  document.querySelector('#look-right').addEventListener('click', () => turn(.44));
  document.querySelector('#look-reset').addEventListener('click', () => {
    if (!viewer || !sceneReady) return;
    viewer.rotate(home);
    viewer.zoom(zoom);
  });
  viewport.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      turn(event.key === 'ArrowLeft' ? -.2 : .2);
    }
  });
  detail.addEventListener('close', () => {
    if (detail.open) return;
    request++;
    marker = undefined;
    sceneReady = false;
    viewer?.destroy();
    viewer = undefined;
    viewport.hidden = true;
    fallback.removeAttribute('src');
  });

  return (selectedRoom, actionLabel, onBook) => {
    room = selectedRoom;
    document.querySelector('#detail-title').textContent = room.name;
    document.querySelector('#detail-meta').textContent = 'Номер ' + room.id + ' · ' + room.size + ' м²';
    document.querySelector('#detail-description').textContent = room.description;
    book.textContent = actionLabel;
    book.onclick = () => {
      detail.close();
      onBook();
    };
    fallback.src = new URL(room.cover, tourAssets);
    fallback.alt = room.alt;
    fallback.hidden = false;
    controls.hidden = true;
    hotspot.hidden = true;
    detail.showModal();
    void showScene(0);
  };
})();
