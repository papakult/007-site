(() => {
  const atlas = document.querySelector('.atlas');
  if (!atlas) return;

  const rows = [...atlas.querySelectorAll('.atlas-entry')];
  const picture = atlas.querySelector('.atlas-photo');
  const caption = atlas.querySelector('figcaption');
  const wide = matchMedia('(min-width:901px)');
  const hover = matchMedia('(hover:hover) and (pointer:fine)');
  let intended = rows[0];
  let pictured = rows[0];

  function preview(row) {
    if (!wide.matches || row === intended) return;
    intended = row;
    if (row === pictured) return;

    const next = new Image();
    next.alt = row.dataset.alt;
    next.width = 1536;
    next.height = 1024;
    next.onload = () => {
      if (!wide.matches || intended !== row) return;
      picture.replaceChildren(next);
      caption.querySelector('strong').textContent = row.querySelector('.atlas-name').textContent;
      caption.querySelector('span').textContent = row.querySelector('.atlas-unit').textContent;
      pictured.classList.remove('is-pictured');
      row.classList.add('is-pictured');
      pictured = row;
    };
    next.onerror = () => {if (intended === row) intended = pictured;};
    next.src = row.dataset.photo;
  }

  function syncWidth() {
    intended = pictured;
    pictured.classList.toggle('is-pictured',wide.matches);
  }

  rows.forEach(row => {
    row.addEventListener('pointerenter',event => {
      if (hover.matches && event.pointerType !== 'touch') preview(row);
    });
    row.addEventListener('focus',() => preview(row));
  });
  wide.addEventListener('change',syncWidth);
  syncWidth();
})();
