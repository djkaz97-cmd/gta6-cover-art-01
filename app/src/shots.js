// Shot helpers used while recording screenshots: load a sample photo and caption,
// then mark the page ready once two frames have painted.
export async function runShot(shot, query, load) {
  if (shot === 'cover') document.body.classList.add('shot-cover');
  await load(`samples/${query.get('photo') ?? 'pier'}.jpg`, query.get('caption') ?? 'Sunset Heist');
  requestAnimationFrame(() => requestAnimationFrame(() => { window.__shotReady = true; }));
}
