import { drawCover } from './cover.js';

const canvas = document.getElementById('cover');
const caption = document.getElementById('caption');
const status = document.getElementById('status');
const sizeSel = document.getElementById('size');
const panelsSel = document.getElementById('panels');
const activeSel = document.getElementById('active');
const photosInput = document.getElementById('photos');
const exportBtn = document.getElementById('export');

let photos = [];
let panels = [];
let active = 0;
let dragging = false;
let dragStart = null;

function rebuildPanels(n) {
  const old = panels;
  panels = [];
  for (let i = 0; i < n; i++) panels.push(old[i] || { img: null, zoom: 1, ox: 0, oy: 0, photoIdx: -1 });
  panels.length = n;
  if (active >= n) active = Math.max(n - 1, 0);
  refreshActive();
  redraw();
}

function refreshActive() {
  activeSel.innerHTML = '';
  for (let i = 0; i < panels.length; i++) {
    const o = document.createElement('option');
    o.value = i;
    o.textContent = 'Panel ' + (i + 1);
    activeSel.appendChild(o);
  }
  activeSel.value = active;
}

function state() { return { panels, caption: caption.value }; }

function resizeCanvas() {
  const [w, h] = sizeSel.value.split('x').map(Number);
  canvas.width = w;
  canvas.height = h;
  redraw();
}

function redraw() { drawCover(canvas, state()); }

function assignPhotoToActive(idx) {
  panels[active].photoIdx = idx;
  panels[active].img = idx >= 0 ? photos[idx].img : null;
  panels[active].ox = 0; panels[active].oy = 0; panels[active].zoom = 1;
  redraw();
}

photosInput.addEventListener('change', async (e) => {
  const files = Array.from(e.target.files);
  for (const f of files) {
    const img = await loadImage(URL.createObjectURL(f));
    photos.push({ name: f.name, img });
  }
  if (photos.length && panels[0].img === null) assignPhotoToActive(0);
  redraw();
  status.textContent = photos.length + ' photo(s) loaded';
});

panelsSel.addEventListener('change', () => { rebuildPanels(Number(panelsSel.value)); });
sizeSel.addEventListener('change', resizeCanvas);
caption.addEventListener('input', redraw);
activeSel.addEventListener('change', () => { active = Number(activeSel.value); });

canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (canvas.width / rect.width);
  const w = canvas.width / panels.length;
  const idx = Math.min(panels.length - 1, Math.floor(x / w));
  active = idx;
  activeSel.value = active;
  dragging = true;
  dragStart = { x: e.clientX, y: e.clientY, ox: panels[active].ox, oy: panels[active].oy };
});
window.addEventListener('mousemove', (e) => {
  if (!dragging) return;
  const rect = canvas.getBoundingClientRect();
  const sx = canvas.width / rect.width;
  const sy = canvas.height / rect.height;
  panels[active].ox = dragStart.ox + (e.clientX - dragStart.x) * sx;
  panels[active].oy = dragStart.oy + (e.clientY - dragStart.y) * sy;
  redraw();
});
window.addEventListener('mouseup', () => { dragging = false; });

window.addEventListener('keydown', (e) => {
  const k = Number(e.key);
  if (k >= 1 && k <= 9 && k - 1 < photos.length) {
    assignPhotoToActive(k - 1);
    status.textContent = 'Assigned photo ' + k + ' to panel ' + (active + 1);
  }
});

exportBtn.addEventListener('click', () => {
  const [w, h] = sizeSel.value.split('x').map(Number);
  const tmp = document.createElement('canvas');
  tmp.width = w; tmp.height = h;
  drawCover(tmp, state());
  tmp.toBlob((blob) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `cover-${w}x${h}.png`;
    a.click();
    status.textContent = 'Saved cover-' + w + 'x' + h + '.png';
  }, 'image/png');
});

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

rebuildPanels(3);
resizeCanvas();
