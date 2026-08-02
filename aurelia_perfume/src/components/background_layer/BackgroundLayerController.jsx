import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import './background_layer.css';

export default defineComponent({
  name: 'BackgroundLayerController',
  props: {
    activeSection: {
      type: String,
      default: 'hero',
    },
  },
  emits: ['assetsProgress', 'assetsReady'],
  setup(props, { emit }) {
    const canvasRef = ref(null);
    const isMobile = window.innerWidth <= 768;

    // Frame specs per section
    const forestFrames = isMobile ? 120 : 250;
    const notesFrames = isMobile ? 192 : 384;
    const oceanFrames = isMobile ? 120 : 250;
    const storyFrames = isMobile ? 96 : 240;
    const amberFrames = isMobile ? 120 : 250;
    const collectionFrames = isMobile ? 96 : 240;
    const ctaFrames = isMobile ? 96 : 240;

    // Combined total frame count: Mobile = 648, Desktop = 1324
    const totalFrames =
      forestFrames + notesFrames + oceanFrames + storyFrames + amberFrames + collectionFrames + ctaFrames;

    const images = [];
    let currentFrame = 0;
    let targetFrame = 0;
    let animationFrameId = null;

    // ---------------------------------------------------------------------
    // Preload progress tracking. Every frame image is watched for its own
    // load/error settlement so completion is real, not assumed — previously
    // nothing tracked whether these ever finished, so a slow or failed
    // frame just silently never drew (blank canvas at that scroll position)
    // with no way for the rest of the app to know loading wasn't done.
    // Mirrors the same assetsProgress/assetsReady contract Interactive3DLayer
    // uses, so App.jsx can gate the preloader on both.
    // ---------------------------------------------------------------------
    let settledImageCount = 0;
    let hasEmittedReady = false;

    const emitBgProgress = () => {
      const pct = totalFrames > 0 ? Math.round((settledImageCount / totalFrames) * 100) : 100;
      emit('assetsProgress', Math.min(100, Math.max(0, pct)));
    };

    const handleImageSettled = () => {
      settledImageCount++;
      emitBgProgress();
      if (settledImageCount >= totalFrames && !hasEmittedReady) {
        hasEmittedReady = true;
        emit('assetsReady');
      }
    };

    // Attaches onload/onerror BEFORE assigning src, so an already-cached
    // image resolving synchronously can't fire before the handler exists.
    // onerror still counts toward completion — a single missing/broken
    // frame file should never be able to hang the preloader forever.
    const createTrackedImage = (src) => {
      const img = new Image();
      img.onload = handleImageSettled;
      img.onerror = handleImageSettled;
      img.src = src;
      return img;
    };

    const render = () => {
      const canvas = canvasRef.value;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      // Linear interpolation (lerp) for smooth motion
      currentFrame += (targetFrame - currentFrame) * 0.15;
      const frameToDraw = Math.min(
        Math.max(0, Math.round(currentFrame)),
        totalFrames - 1
      );

      const img = images[frameToDraw];
      if (img && img.complete && img.naturalWidth !== 0) {
        const ratio = Math.max(
          canvas.width / img.width,
          canvas.height / img.height
        );
        const shiftX = (canvas.width - img.width * ratio) / 2;
        const shiftY = (canvas.height - img.height * ratio) / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          shiftX,
          shiftY,
          img.width * ratio,
          img.height * ratio
        );
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const preloadAllImages = () => {
      if (totalFrames === 0) {
        emit('assetsProgress', 100);
        if (!hasEmittedReady) {
          hasEmittedReady = true;
          emit('assetsReady');
        }
        return;
      }

      const forestFolder = isMobile
        ? '/forest_essence/mobile'
        : '/forest_essence/laptop_and_desktop';
      const notesFolder = isMobile
        ? '/fragrance_notes/mobile'
        : '/fragrance_notes/laptop_and_desktop';
      const oceanFolder = isMobile
        ? '/ocean_bloom/mobile'
        : '/ocean_bloom/laptop_and_desktop';
      const storyFolder = isMobile
        ? '/aurelia_story/mobile'
        : '/aurelia_story/laptop_and_desktop';
      const amberFolder = isMobile
        ? '/golden_amber/mobile'
        : '/golden_amber/laptop_and_desktop';
      const collectionFolder = isMobile
        ? '/collection/mobile'
        : '/collection/laptop_and_desktop';
      const ctaFolder = isMobile
        ? '/cta/mobile'
        : '/cta/laptop_and_desktop';

      // 1. Forest Essence frames
      for (let i = 0; i < forestFrames; i++) {
        images.push(createTrackedImage(`${forestFolder}/${String(i + 1).padStart(4, '0')}.webp`));
      }

      // 2. Fragrance Notes frames
      for (let i = 0; i < notesFrames; i++) {
        images.push(createTrackedImage(`${notesFolder}/${String(i + 1).padStart(4, '0')}.webp`));
      }

      // 3. Ocean Bloom frames
      for (let i = 0; i < oceanFrames; i++) {
        images.push(createTrackedImage(`${oceanFolder}/${String(i + 1).padStart(4, '0')}.webp`));
      }

      // 4. Aurelia Story frames
      for (let i = 0; i < storyFrames; i++) {
        images.push(createTrackedImage(`${storyFolder}/${String(i + 1).padStart(4, '0')}.webp`));
      }

      // 5. Golden Amber frames
      for (let i = 0; i < amberFrames; i++) {
        images.push(createTrackedImage(`${amberFolder}/${String(i + 1).padStart(4, '0')}.webp`));
      }

      // 6. Collection frames
      for (let i = 0; i < collectionFrames; i++) {
        images.push(createTrackedImage(`${collectionFolder}/${String(i + 1).padStart(4, '0')}.webp`));
      }

      // 7. CTA frames
      for (let i = 0; i < ctaFrames; i++) {
        images.push(createTrackedImage(`${ctaFolder}/${String(i + 1).padStart(4, '0')}.webp`));
      }
    };

    const handleGlobalProgress = (e) => {
      const { progress } = e.detail;
      targetFrame = progress * (totalFrames - 1);
    };

    const handleResize = () => {
      if (!canvasRef.value) return;
      canvasRef.value.width = window.innerWidth;
      canvasRef.value.height = window.innerHeight;
    };

    onMounted(() => {
      preloadAllImages();
      handleResize();

      window.addEventListener('resize', handleResize);
      window.addEventListener('global-sequence-progress', handleGlobalProgress);

      render();
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('global-sequence-progress', handleGlobalProgress);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    });

    return () => (
      <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-transparent">
        <div class="bg-film-grain" />
        <div class="bg-vignette" />
        <canvas ref={canvasRef} class="w-full h-full block" />
      </div>
    );
  },
});