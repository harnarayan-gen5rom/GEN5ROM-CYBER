# Dragon Forge V3 — Cinematic model-based redesign

This version is an entirely new rendering implementation for **GEN5ROM-CYBER only**. The original GEN5ROM repository was not modified.

## Why a third version?

The earlier Three.js procedural dragon looked like a stack of primitives even after adding spline curves, fake scales and effects. Increasing polygon counts or bloom on a weak silhouette does not solve the problem. V3 removes that renderer from the website and loads a complete sculpted creature in GLB format, with physically based material maps.

## Assets and license

1. Primary high-detail Dragon GLB is discovered through [Grab3D's public model API](https://grab3d.com/developers/) at `https://grab3d.com/api/v1/models/dragon.json`. The site requests the published *light* GLB variant, which Grab3D describes as ~400k triangles with 1K PBR maps. The model is CC0 (public domain).
2. If that API or model cannot be loaded, the site loads a much smaller [CC0 Western Dragon Standing Alert](https://3dassets.dev/assets/dragons-and-wyverns-western-dragon-standing-alert-2e73a611) at the exact CDN URL `https://cdn.3dassets.dev/assets/36697/v1/model.glb` (~4.1k triangles). The lightweight model is a low-poly fallback and **will not look photorealistic**.
3. The lightweight fallback can also optionally load a distinct [CC0 Roaring Pose](https://3dassets.dev/assets/dragons-and-wyverns-western-dragon-roaring-c8c275ce) at `https://cdn.3dassets.dev/assets/36702/v1/model.glb`.

Models load from the sources above on the visitor's device. They are **not hosted inside this repository**. Network access and cross-origin download permissions are required. The publisher's stated API/CORS availability was not verified in a real browser in this development environment.

## Interaction and visual design

- Fully orbitable perspective camera with damped drag and scroll zoom
- Hover recognition for the sculpted dragon silhouette
- Click/press F for 3D fire, sparks, glows and shockwave
- Press R for a roar (alternate pose only when the lightweight backup loads)
- Press SPACE / click Berserk to change cinematic accent lighting
- Cinematic four-light studio, soft cast shadows, basalt stage, ember haze
- New charcoal / copper hierarchy and typography with mobile layouts
- Starts on explicit interaction to avoid downloading a large 3D asset on every page view
- Pauses GPU rendering when outside the viewport

**Limitation:** Both referenced dragon models are static GLBs, not rigs. This implementation does **not** offer anatomically smooth jaw/wing/tail articulation or a true dragon breath animation. It animates camera, object movement and VFX. For production-grade natural motion, the next step is a skinned animation-ready GLB with real bones and animation clips.

## Verification

- GitHub source structure, JavaScript parser and HTML ID wiring checked.
- True online CDN loading, WebGL visuals, shadow balance and mobile FPS could not be visually tested in the local environment.
- Full manual browser acceptance recommended after GitHub Pages deployment.

## Files

- `assets/dragon-v3.js` — new Three.js WebGL experience
- `assets/dragon-v3.css` — new editorial art direction
- `index.html` — swaps the old V2 renderer for V3, retaining every portfolio section
