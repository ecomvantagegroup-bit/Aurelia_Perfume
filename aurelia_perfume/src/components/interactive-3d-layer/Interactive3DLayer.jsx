import { defineComponent, ref, onMounted, onUnmounted, watch } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import gsap from 'gsap';


export default defineComponent({
  name: 'Interactive3DLayer',
  props: {
    activeSection: {
      type: String,
      default: 'hero',
    },
  },
  emits: ['assetsProgress', 'assetsReady'],
  setup(props, { emit }) {
    const canvasRef = ref(null);
    let renderer, scene, camera, animationFrameId, clock;


    // --- Asset Caches ---
    const models = {};
    const particles = {};
    let collectionItems = [];
    let currentActiveModel = null;
    let transitionTL = null;


    // --- Shared Geometries (Reused to minimize VRAM footprint) ---
    const particleGeom = new THREE.BufferGeometry();


    // Lighting Rig
    let keyLight, fillLight, rimLight, ambientLight, hoverSpotLight;


    // Pointer & Interaction Tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(-100, -100);
    let hoveredBottleIndex = -1;
    let isPointerMoving = false;

    // Baseline camera distance for the current viewport, kept in sync by
    // applyResponsiveCamera. Section transitions dolly relative to this
    // rest position rather than a hardcoded value, so the cinematic push-in
    // effect stays correct across every breakpoint.
    let cameraRestZ = 6.5;

    // Resize debouncing (avoids thrashing the renderer/camera on mobile
    // orientation-change or rapid browser-chrome resize events).
    let resizeDebounceId = null;

    // ---------------------------------------------------------------------
    // Preload progress tracking. Everything here only concerns *how much*
    // of the one-time asset preload (GLB + texture downloads, then shader
    // warm-up) has completed — it has no effect on section transitions,
    // camera, lighting, particles, or any other runtime behavior. Progress
    // is reported upward via the `assetsProgress`/`assetsReady` events so
    // the app-level Preloader can reflect real loading state instead of a
    // simulated timer.
    // ---------------------------------------------------------------------
    let assetsFullyReady = false;
    let loadFraction = 0; // 0..1 — GLB + embedded texture downloads
    let compileFraction = 0; // 0..1 — shader/material GPU warm-up
    const LOAD_PHASE_WEIGHT = 0.8;
    const COMPILE_PHASE_WEIGHT = 0.2;

    const emitAssetsProgress = () => {
      const pct = Math.round((loadFraction * LOAD_PHASE_WEIGHT + compileFraction * COMPILE_PHASE_WEIGHT) * 100);
      emit('assetsProgress', Math.min(100, Math.max(0, pct)));
    };

    // Maps every section name to the model it should display. Sections that
    // share a model (forest/notes, amber/story) resolve to the same key so we
    // can detect "no real change" transitions.
    const SECTION_MODEL_MAP = {
      hero: 'hero',
      forest: 'forest',
      notes: 'forest',
      ocean: 'ocean',
      amber: 'amber',
      story: 'amber',
    };

    // Tracks which model key was actually on screen last, independent of
    // `props.activeSection`, so re-entering a section that maps to the same
    // model doesn't replay the entrance animation.
    let lastModelKey = null;

    // True while the collection entrance tween is still playing. Continuous
    // anchor-tracking (see reflowCollectionLayout) is paused during this
    // window so it doesn't fight the "pop in" animation.
    let collectionEntering = false;

    // Baseline height (world units) every model is normalized to on load,
    // before any section-specific scale multiplier below is applied.
    const TARGET_MODEL_HEIGHT = 4.2;

    // The entrance "pop in" starts from this fraction of each section's
    // target scale. Kept as a ratio (not an absolute number) so the pop-in
    // feel stays consistent across sections with different target scales.
    const SECTION_VIEW_ENTRANCE_START_RATIO = 0.2 / 1.3;

    // Since normalizeModelScale bottom-anchors every model at local y = 0
    // (see below), a model's world-space vertical *center* sits at
    // position.y + halfHeight, where halfHeight is derived from this
    // section's own scaleMultiplier. To keep every non-Collection bottle
    // vertically centered on the world origin (which the camera is aimed
    // at, see initScene/applyResponsiveCamera), position.y must be set to
    // -halfHeight rather than an arbitrary small nudge. This keeps
    // centering correct and responsive across every viewport, since the
    // camera's FOV/distance changes (applyResponsiveCamera) preserve
    // framing around the same world origin.
    const centeredY = (scaleMultiplier) => -(TARGET_MODEL_HEIGHT * scaleMultiplier) / 2;

    // ---------------------------------------------------------------------
    // Cinematic transition pacing. Previous values (0.8s / 0.4s, spring-y
    // back.out eases) read as a fast slideshow rather than a premium
    // product film. These slower durations + smoother eases apply to every
    // single-model section transition (hero/forest/ocean/amber) without
    // touching the Collection section's own pinned/scroll-scrubbed timing.
    // ---------------------------------------------------------------------
    const TRANSITION_DURATION = 1.6; // position/scale settle time (was 0.8)
    const EXIT_DURATION = 1.0; // outgoing bottle slide-out (was 0.4)
    const EXIT_DISTANCE = 4.5; // softer exit throw distance (was 6.0)
    const ENTRANCE_DELAY = 0.3; // beat after exit begins before entrance starts (was 0.1)
    const ROTATION_DURATION = 1.6; // rotation reset (was un-eased 0.8)
    const LIGHT_TWEEN_DURATION = 1.4; // lighting crossfade (was 0.7)
    const FOG_TWEEN_DURATION = 1.6; // fog crossfade (was 0.8)
    const PARTICLE_FADE_OUT_DURATION = 0.7; // was 0.3
    const PARTICLE_FADE_IN_DURATION = 1.0; // was 0.6
    const PARTICLE_FADE_IN_DELAY = 0.5; // was 0.2
    const CAMERA_DOLLY_AMOUNT = 0.4; // subtle push-in/settle per transition

    // Minimum time (ms) each *bottle* stays fully on screen before a
    // different bottle is allowed to take its place. Gated by model
    // identity (SECTION_MODEL_MAP's resolved key), not by section name —
    // this matters because `notes` reuses the forest model and `story`
    // reuses the amber model (see SECTION_MODEL_MAP above), so the forest
    // bottle is already shown across two sections' worth of real scroll
    // distance and the amber bottle across two as well, while ocean has no
    // partner section and only gets its own. A uniform floor here is what
    // actually delivers "roughly equal viewing time per perfume": sections
    // that already run long from real scroll rarely hit this floor, while
    // ocean reliably does, closing the gap instead of guessing at it.
    // Collection swaps in three models simultaneously via its own
    // pin+scrub pacing (driven directly by scroll position in
    // collection.jsx) and isn't part of this single-model gate.
    const MODEL_MIN_DWELL_MS = {
      hero: 900,
      forest: 2200,
      ocean: 2200,
      amber: 2200,
    };

    const resolveModelKey = (section) => SECTION_MODEL_MAP[section] || section;

    let currentDisplayedModelKey = resolveModelKey(props.activeSection);
    let modelActivatedAt = 0;
    let pendingSection = null;
    let dwellTimeoutId = null;

    // Actually runs a transition and updates the dwell-tracking bookkeeping.
    // modelActivatedAt only resets when the bottle identity actually
    // changes — switching forest -> notes (same bottle) doesn't restart
    // forest's clock, so its cumulative on-screen time keeps counting.
    const runTransition = (section) => {
      if (dwellTimeoutId) {
        clearTimeout(dwellTimeoutId);
        dwellTimeoutId = null;
      }
      pendingSection = null;

      const requestedModelKey = resolveModelKey(section);
      if (requestedModelKey !== currentDisplayedModelKey) {
        currentDisplayedModelKey = requestedModelKey;
        modelActivatedAt = performance.now();
      }

      transitionSection(section);
    };

    // Scroll can advance activeSection faster than the current bottle's
    // minimum showcase time. Rather than cutting its moment short, queue
    // the requested section and let it settle in once the dwell window
    // closes; if the user keeps scrolling, only the latest requested
    // section is honored (no queued backlog of transitions).
    const requestSectionTransition = (section) => {
      const requestedModelKey = resolveModelKey(section);

      // Same bottle as what's already showing (e.g. forest -> notes,
      // story -> amber, or re-entering the same section): never gated,
      // there's nothing to protect against interrupting.
      if (requestedModelKey === currentDisplayedModelKey) {
        runTransition(section);
        return;
      }

      const minDwell = MODEL_MIN_DWELL_MS[currentDisplayedModelKey] ?? 0;
      const elapsed = performance.now() - modelActivatedAt;

      if (elapsed >= minDwell) {
        runTransition(section);
        return;
      }

      pendingSection = section;
      if (dwellTimeoutId) clearTimeout(dwellTimeoutId);
      dwellTimeoutId = setTimeout(() => {
        dwellTimeoutId = null;
        if (pendingSection && resolveModelKey(pendingSection) !== currentDisplayedModelKey) {
          runTransition(pendingSection);
        }
      }, Math.max(0, minDwell - elapsed));
    };

    // ---------------------------------------------------------------------
    // Per-section visual configuration: scale, position, lighting, fog and
    // exposure. Every non-collection section is fully independent here —
    // nothing is shared with the Collection section's sizing logic, and
    // nothing is shared between sections themselves.
    //
    // scaleMultiplier is relative to the model's own normalizedScale (set by
    // normalizeModelScale during preload), so bottles with different source
    // scales still come out visually consistent within a section.
    //
    // scaleMultiplier values below were reduced to ~65-70% of their previous
    // values (each section keeps its own independent scale, just uniformly
    // scaled down) and position.y is now computed via centeredY() so every
    // bottle sits fully visible and centered, horizontally (x: 0) and
    // vertically, regardless of viewport size.
    // ---------------------------------------------------------------------
    const SECTION_VISUAL_CONFIG = {
      hero: {
        scaleMultiplier: 0.70,
        position: { x: 0, y: centeredY(0.70), z: 0 },
        keyColor: 0xfff7ed,
        rimColor: 0xfde047,
        fillColor: 0xffffff,
        fogColor: 0x000000,
        fogDensity: 0,
        exposure: 1.1,
        particleTheme: null,
      },
      forest: {
        scaleMultiplier: 0.54,
        position: { x: 0, y: centeredY(0.54), z: 0 },
        keyColor: 0x4ade80,
        rimColor: 0xa7f3d0,
        fillColor: 0x86efac,
        fogColor: 0x0c1f14,
        fogDensity: 0.045,
        exposure: 1.05,
        particleTheme: 'forest',
      },
      ocean: {
        scaleMultiplier: 0.57,
        position: { x: 0, y: centeredY(0.57), z: 0 },
        keyColor: 0x38bdf8,
        rimColor: 0xbae6fd,
        fillColor: 0x7dd3fc,
        fogColor: 0x041b2b,
        fogDensity: 0.04,
        exposure: 1.0,
        particleTheme: 'ocean',
      },
      amber: {
        scaleMultiplier: 0.60,
        position: { x: 0, y: centeredY(0.60), z: 0 },
        keyColor: 0xf59e0b,
        rimColor: 0xfef08a,
        fillColor: 0xfcd34d,
        fogColor: 0x2a1204,
        fogDensity: 0.035,
        exposure: 1.2,
        particleTheme: 'amber',
      },
    };

    const getVisualConfig = (section) => {
      const modelKey = SECTION_MODEL_MAP[section] || section;
      return SECTION_VISUAL_CONFIG[modelKey] || SECTION_VISUAL_CONFIG.hero;
    };

    // Tweens a Light's/Color's r/g/b directly (works for THREE.Color owners
    // like keyLight.color, and for scene.fog.color) with an explicit,
    // consistent duration/ease so section-to-section lighting always
    // transitions smoothly rather than relying on gsap's implicit default.
    const tweenColor = (target, hex, duration = 0.6, position = 0) => {
      if (!target) return;
      const c = new THREE.Color(hex);
      transitionTL.to(target, { r: c.r, g: c.g, b: c.b, duration, ease: 'sine.inOut' }, position);
    };

    // ---------------------------------------------------------------------
    // Themed particle systems. Each theme drives both look (color/size) and
    // per-frame movement style. Movement is done by re-writing a small
    // Float32Array of positions each frame (count stays low, so this is
    // cheap) rather than per-particle shaders, which keeps this GPU-light
    // and framework-simple while still reading as "alive" rather than a
    // static rotating point cloud.
    // ---------------------------------------------------------------------
    const PARTICLE_THEMES = {
      forest: { count: 90, color: 0x86efac, size: 0.045, opacity: 0.7, spread: 7, style: 'firefly' },
      ocean: { count: 90, color: 0x7dd3fc, size: 0.035, opacity: 0.55, spread: 8, style: 'mist' },
      amber: { count: 90, color: 0xfcd34d, size: 0.05, opacity: 0.6, spread: 7, style: 'sand' },
    };


    // 1. Studio Environment Map (Pre-baked Environment)
    const createStudioEnvironment = () => {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      pmremGenerator.compileEquirectangularShader();


      const envScene = new THREE.Scene();
      const geom = new THREE.SphereGeometry(4, 8, 8); // Ultra-low segment count for memory savings


      const topLight = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({ color: 0xffffff }));
      topLight.position.set(0, 10, 2);


      const blueLight = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
      blueLight.position.set(-8, 2, -4);


      const goldLight = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
      goldLight.position.set(8, -2, -4);


      envScene.add(topLight, blueLight, goldLight);


      const renderTarget = pmremGenerator.fromScene(envScene);
      scene.environment = renderTarget.texture;


      geom.dispose();
      pmremGenerator.dispose();
    };


    // 2. Fallback Bottle Generator (If GLBs fail to load)
    const createFallbackBottle = () => {
      const group = new THREE.Group();
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.2 });
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: 0.05,
        transmission: 0.95,
        thickness: 0.6,
        ior: 1.5,
        transparent: true,
        envMapIntensity: 1.4,
        clearcoat: 0.3,
        clearcoatRoughness: 0.1,
      });


      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 2.2, 16), glassMat);
      body.position.y = -0.1;


      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.25, 12), goldMat);
      neck.position.y = 1.1;


      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.5), goldMat);
      cap.position.y = 1.5;


      group.add(body, neck, cap);
      return group;
    };


    // 2b. Normalize an arbitrary imported GLB to a consistent on-screen size.
    // Different source files almost never share the same export scale/units,
    // so without this step "the same" targetScale multiplier produces wildly
    // different apparent sizes per model.
    const normalizeModelScale = (model, targetHeight = TARGET_MODEL_HEIGHT) => {
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      box.getSize(size);

      const currentHeight = size.y || 1;
      const scaleFactor = targetHeight / currentHeight;
      model.scale.setScalar(scaleFactor);

      // Re-measure after scaling, then center horizontally and rest the
      // model's bottom on y = 0 so every model shares the same anchor point
      // that the transition tweens (targetY offsets) assume.
      const scaledBox = new THREE.Box3().setFromObject(model);
      const center = new THREE.Vector3();
      const finalSize = new THREE.Vector3();
      scaledBox.getCenter(center);
      scaledBox.getSize(finalSize);
      model.position.x -= center.x;
      model.position.z -= center.z;
      model.position.y -= scaledBox.min.y;

      // Cache for later: `normalizedScale` is the absolute scale.setScalar()
      // value that currently makes this model's height == targetHeight — any
      // other code that sets scale directly (not multiplying) needs to scale
      // relative to this, not assume a baseline of 1. `aspect` is the
      // measured width:height ratio, which stays valid at any uniform scale.
      model.userData.normalizedScale = scaleFactor;
      model.userData.aspect = finalSize.x / (finalSize.y || 1);
    };


    // 2c. Decide whether a mesh should become "glass" rather than being left
    // as-is. Heuristic: mesh/material name mentions glass/bottle, or the
    // source material was already flagged transparent.
    const looksLikeGlass = (mesh) => {
      const name = `${mesh.name} ${mesh.material?.name || ''}`.toLowerCase();
      return name.includes('glass') || name.includes('bottle') || mesh.material?.transparent === true;
    };


    // 2d. Rebuild a mesh's material as true transmissive, physically-based
    // glass while preserving every texture map the original material had
    // (label art, normal maps, alpha cutouts for the label edge, etc.) and
    // its UVs — we never touch the geometry, only swap the material, so UV
    // mapping and label placement are untouched.
    const upgradeToGlassMaterial = (mesh) => {
      const oldMat = mesh.material;
      if (!oldMat) return;

      if (!looksLikeGlass(mesh)) {
        // Non-glass parts (labels, caps, liquid) just get better env reflections.
        oldMat.envMapIntensity = 1.0;
        oldMat.needsUpdate = true;
        return;
      }

      const baseColor = oldMat.color ? oldMat.color.clone() : new THREE.Color(0xffffff);

      const glassMat = new THREE.MeshPhysicalMaterial({
        // Preserved texture maps — labels stay fully visible, UVs untouched.
        map: oldMat.map || null,
        normalMap: oldMat.normalMap || null,
        alphaMap: oldMat.alphaMap || null,
        color: baseColor,
        metalness: 0,
        roughness: 0.04,
        transmission: 0.96, // physically-accurate light transmission (true glass, not solid plastic)
        thickness: 0.55, // slight wall thickness for correct refraction
        ior: 1.52, // glass-accurate index of refraction
        transparent: true,
        envMapIntensity: 1.5, // smooth, believable reflections from the studio env map
        clearcoat: 0.4, // premium glossy clear-coat finish
        clearcoatRoughness: 0.08,
        specularIntensity: 1,
        specularColor: 0xffffff, // slight reflectivity on top of transmission
        attenuationColor: baseColor,
        attenuationDistance: 1.2,
        side: THREE.DoubleSide,
      });

      mesh.material = glassMat;
      oldMat.dispose();
    };


    // 3. Themed Particle Setup
    const createParticleSystem = (themeKey) => {
      const theme = PARTICLE_THEMES[themeKey];
      const { count, color, size, spread, style } = theme;

      const basePositions = new Float32Array(count * 3);
      const phases = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        basePositions[i * 3] = (Math.random() - 0.5) * spread;
        basePositions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.7;
        basePositions[i * 3 + 2] = (Math.random() - 0.5) * spread * 0.6;
        phases[i] = Math.random() * Math.PI * 2;
      }

      const geom = particleGeom.clone();
      geom.setAttribute('position', new THREE.BufferAttribute(basePositions.slice(), 3));

      const mat = new THREE.PointsMaterial({
        color,
        size,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending, // GPU-cheap, no per-particle lighting cost
        depthWrite: false,
      });

      const points = new THREE.Points(geom, mat);
      points.visible = false;
      points.userData = { style, basePositions, phases, fadeTarget: theme.opacity };
      scene.add(points);
      return points;
    };

    const initParticleSystems = () => {
      particles.forest = createParticleSystem('forest');
      particles.ocean = createParticleSystem('ocean');
      particles.amber = createParticleSystem('amber');
    };

    // Per-frame themed movement. Cheap CPU rewrite of a small position
    // buffer per visible system only (hidden systems are skipped entirely).
    const updateParticleAnimations = (elapsed) => {
      Object.values(particles).forEach((points) => {
        if (!points || !points.visible) return;

        const { style, basePositions, phases } = points.userData;
        const posAttr = points.geometry.attributes.position;
        const arr = posAttr.array;
        const count = phases.length;

        for (let i = 0; i < count; i++) {
          const ix = i * 3;
          const iy = ix + 1;
          const iz = ix + 2;
          const phase = phases[i];

          if (style === 'firefly') {
            // Forest: erratic, firefly-like drift on all three axes.
            arr[ix] = basePositions[ix] + Math.sin(elapsed * 0.5 + phase) * 0.25;
            arr[iy] = basePositions[iy] + Math.sin(elapsed * 0.8 + phase * 1.3) * 0.3;
            arr[iz] = basePositions[iz] + Math.cos(elapsed * 0.4 + phase) * 0.25;
          } else if (style === 'mist') {
            // Ocean: gentle horizontal wave-like drift, gliding mist.
            arr[ix] = basePositions[ix] + Math.sin(elapsed * 0.25 + phase) * 0.4;
            arr[iy] = basePositions[iy] + Math.sin(elapsed * 0.3 + phase * 0.7) * 0.15;
            arr[iz] = basePositions[iz];
          } else if (style === 'sand') {
            // Amber/Desert: slow, lazy floating dust — no sharp movement.
            arr[ix] = basePositions[ix] + Math.sin(elapsed * 0.15 + phase) * 0.3;
            arr[iy] = basePositions[iy] + Math.sin(elapsed * 0.12 + phase * 1.4) * 0.2;
            arr[iz] = basePositions[iz] + Math.cos(elapsed * 0.1 + phase) * 0.2;
          }
        }

        posAttr.needsUpdate = true;
        points.rotation.y += style === 'mist' ? -0.0004 : style === 'sand' ? 0.0002 : 0.0006;
      });
    };


    // 3b. Shader/Material Warm-up. Forces every material currently in the
    // scene to compile its GPU shader program up front, so the first real
    // render of each section (when a bottle first becomes visible, or on
    // its first hover in Collection) never pays a first-frame compile cost
    // — which is exactly the kind of stutter/pop-in the preloader is meant
    // to eliminate. Purely a GPU warm-up pass; touches no transforms,
    // materials, or scene contents.
    const compileSceneShaders = async () => {
      if (!renderer || !scene || !camera) return;
      try {
        if (typeof renderer.compileAsync === 'function') {
          await renderer.compileAsync(scene, camera);
        } else {
          renderer.compile(scene, camera);
        }
      } catch (err) {
        // Non-fatal: worst case a material compiles on its first real
        // frame instead of during preload.
      }
    };


    // 4. Preload Models (Preserving Original Textures)
    const preloadModels = () => {
      // Shared LoadingManager across every GLTF load so we get one accurate,
      // aggregate progress signal covering the .glb files themselves plus
      // every embedded texture they reference — not just a per-file count.
      const manager = new THREE.LoadingManager();
      manager.onProgress = (_url, itemsLoaded, itemsTotal) => {
        loadFraction = itemsTotal > 0 ? itemsLoaded / itemsTotal : 1;
        emitAssetsProgress();
      };

      const dracoLoader = new DRACOLoader(manager);
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');


      const loader = new GLTFLoader(manager);
      loader.setDRACOLoader(dracoLoader);


      const paths = [
        { key: 'forest', path: '/models/forest_bottle.glb' },
        { key: 'ocean', path: '/models/ocean_bottle.glb' },
        { key: 'amber', path: '/models/amber_bottle.glb' },
      ];


      let loadedCount = 0;
      let finalized = false;

      // Runs once every GLB (including all of its textures — GLTFLoader
      // only calls its onLoad after every embedded resource it references
      // has finished loading) has been processed. From here we build the
      // procedural hero model, warm up every material's shader program on
      // the GPU, and only then tell the rest of the app that the 3D layer
      // has nothing left to load at runtime.
      const finalizeAssets = async () => {
        if (finalized) return;
        finalized = true;

        if (watchdogId) {
          clearTimeout(watchdogId);
          watchdogId = null;
        }

        if (!models.hero) {
          models.hero = createFallbackBottle();
          normalizeModelScale(models.hero);
          models.hero.visible = false;
          scene.add(models.hero);
        }

        loadFraction = 1;
        emitAssetsProgress();

        await compileSceneShaders();
        compileFraction = 1;
        emitAssetsProgress();

        assetsFullyReady = true;
        emit('assetsReady');

        // Trigger section layout once everything is cached
        runTransition(props.activeSection);
      };

      // Safety net: if anything in the load/compile chain above stalls or
      // throws somewhere it can't be caught (a bad network response, a
      // missing asset that doesn't resolve either callback, etc.), this
      // guarantees the site still becomes interactive instead of leaving
      // the user stuck behind the preloader forever. It only fires if
      // finalizeAssets() hasn't already run through its normal path.
      let watchdogId = setTimeout(() => {
        if (!finalized) {
          console.warn(
            '[Interactive3DLayer] Asset preload did not complete within the expected time — ' +
              'falling back to reveal the site anyway. Check the Network tab for failed ' +
              '/models/*.glb requests and the console for load errors.'
          );
          finalizeAssets();
        }
      }, 15000);

      const onComplete = () => {
        loadedCount++;
        if (loadedCount === paths.length) {
          finalizeAssets();
        }
      };


      paths.forEach(({ key, path }) => {
        loader.load(
          path,
          (gltf) => {
            try {
              const model = gltf.scene;


              // Preserve GLB textures while upgrading glass parts to a real
              // transmissive material and normalizing scale across all models.
              model.traverse((child) => {
                if (child.isMesh) {
                  child.castShadow = false;
                  child.receiveShadow = false;
                  upgradeToGlassMaterial(child);
                }
              });

              normalizeModelScale(model);


              model.visible = false;
              scene.add(model);
              models[key] = model;
            } catch (err) {
              // If anything above throws, fall back rather than losing this
              // model's onComplete() call — a thrown error here previously
              // meant loadedCount could never reach paths.length, which
              // silently hung the whole preloader.
              console.error(`[Interactive3DLayer] Failed to process model "${key}":`, err);
              const fallback = createFallbackBottle();
              normalizeModelScale(fallback);
              fallback.visible = false;
              scene.add(fallback);
              models[key] = fallback;
            }
            onComplete();
          },
          undefined,
          (err) => {
            // Loader Fallback in case path/file is missing
            console.warn(`[Interactive3DLayer] Failed to load "${path}", using fallback bottle:`, err);
            const fallback = createFallbackBottle();
            normalizeModelScale(fallback);
            fallback.visible = false;
            scene.add(fallback);
            models[key] = fallback;
            onComplete();
          }
        );
      });
    };


    // 4b. Per-Card Anchor Tracking (Collection section only — untouched)
    // Each collection card has its own small marker element tagged
    // data-bottle-anchor="forest|ocean|amber" (see collection.jsx). We use it
    // to find the *card* (its closest .collection-card ancestor) and fit the
    // bottle inside the card's actual box — not the thin anchor strip, which
    // is just a positioning marker, not a literal bottle-sized container.
    const ANCHOR_ATTR = 'data-bottle-anchor';
    const CARD_SELECTOR = '.collection-card';

    // Leaves margin inside the card rather than filling it edge-to-edge —
    // tune these if bottles still read too big/small relative to the cards.
    // NOTE: Collection sizing stays exactly as-is per spec — do not touch.
    const COLLECTION_FIT_HEIGHT_RATIO = 0.5; // max bottle height vs. card height
    const COLLECTION_FIT_WIDTH_RATIO = 0.4; // max bottle width vs. card width

    const screenToWorldOnPlane = (clientX, clientY, planeZ = 0) => {
      const ndcX = (clientX / window.innerWidth) * 2 - 1;
      const ndcY = -(clientY / window.innerHeight) * 2 + 1;

      const point = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera);
      const dir = point.sub(camera.position).normalize();
      const distance = (planeZ - camera.position.z) / dir.z;

      return camera.position.clone().add(dir.multiplyScalar(distance));
    };

    const getElementWorldRect = (el) => {
      if (!el || !camera) return null;

      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return null;

      const topLeft = screenToWorldOnPlane(rect.left, rect.top, 0);
      const bottomRight = screenToWorldOnPlane(rect.right, rect.bottom, 0);

      return {
        centerX: (topLeft.x + bottomRight.x) / 2,
        centerY: (topLeft.y + bottomRight.y) / 2,
        width: Math.abs(bottomRight.x - topLeft.x),
        height: Math.abs(topLeft.y - bottomRight.y),
      };
    };

    // For positioning: the anchor's own rect (bottle centers on this point).
    // For sizing: the parent card's rect (bottle fits within this box).
    const getAnchorAndCardRects = (modelKey) => {
      const anchorEl = document.querySelector(`[${ANCHOR_ATTR}="${modelKey}"]`);
      if (!anchorEl) return { anchorRect: null, cardRect: null };

      const cardEl = anchorEl.closest(CARD_SELECTOR);
      return {
        anchorRect: getElementWorldRect(anchorEl),
        cardRect: cardEl ? getElementWorldRect(cardEl) : null,
      };
    };

    const computeCollectionLayout = () => {
      const keys = ['ocean', 'forest', 'amber'];

      return keys.map((key, index) => {
        const model = models[key];
        const { anchorRect, cardRect } = getAnchorAndCardRects(key);

        const normalizedScale = model?.userData?.normalizedScale ?? 1;
        const aspect = model?.userData?.aspect || 0.5;

        let targetScale = normalizedScale * 0.4; // sane fallback if no card found yet

        if (cardRect) {
          // Fit height-wise and width-wise against the card, take whichever
          // is tighter so the bottle never overflows the card box.
          const heightBudget = cardRect.height * COLLECTION_FIT_HEIGHT_RATIO;
          const widthBudget = cardRect.width * COLLECTION_FIT_WIDTH_RATIO;
          const fitHeight = Math.min(heightBudget, widthBudget / aspect);

          // fitHeight is a real-world target height; convert it to an
          // absolute scale value using this model's own normalizedScale,
          // not TARGET_MODEL_HEIGHT directly — otherwise models whose raw
          // geometry isn't already exactly TARGET_MODEL_HEIGHT tall end up
          // wrongly sized.
          targetScale = normalizedScale * (fitHeight / TARGET_MODEL_HEIGHT);
        }

        const targetX = anchorRect ? anchorRect.centerX : (index - 1) * 2.2;
        const targetY = anchorRect ? anchorRect.centerY : -0.2;

        return { model, targetX, targetY, targetScale, index };
      });
    };

    // Re-applies each bottle's position/scale from its anchor every frame
    // while in the collection section — needed because this section is
    // pinned+scrubbed on scroll, so the cards (and their anchors) move on
    // screen continuously, not just on resize.
    const reflowCollectionLayout = () => {
      if (props.activeSection !== 'collection' || collectionEntering) return;

      computeCollectionLayout().forEach(({ model, targetX, targetY, targetScale, index }) => {
        if (!model) return;

        Object.assign(model.userData, { baseX: targetX, baseY: targetY, baseScale: targetScale, index });
        model.position.x = targetX;
        model.position.y = targetY;

        if (hoveredBottleIndex !== index) {
          model.scale.setScalar(targetScale);
        }
      });
    };


    // 5. Section Transition Engine
    let exitToggle = true;


    const transitionSection = (section) => {
      if (transitionTL) transitionTL.kill();
      transitionTL = gsap.timeline();


      // Fade out all active particle fields
      Object.values(particles).forEach((p) => {
        if (p && p.visible) {
          transitionTL.to(
            p.material,
            { opacity: 0, duration: PARTICLE_FADE_OUT_DURATION, ease: 'sine.inOut', onComplete: () => (p.visible = false) },
            0
          );
        }
      });


      // --- COLLECTION VIEW (sizing/layout untouched) ---
      if (section === 'collection') {
        if (currentActiveModel) {
          currentActiveModel.visible = false;
        }


        collectionEntering = true;
        transitionTL.eventCallback('onComplete', () => {
          collectionEntering = false;
        });


        // Return lighting/fog/exposure to a clean, neutral showcase state.
        tweenColor(keyLight?.color, 0xffffff, 0.6, 0);
        tweenColor(rimLight?.color, 0xffffff, 0.6, 0);
        tweenColor(fillLight?.color, 0xffffff, 0.6, 0);
        if (scene.fog) {
          transitionTL.to(scene.fog, { density: 0, duration: 0.6 }, 0);
        }
        if (renderer) {
          transitionTL.to(renderer, { toneMappingExposure: 1.1, duration: 0.6 }, 0);
        }


        const items = computeCollectionLayout();


        collectionItems = [];


        items.forEach(({ model, targetX, targetY, targetScale, index }) => {
          if (!model) return;


          model.visible = true;
          Object.assign(model.userData, { baseX: targetX, baseY: targetY, baseScale: targetScale, index });
          collectionItems.push(model);


          transitionTL.to(
            model.position,
            { x: targetX, y: targetY, z: 0, duration: 0.8, ease: 'power2.out' },
            0
          );
          transitionTL.to(
            model.scale,
            { x: targetScale, y: targetScale, z: targetScale, duration: 0.8, ease: 'back.out(1.2)' },
            0
          );
          transitionTL.to(model.rotation, { x: 0, y: 0, z: 0, duration: 0.8 }, 0);
        });


        currentActiveModel = null;
        lastModelKey = null;
        return;
      }


      // --- SINGLE MODEL VIEW ---
      const cfg = getVisualConfig(section);
      const targetModelKey = SECTION_MODEL_MAP[section] || '';
      const activeParticleKey = cfg.particleTheme || '';


      // Hide all non-active collection items when stepping out of collection mode
      collectionItems.forEach((item) => {
        if (item && item !== models[targetModelKey]) {
          item.visible = false;
        }
      });


      const nextModel = models[targetModelKey];

      // True only when we're re-entering a section that maps to the same
      // model that's already front-and-center (e.g. forest -> notes). In
      // that case we skip the entrance "pop" so it doesn't replay pointlessly.
      const isSameModelAsBefore =
        !!targetModelKey &&
        targetModelKey === lastModelKey &&
        nextModel === currentActiveModel &&
        !!currentActiveModel?.visible;


      // Slide out previous active model — softer distance and a slower,
      // fully eased curve so it reads as a deliberate cross-fade rather
      // than a fast whip off-screen.
      if (currentActiveModel && currentActiveModel !== nextModel && currentActiveModel.visible) {
        const exitX = exitToggle ? EXIT_DISTANCE : -EXIT_DISTANCE;
        exitToggle = !exitToggle;
        const prev = currentActiveModel;


        transitionTL.to(
          prev.position,
          {
            x: exitX,
            duration: EXIT_DURATION,
            ease: 'power3.inOut',
            onComplete: () => {
              prev.visible = false;
            },
          },
          0
        );
      }


      // Bring target model into frame at this section's own independent
      // scale/position — never shared with Collection or other sections.
      if (nextModel) {
        currentActiveModel = nextModel;
        nextModel.visible = true;


        if (!isSameModelAsBefore) {
          const normalizedScale = nextModel.userData?.normalizedScale ?? 1;
          const targetScale = normalizedScale * cfg.scaleMultiplier;
          const startScale = targetScale * SECTION_VIEW_ENTRANCE_START_RATIO;

          // power3.out decelerates smoothly into place with no overshoot —
          // reads as a controlled, premium reveal rather than a springy pop.
          transitionTL.fromTo(
            nextModel.scale,
            { x: startScale, y: startScale, z: startScale },
            { x: targetScale, y: targetScale, z: targetScale, duration: TRANSITION_DURATION, ease: 'power3.out' },
            ENTRANCE_DELAY
          );
          transitionTL.to(
            nextModel.position,
            { x: cfg.position.x, y: cfg.position.y, z: cfg.position.z, duration: TRANSITION_DURATION, ease: 'power3.out' },
            ENTRANCE_DELAY
          );
          transitionTL.to(
            nextModel.rotation,
            { x: 0, y: 0, z: 0, duration: ROTATION_DURATION, ease: 'sine.inOut' },
            ENTRANCE_DELAY
          );
        }
      }

      lastModelKey = targetModelKey;

      // Subtle cinematic camera dolly: ease in from slightly further back
      // to the viewport's resting distance, synced with the bottle's
      // entrance. Purely additive on top of applyResponsiveCamera's
      // breakpoint framing — never overrides it, just eases toward it.
      if (camera) {
        transitionTL.fromTo(
          camera.position,
          { z: cameraRestZ + CAMERA_DOLLY_AMOUNT },
          { z: cameraRestZ, duration: TRANSITION_DURATION, ease: 'sine.inOut' },
          0
        );
      }


      // --- Per-section lighting, fog, and exposure (smooth crossfade) ---
      tweenColor(keyLight?.color, cfg.keyColor, LIGHT_TWEEN_DURATION, 0);
      tweenColor(rimLight?.color, cfg.rimColor, LIGHT_TWEEN_DURATION, 0);
      tweenColor(fillLight?.color, cfg.fillColor, LIGHT_TWEEN_DURATION, 0);

      if (scene.fog) {
        tweenColor(scene.fog.color, cfg.fogColor, FOG_TWEEN_DURATION, 0);
        transitionTL.to(scene.fog, { density: cfg.fogDensity, duration: FOG_TWEEN_DURATION, ease: 'sine.inOut' }, 0);
      }
      if (renderer) {
        transitionTL.to(renderer, { toneMappingExposure: cfg.exposure, duration: FOG_TWEEN_DURATION, ease: 'sine.inOut' }, 0);
      }


      // Display this section's themed particles
      const activePoints = particles[activeParticleKey];
      if (activePoints) {
        activePoints.visible = true;
        transitionTL.to(
          activePoints.material,
          { opacity: activePoints.userData.fadeTarget ?? 0.6, duration: PARTICLE_FADE_IN_DURATION, ease: 'sine.inOut' },
          PARTICLE_FADE_IN_DELAY
        );
      }
    };


    // 6. Raycasting for Collection Item Selection/Hover
    const updateCollectionHover = () => {
      if (props.activeSection !== 'collection' || !isPointerMoving) return;


      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(collectionItems, true);


      if (intersects.length > 0) {
        let topObject = intersects[0].object;
        while (topObject.parent && !collectionItems.includes(topObject)) {
          topObject = topObject.parent;
        }


        const index = topObject.userData.index;


        if (hoveredBottleIndex !== index) {
          hoveredBottleIndex = index;
          collectionItems.forEach((item) => {
            const isHovered = item.userData.index === index;
            const targetScale = item.userData.baseScale * (isHovered ? 1.15 : 0.9);
            const targetZ = isHovered ? 0.4 : 0;


            gsap.to(item.scale, { x: targetScale, y: targetScale, z: targetScale, duration: 0.3 });
            gsap.to(item.position, { z: targetZ, duration: 0.3 });


            if (isHovered && hoverSpotLight) {
              hoverSpotLight.position.set(item.position.x, item.position.y + 3, item.position.z + 2);
              hoverSpotLight.target = item;
              gsap.to(hoverSpotLight, { intensity: 4.0, duration: 0.2 });
            }
          });
        }
      } else if (hoveredBottleIndex !== -1) {
        hoveredBottleIndex = -1;
        collectionItems.forEach((item) => {
          gsap.to(item.scale, {
            x: item.userData.baseScale,
            y: item.userData.baseScale,
            z: item.userData.baseScale,
            duration: 0.3,
          });
          gsap.to(item.position, { z: 0, duration: 0.3 });
        });
        if (hoverSpotLight) gsap.to(hoverSpotLight, { intensity: 0, duration: 0.2 });
      }


      isPointerMoving = false;
    };


    // Responsive camera framing: on narrow/tall (mobile) viewports, pull the
    // camera back and widen the FOV slightly so full-height models stay
    // framed inside the viewport instead of clipping top/bottom — this is
    // on top of (not instead of) each section's own scale/position values.
    const applyResponsiveCamera = () => {
      if (!camera) return;
      const aspect = window.innerWidth / window.innerHeight;
      camera.aspect = aspect;

      if (aspect < 0.6) {
        camera.fov = 50;
        camera.position.z = 8;
      } else if (aspect < 0.9) {
        camera.fov = 44;
        camera.position.z = 7.2;
      } else {
        camera.fov = 40;
        camera.position.z = 6.5;
      }

      cameraRestZ = camera.position.z;
      camera.updateProjectionMatrix();
    };


    // 7. Initialization & Render Loop
    const initScene = () => {
      const container = canvasRef.value;
      if (!container) return;


      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 50);
      camera.position.set(0, 0, 6.5);
      applyResponsiveCamera();

      // Fog is created once, disabled (density 0) by default, and eased in
      // per-section inside transitionSection.
      scene.fog = new THREE.FogExp2(0x000000, 0);


      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });

      // `alpha: true` alone isn't enough — WebGLRenderer's default clearAlpha
      // is 1, so it still clears to opaque black. Explicitly zero it out so
      // the canvas is actually transparent.
      renderer.setClearColor(0x000000, 0);


      // Restrict pixel ratio to max 1.5 to reduce memory consumption on high-DPI retina displays
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      container.appendChild(renderer.domElement);


      createStudioEnvironment();


      // Lighting Setup
      ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      keyLight = new THREE.DirectionalLight(0xffecd1, 2.5);
      keyLight.position.set(5, 8, 5);
      fillLight = new THREE.DirectionalLight(0x93c5fd, 1.2);
      fillLight.position.set(-6, 2, 4);
      rimLight = new THREE.DirectionalLight(0xfde047, 2.0);
      rimLight.position.set(0, -5, -4);
      hoverSpotLight = new THREE.SpotLight(0xffffff, 0, 10, Math.PI / 5, 0.5);


      scene.add(ambientLight, keyLight, fillLight, rimLight, hoverSpotLight);


      clock = new THREE.Clock();
      initParticleSystems();
      preloadModels();


      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();


        // Smooth Lerp for Mouse
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;


        // Model Rotation
        if (currentActiveModel && currentActiveModel.visible) {
          currentActiveModel.rotation.y += 0.003;
          currentActiveModel.rotation.z = mouse.x * 0.06;
          currentActiveModel.rotation.x = mouse.y * 0.06;
        }


        updateParticleAnimations(elapsed);
        updateCollectionHover();
        reflowCollectionLayout();
        renderer.render(scene, camera);
      };


      animate();
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    };


    const handleMouseMove = (event) => {
      mouse.targetX = (event.clientX / window.innerWidth - 0.5) * 0.6;
      mouse.targetY = (event.clientY / window.innerHeight - 0.5) * 0.6;


      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      isPointerMoving = true;
    };


    const applyResize = () => {
      if (!renderer || !camera) return;
      applyResponsiveCamera();
      renderer.setSize(window.innerWidth, window.innerHeight);
      reflowCollectionLayout();
    };

    // Debounced so rapid mobile orientation-change / browser-chrome resize
    // events don't repeatedly thrash the renderer and camera projection.
    const handleResize = () => {
      if (resizeDebounceId) clearTimeout(resizeDebounceId);
      resizeDebounceId = setTimeout(applyResize, 120);
    };


    watch(() => props.activeSection, (newSection) => {
      requestSectionTransition(newSection);
    });


    onMounted(() => {
      initScene();
      window.addEventListener('resize', handleResize);
    });


    // Clean Memory Disposal on Unmount
    onUnmounted(() => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (resizeDebounceId) clearTimeout(resizeDebounceId);
      if (dwellTimeoutId) clearTimeout(dwellTimeoutId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);


      particleGeom.dispose();

      Object.values(particles).forEach((points) => {
        points?.geometry?.dispose();
        points?.material?.dispose();
      });


      // Traverse GLTF objects to free textures, maps, and geometries from VRAM
      Object.values(models).forEach((model) => {
        model.traverse((child) => {
          if (child.isMesh) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((mat) => disposeMaterial(mat));
              } else {
                disposeMaterial(child.material);
              }
            }
          }
        });
      });


      renderer?.dispose();
    });


    const disposeMaterial = (mat) => {
      if (!mat) return;
      Object.keys(mat).forEach((prop) => {
        if (mat[prop] && mat[prop].isTexture) {
          mat[prop].dispose();
        }
      });
      mat.dispose();
    };


    return () => (
      <div class="fixed inset-0 z-20 h-screen h-[100dvh] w-screen pointer-events-none overflow-hidden flex items-center justify-center">
        <div ref={canvasRef} class="absolute inset-0 h-full w-full pointer-events-auto" />
      </div>
    );
  },
});