// Draws the GTA-style cover: multi-panel poster, sunset/neon grade, bold caption.
export function drawCover(canvas, state) {
  const ctx = canvas.getContext('2d');
  const { width: W, height: H } = canvas;
  const panels = state.panels;
  const n = panels.length;
  const widths = [];
  const base = Math.floor(W / n);
  for (let i = 0; i < n; i++) widths.push(i === n - 1 ? W - base * (n - 1) : base);

  ctx.fillStyle = '#1a0b2e';
  ctx.fillRect(0, 0, W, H);

  let x = 0;
  for (let i = 0; i < n; i++) {
    const w = widths[i];
    const p = panels[i];
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, 0, w, H);
    ctx.clip();
    if (p && p.img) {
      const img = p.img;
      const scale = Math.max(w / img.naturalWidth, H / img.naturalHeight) * (p.zoom || 1);
      const pw = img.naturalWidth * scale;
      const ph = img.naturalHeight * scale;
      const cx = x + w / 2 + (p.ox || 0);
      const cy = H / 2 + (p.oy || 0);
      ctx.drawImage(img, cx - pw / 2, cy - ph / 2, pw, ph);
    } else {
      const g = ctx.createLinearGradient(x, 0, x + w, H);
      g.addColorStop(0, '#ff5e3a');
      g.addColorStop(1, '#7b2ff7');
      ctx.fillStyle = g;
      ctx.fillRect(x, 0, w, H);
    }
    const grade = ctx.createLinearGradient(x, H * 0.4, x, H);
    grade.addColorStop(0, 'rgba(255,140,60,0)');
    grade.addColorStop(0.6, 'rgba(255,80,120,0.25)');
    grade.addColorStop(1, 'rgba(40,10,80,0.7)');
    ctx.fillStyle = grade;
    ctx.fillRect(x, 0, w, H);
    const vig = ctx.createLinearGradient(x, 0, x + w, 0);
    vig.addColorStop(0, 'rgba(0,0,0,0.35)');
    vig.addColorStop(0.5, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(0,0,0,0.35)');
    ctx.fillStyle = vig;
    ctx.fillRect(x, 0, w, H);
    ctx.restore();
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(x + w - 2, 0, 2, H);
    x += w;
  }

  const wash = ctx.createLinearGradient(0, 0, 0, H);
  wash.addColorStop(0, 'rgba(255,180,80,0.18)');
  wash.addColorStop(0.5, 'rgba(255,90,140,0.12)');
  wash.addColorStop(1, 'rgba(20,5,60,0.35)');
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, W, H);

  const text = (state.caption || '').trim().toUpperCase();
  if (text) {
    let s = Math.round(H * 0.11);
    ctx.font = `400 ${s}px Anton, sans-serif`;
    while (ctx.measureText(text).width > W * 0.92 && s > 14) {
      s -= 2;
      ctx.font = `400 ${s}px Anton, sans-serif`;
    }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    const y = H - H * 0.05;
    ctx.lineWidth = Math.max(2, s * 0.06);
    ctx.strokeStyle = 'rgba(0,0,0,0.85)';
    ctx.strokeText(text, W / 2, y);
    const tg = ctx.createLinearGradient(0, y - s, 0, y);
    tg.addColorStop(0, '#fff7c2');
    tg.addColorStop(0.5, '#ff9a3c');
    tg.addColorStop(1, '#ff3d7f');
    ctx.fillStyle = tg;
    ctx.fillText(text, W / 2, y);
    ctx.shadowColor = 'rgba(255,60,120,0.6)';
    ctx.shadowBlur = s * 0.25;
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fillText(text, W / 2, y);
    ctx.shadowBlur = 0;
  }

  ctx.font = `400 ${Math.round(H * 0.035)}px Anton, sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('VICE CITY', W * 0.03, H * 0.03);
}