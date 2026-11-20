// Lightweight moving artwork for browsers that cannot create a WebGL context.
const tau = 2 * Math.PI;

function fog(ctx, w, h, t) {
  ctx.fillStyle = '#95616a';
  ctx.fillRect(0, 0, w, h);
  const colors = ['#ffca85', '#883b57', '#f2a685'];
  colors.forEach((color, i) => {
    const phase = t * .48 + i * 2;
    const x = w * (.5 + Math.cos(phase) * .43);
    const y = h * (.5 + Math.sin(phase * .86) * .44);
    const bloom = ctx.createRadialGradient(x, y, 0, x, y, Math.max(w, h) * .72);
    bloom.addColorStop(0, color);
    bloom.addColorStop(1, color + '00');
    ctx.fillStyle = bloom;
    ctx.fillRect(0, 0, w, h);
  });
}

function mesh(ctx, w, h, t, silk) {
  ctx.fillStyle = silk ? '#672f40' : '#30202b';
  ctx.fillRect(0, 0, w, h);
  const nx = silk ? 18 : 9, ny = silk ? 12 : 6;
  const dx = w / nx, dy = h / ny;
  const field = (c, r) => Math.sin(c * .52 + r * .63 - t) * .65 + Math.cos(c * .34 - r * .52 + t * .58) * .35;
  const point = (c, r) => [dx * (c + .34 * Math.sin(r * .74 + t * .4)), dy * (r + .65 * field(c, r))];
  for (let r = -1; r <= ny; r++) {
    for (let c = -1; c <= nx; c++) {
      const a = point(c, r), b = point(c + 1, r), d = point(c, r + 1);
      ctx.lineWidth = .6;
      function triangle(p, q, s, shade) {
        ctx.beginPath();
        ctx.moveTo(...p); ctx.lineTo(...q); ctx.lineTo(...s); ctx.closePath();
        if (silk) {
          ctx.fillStyle = ctx.strokeStyle = 'hsl(346 37% ' + shade + '%)';
          ctx.fill();
        } else {ctx.strokeStyle = 'rgba(215,152,140,.48)';}
        ctx.stroke();
      }
      const shade = 32 + 13 * field(c, r);
      triangle(a, b, d, shade);
      if (silk) triangle(b, point(c + 1, r + 1), d, shade + 2);
      else {
        ctx.beginPath();ctx.arc(...a, 1.7, 0, tau);ctx.fillStyle='#f1ba9f';ctx.fill();
      }
    }
  }
}

export function paintSurface(el) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};
  const name = el.dataset.light;
  el.append(canvas);
  el.dataset.rendered = name + '-2d';
  canvas.style.cssText = 'width:100%;height:100%';
  const resize = () => {
    canvas.width = Math.min(760, Math.max(1, el.clientWidth));
    canvas.height = Math.max(1, Math.round(canvas.width * el.clientHeight / Math.max(1, el.clientWidth)));
  };
  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(el);
  let timer;
  const begin = performance.now();
  const draw = () => {
    const t = (performance.now() - begin) * .00055;
    if (name === 'fog') fog(ctx, canvas.width, canvas.height, t);
    else mesh(ctx, canvas.width, canvas.height, t, name === 'waves');
    timer = setTimeout(draw, 75);
  };
  draw();
  return () => {clearTimeout(timer);observer.disconnect();canvas.remove();delete el.dataset.rendered;};
}
