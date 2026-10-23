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

---

# Dragon Forge V2 — Organic Creature Redesign

## Why V2 exists
The original implementation used many angular icosahedrons, box parts, rigid cones, and large triangular planar wings. That silhouette read as a toy / robotic construct rather than a living dragon.

## Improvements
- **Curved organic sculpt**: Catmull–Rom continuous swept mesh surfaces for the long neck, dorsal spines, horns, four organic legs, claws, and long jointed tail.
- **Smoother skin**: upgraded sphere geometry, physically based layered dark-obsidian / crimson materials, procedurally generated repeating reptilian micro-scale bump texture, chest and throat scutes.
- **Dragon head**: tapered muzzle, paired nostrils, expressive slit-pupil amber eyes, soft eyelid blinks, double swept-back horns, rows of teeth, hinged lower jaw, warm throat highlight.
- **Wings**: genuinely curved, subdivided scalloped membranes, weighted vertex colors, radial digit bones, swept reinforced leading edges, responsive deploy and idle motion.
- **Animation**: subtle breathing, delayed continuous tail undulation, damped camera controls, gaze tracking, non-looping fire actions and hover sparks.
- **Fire**: layered moving 3D particle embers plus a real-time deformed tubular flame plume from the opened jaws, glow, shockwave and lighting flash.
- **Grounding**: weighted feet and soft contact shadow on a multi-ring sci-fi pedestal.
- **Content**: entry page copy reflects an obsidian-scaled dragon rather than a modular robot.
- **Caching**: new cache query parameter makes GitHub Pages load the improved JS once deployed.

## Scope
**Only** `harnarayan-gen5rom/GEN5ROM-CYBER` was changed. The other `GEN5ROM` portfolio remains untouched.

## How to interact
1. Open the site's Dragon Forge section and press **AWAKEN THE DRAGON**.
2. Hover the creature's face to get subtle embers and gaze tracking.
3. Click head or press **F** for the flamethrower attack.
4. Click wings to unfold; click tail or press **R** for a roar.
5. Click chest or press **SPACE** for Berserk color mode.
6. Drag the stage to orbit; wheel to zoom; use **RESET** to restore pose.

## Validation
Static JavaScript parsing passed, required markers verified, duplicate HTML IDs checked, existing portfolio sections retained. A full WebGL rendering and on-device performance test could not be performed in the editing environment. This is an upgraded **Three.js procedural 3D scene**, not a native Spline export or film-quality scanned model.
