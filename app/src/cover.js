// Draws the GTA-style cover: multi-panel poster, sunset/neon grade, bold caption.
export function drawPanelImage(ctx, img, x, pw, H, p) {
  const scale = Math.max(pw / img.naturalWidth, H / img.naturalHeight) * (p.zoom || 1);
  const iw = img.naturalWidth * scale;
  const ih = img.naturalHeight * scale;
  ctx.drawImage(img, x + pw / 2 - iw / 2 + (p.ox || 0), H / 2 - ih / 2 + (p.oy || 0), iw, ih);
}

export function drawCover(canvas, state) {
  const ctx = canvas.getContext('2d');
  const { width: W, height: H } = canvas;
  const panels = state.panels;
  const n = panels.length;

  // ---- Base: Vice City sunset/neon grade (sunset orange -> neon pink -> night purple) ----
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#ff8a50');
  sky.addColorStop(0.5, '#ff2e63');
  sky.addColorStop(1, '#14052a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  const gap = 8;
  const pw = (W - gap * (n - 1)) / n;
  let x = 0;
  for (let i = 0; i < n; i++) {
    const p = panels[i] || {};
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, 0, pw, H);
    ctx.clip();

    // panel base: deep night so an empty panel looks intentional, not blank
    ctx.fillStyle = 'rgba(12, 6, 30, 0.55)';
    ctx.fillRect(x, 0, pw, H);

    if (p.img) drawPanelImage(ctx, p.img, x, pw, H, p);

    // sunset/neon grade over the panel photo
    const g = ctx.createLinearGradient(x, 0, x, H);
    g.addColorStop(0, 'rgba(255, 140, 80, 0.32)');
    g.addColorStop(0.5, 'rgba(255, 40, 100, 0.24)');
    g.addColorStop(1, 'rgba(70, 20, 110, 0.45)');
    ctx.globalCompositeOperation = 'overlay';
    ctx.fillStyle = g;
    ctx.fillRect(x, 0, pw, H);
    // neon rim glow at the top of each panel
    const rim = ctx.createLinearGradient(x, 0, x, H * 0.14);
    rim.addColorStop(0, 'rgba(255, 255, 255, 0.38)');
    rim.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = rim;
    ctx.fillRect(x, 0, pw, H * 0.17);
    ctx.globalCompositeOperation = 'source-over';
    ctx.restore();

    // neon panel divider
    if (i < n - 1) {
      ctx.fillStyle = '#14052a';
      ctx.fillRect(x + pw, 0, 4, H);
      ctx.fillStyle = '#ff2e63';
      ctx.fillRect(x + pw + 4, 0, 2, H);
      ctx.fillStyle = 'rgba(255, 46, 99, 0.35)';
      ctx.fillRect(x + pw + 6, 0, 4, H);
    }
    x += pw + gap;
  }

  // ---- Cover-wide vignette ----
  const vig = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.4, W * 0.95);
  vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vig.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  // ---- Subtle scanlines for the retro neon-poster look ----
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  for (let y = 0; y < H; y += 5) ctx.fillRect(0, y, W, 1);

  // ---- Top-left brand tag ----
  ctx.fillStyle = '#ffffff';
  ctx.font = `400 ${Math.round(H * 0.045)}px Anton, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.shadowColor = 'rgba(255, 46, 99, 0.85)';
  ctx.shadowBlur = Math.round(H * 0.025);
  ctx.fillText('VICE CITY', W * 0.025, H * 0.025);

  // ---- Bold caption lettering ----
  const text = (state.caption || '').trim().toUpperCase();
  if (text) {
    let s = Math.round(H * 0.16);
    ctx.font = `400 ${s}px Anton, sans-serif`;
    while (ctx.measureText(text).width > W * 0.94 && s > 18) {
      s -= 2;
      ctx.font = `400 ${s}px Anton, sans-serif`;
    }
    const y = H * 0.87;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(255, 46, 99, 0.75)';
    ctx.shadowBlur = s * 0.35;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.lineWidth = s * 0.22;
    ctx.strokeText(text, W / 2, y);
    const tg = ctx.createLinearGradient(0, y - s * 0.9, 0, y + s * 0.3);
    tg.addColorStop(0, '#ffef9a');
    tg.addColorStop(0.45, '#ff9a3c');
    tg.addColorStop(1, '#ff2e63');
    ctx.fillStyle = tg;
    ctx.fillText(text, W / 2, y);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText(text, W / 2, y);
    ctx.shadowBlur = 0;
  }
}