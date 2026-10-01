import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { loadSequences, frameUrl } from '@/utils/dataLoader';
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

        // Device class + frame total are resolved once sequences.json is read
        // (the mobile breakpoint lives in that file). 768 is only the default.
        let isMobile = window.innerWidth <= 768;
        let totalFrames = 0;

        const images = [];
        let currentFrame = 0;
        let targetFrame = 0;
        let animationFrameId = null;
        let disposed = false;

        // ---------------------------------------------------------------------
        // Preload progress tracking. Every frame image is watched for its own
        // load/error settlement so completion is real, not assumed. Mirrors the
        // same assetsProgress/assetsReady contract Interactive3DLayer uses, so
        // App.jsx can gate the preloader on both.
        // ---------------------------------------------------------------------
        let settledImageCount = 0;
        let hasEmittedReady = false;

        const emitReadyOnce = () => {
            if (hasEmittedReady) return;
            hasEmittedReady = true;
            emit('assetsReady');
        };

        const emitBgProgress = () => {
            const pct = totalFrames > 0 ? Math.round((settledImageCount / totalFrames) * 100) : 100;
            emit('assetsProgress', Math.min(100, Math.max(0, pct)), settledImageCount, totalFrames);
        };

        const handleImageSettled = () => {
            settledImageCount++;
            emitBgProgress();
            if (settledImageCount >= totalFrames) emitReadyOnce();
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

            // Nothing to draw until sequences.json has been read and frames exist.
            if (totalFrames > 0) {
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
            }

            animationFrameId = requestAnimationFrame(render);
        };

        // Turns sequences.json into one ordered list of frame URLs. Order in the
        // JSON "sequences" array is the order of the combined scroll timeline.
        const buildFrameUrls = (config) => {
            const options = {
                extension: config.extension || 'webp',
                padLength: config.padLength ?? 4,
                startIndex: config.startIndex ?? 1,
            };
            const device = isMobile ? 'mobile' : 'desktop';
            const urls = [];

            (config.sequences || []).forEach((seq) => {
                const count = seq.frames?.[device] ?? 0;
                const folder = seq.folders?.[device];
                if (!folder) return;
                for (let i = 0; i < count; i++) {
                    urls.push(frameUrl(folder, i, options));
                }
            });

            return urls;
        };

        const preloadAllImages = async () => {
            let frameUrls = [];

            try {
                const config = await loadSequences();
                if (disposed) return;
                isMobile = window.innerWidth <= (config.mobileMaxWidth ?? 768);
                frameUrls = buildFrameUrls(config);
            } catch (err) {
                // Never leave the preloader hanging because a JSON file is missing.
                console.error('[BackgroundLayerController] Failed to load data/sequences.json:', err);
            }

            totalFrames = frameUrls.length;

            if (totalFrames === 0) {
                emit('assetsProgress', 100);
                emitReadyOnce();
                return;
            }

            // Report the real total up front so the preloader can show "0 / N".
            emitBgProgress();

            frameUrls.forEach((url) => {
                images.push(createTrackedImage(url));
            });
        };

        const handleGlobalProgress = (e) => {
            const { progress } = e.detail;
            targetFrame = progress * Math.max(0, totalFrames - 1);
        };

        const handleResize = () => {
            if (!canvasRef.value) return;
            canvasRef.value.width = window.innerWidth;
            canvasRef.value.height = window.innerHeight;
        };

        onMounted(() => {
            handleResize();

            window.addEventListener('resize', handleResize);
            window.addEventListener('global-sequence-progress', handleGlobalProgress);

            preloadAllImages();
            render();
        });

        onUnmounted(() => {
            disposed = true;
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