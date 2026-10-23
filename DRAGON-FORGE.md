# GEN5ROM CYBER — Dragon Forge

This repository is the **GEN5ROM-CYBER** portfolio only. The separate `GEN5ROM` repository is not part of this redesign.

## What's included

- A new dark cinematic editorial visual system in `assets/dragon-forge.css`
- An interactive **procedural 3D** mechanical dragon in `assets/dragon-forge.js` (Three.js/WebGL)
- Distinct articulated head and jaw, wing membranes with mechanical ribs, spiked segmented tail, legs and talons, central energy core, arena and industrial hangar
- Real-time fiery particle stream from the dragon's mouth, sparks, glow, light pulses and energy shockwave
- Cursor head tracking and hotspot behaviors (head, chest, wings, tail)
- User-driven orbit camera and zoom with damping
- Performance-oriented opt-in 3D loading, capped device pixel ratio and viewport pause
- Restyled portfolio cards, type, navigation, buttons and sections
- Existing resume, video links, projects and contact preserved; several inaccurate titles corrected

## Interactions

| Action | Result |
| --- | --- |
| Click **AWAKEN THE DRAGON** | Loads Three.js and starts the real 3D scene |
| Hover head | Eyes glow, head follows pointer, tiny embers escape muzzle |
| Click head / **BREATH FIRE** / F | Opens jaw, shoots a moving 3D fire stream and triggers light burst |
| Hover / click wing | Wing reacts / spreads temporarily |
| Hover / click tail | Tail sways / dragon roars |
| Click chest / Space / **BERSERK** | Switches reactor, eye color and armor lighting |
| Drag model or empty stage | Camera orbits smoothly |
| Scroll inside stage | Zooms in/out |
| **ROAR** / R | Mechanical jaw roar animation |
| **RESET** | Returns to default pose and mode |

## Architecture and performance

The site's current GitHub Pages entry point is the root `index.html`. The previous `style.css` and `script.js` remain in the repo but are not imported by the current entry page. The new entry loads `assets/dragon-forge.css` and `assets/dragon-forge.js`. Three.js itself is loaded **only** when the visitor presses the activation button, from the pinned version `0.170.0` on jsDelivr. A WebGL-capable browser with a network connection to that CDN is required. If loading fails, visitors see a retry message and the rest of the portfolio stays accessible.

## Testing limitations

GitHub connector code writes and static JavaScript syntax / element-ID checks passed. Full browser/GPU visual tests were not available in the editing environment. Verify on desktop Chrome and mobile Safari/Chrome before relying on this as a finished live experience. The 3D creature is procedural Three.js, **not** a native Spline file or a pre-modeled GLB.

This site never modifies or imports from the user's other `GEN5ROM` repository.
