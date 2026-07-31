import { defineComponent, ref, watch, onMounted, onUnmounted } from 'vue';

export default defineComponent({
  name: 'FragranceSequence',
  props: {
    isActive: Boolean,
  },
  setup(props) {
    const canvasRef = ref(null);
    const isMobile = window.innerWidth <= 768;
    const totalFrames = isMobile ? 120 : 250;
    const folder = isMobile
      ? '/fragrance_notes/mobile'
      : '/fragrance_notes/laptop_and_desktop';

    let images = [];
    let currentFrame = 0;

    const renderFrame = (index) => {
      const canvas = canvasRef.value;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = images[Math.floor(index)];
      if (img && img.complete && img.naturalWidth !== 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const ratio = Math.max(
          canvas.width / img.width,
          canvas.height / img.height
        );
        const shiftX = (canvas.width - img.width * ratio) / 2;
        const shiftY = (canvas.height - img.height * ratio) / 2;

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
    };

    const preload = () => {
      images = [];
      for (let i = 0; i < totalFrames; i++) {
        const img = new Image();
        const paddedIndex = String(i + 1).padStart(4, '0');
        // Check if your extension is .webp or .jpg in public/fragrance_notes
        img.src = `${folder}/${paddedIndex}.webp`;

        if (i === 0) {
          img.onload = () => {
            renderFrame(0);
          };
        }
        images.push(img);
      }
    };

    const handleProgress = (e) => {
      if (!props.isActive) return;
      const { progress } = e.detail;
      currentFrame = progress * (totalFrames - 1);
      renderFrame(currentFrame);
    };

    const handleResize = () => {
      if (!canvasRef.value) return;
      canvasRef.value.width = window.innerWidth;
      canvasRef.value.height = window.innerHeight;
      renderFrame(currentFrame);
    };

    // Repaint on section activation
    watch(
      () => props.isActive,
      (active) => {
        if (active) {
          handleResize();
          renderFrame(currentFrame);
        }
      }
    );

    onMounted(() => {
      preload();
      handleResize();
      window.addEventListener('resize', handleResize);
      window.addEventListener('fragranceSequenceProgress', handleProgress);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('fragranceSequenceProgress', handleProgress);
    });

    return () => (
      <canvas
        ref={canvasRef}
        class="w-full h-full block"
      />
    );
  },
});