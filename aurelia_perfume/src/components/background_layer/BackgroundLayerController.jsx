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
  setup() {
    const canvasRef = ref(null);
    const isMobile = window.innerWidth <= 768;

    // Frame specs per section
    const forestFrames = isMobile ? 120 : 250;
    const notesFrames = isMobile ? 192 : 384;
    const oceanFrames = isMobile ? 120 : 250;
    const storyFrames = isMobile ? 96 : 240;
    const amberFrames = isMobile ? 120 : 250;
    const collectionFrames = isMobile ? 96 : 240;

    // Combined total frame count: Mobile = 648, Desktop = 1324
    const totalFrames =
      forestFrames + notesFrames + oceanFrames + storyFrames + amberFrames + collectionFrames;

    const images = [];
    let currentFrame = 0;
    let targetFrame = 0;
    let animationFrameId = null;

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

      // 1. Forest Essence frames
      for (let i = 0; i < forestFrames; i++) {
        const img = new Image();
        img.src = `${forestFolder}/${String(i + 1).padStart(4, '0')}.webp`;
        images.push(img);
      }

      // 2. Fragrance Notes frames
      for (let i = 0; i < notesFrames; i++) {
        const img = new Image();
        img.src = `${notesFolder}/${String(i + 1).padStart(4, '0')}.webp`;
        images.push(img);
      }

      // 3. Ocean Bloom frames
      for (let i = 0; i < oceanFrames; i++) {
        const img = new Image();
        img.src = `${oceanFolder}/${String(i + 1).padStart(4, '0')}.webp`;
        images.push(img);
      }

      // 4. Aurelia Story frames
      for (let i = 0; i < storyFrames; i++) {
        const img = new Image();
        img.src = `${storyFolder}/${String(i + 1).padStart(4, '0')}.webp`;
        images.push(img);
      }

      // 5. Golden Amber frames
      for (let i = 0; i < amberFrames; i++) {
        const img = new Image();
        img.src = `${amberFolder}/${String(i + 1).padStart(4, '0')}.webp`;
        images.push(img);
      }

      // 6. Collection frames
      for (let i = 0; i < collectionFrames; i++) {
        const img = new Image();
        img.src = `${collectionFolder}/${String(i + 1).padStart(4, '0')}.webp`;
        images.push(img);
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