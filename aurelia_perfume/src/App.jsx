import { defineComponent, ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Layer Controllers & System Overlays
import Preloader from './components/preloader/preloader';
import Navbar from './components/navbar/navbar';
import BackgroundLayerController from './components/background_layer/BackgroundLayerController';
import Interactive3DLayer from './components/interactive-3d-layer/Interactive3DLayer';

// Content Layer
import ContentLayer from './components/content_layer/content_layer';

gsap.registerPlugin(ScrollTrigger);

export default defineComponent({
  name: 'App',
  setup() {
    const isLoading = ref(true);
    const activeSection = ref('hero');
    let scrollTriggers = [];

    // Real asset loading state from each layer that has something to
    // preload. Interactive3DLayer reports models/textures/shaders;
    // BackgroundLayerController reports its image-sequence frames. The
    // Preloader is only told the experience is "ready" once every layer
    // that reported in has finished — combining them here instead of
    // wiring the Preloader to just one layer.
    const assetsProgress = ref(0);
    const assetsReady = ref(false);

    const bgProgress = ref(0);
    const bgReady = ref(false);

    const combinedProgress = computed(() => Math.round((assetsProgress.value + bgProgress.value) / 2));
    const combinedReady = computed(() => assetsReady.value && bgReady.value);

    const handlePreloaderLoaded = () => {
      isLoading.value = false;
      nextTick(() => {
        ScrollTrigger.refresh();
      });
    };

    const handleAssetsProgress = (percent) => {
      assetsProgress.value = percent;
    };

    const handleAssetsReady = () => {
      assetsReady.value = true;
    };

    const handleBgProgress = (percent) => {
      bgProgress.value = percent;
    };

    const handleBgReady = () => {
      bgReady.value = true;
    };

    const initScrollTriggers = () => {
      scrollTriggers.forEach((st) => st.kill());
      scrollTriggers = [];

      const sections = [
        { id: 'sec-hero', key: 'hero' },
        { id: 'sec-forest', key: 'forest' },
        { id: 'sec-notes', key: 'notes' },
        { id: 'sec-ocean', key: 'ocean' },
        { id: 'sec-story', key: 'story' },
        { id: 'sec-amber', key: 'amber' },
        { id: 'sec-collection', key: 'collection' },
        { id: 'sec-cta', key: 'cta' },
        { id: 'sec-footer', key: 'footer' },
      ];

      sections.forEach(({ id, key }) => {
        const el = document.getElementById(id);
        if (!el) return;

        const isCollection = key === 'collection';

        const trigger = ScrollTrigger.create({
          trigger: el,
          start: isCollection ? 'top top' : 'top 50%',
          end: isCollection ? 'bottom top' : 'bottom 50%',
          onEnter: () => {
            activeSection.value = key;
          },
          onEnterBack: () => {
            activeSection.value = key;
          },
        });

        scrollTriggers.push(trigger);
      });
    };

    onMounted(async () => {
      await nextTick();
      initScrollTriggers();

      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    });

    onUnmounted(() => {
      scrollTriggers.forEach((st) => st.kill());
      scrollTriggers = [];
    });

    return () => (
      <main class="relative min-h-screen w-full bg-background text-text selection:bg-primary selection:text-black overflow-x-hidden">
        {/* System Overlays */}
        {isLoading.value && (
          <Preloader
            progress={combinedProgress.value}
            ready={combinedReady.value}
            onLoaded={handlePreloaderLoaded}
          />
        )}
        <Navbar activeSection={activeSection.value} class="z-50" />

        {/* Layer 1: Background Controller */}
        <div class="fixed inset-0 z-0 pointer-events-none">
          <BackgroundLayerController
            activeSection={activeSection.value}
            onAssetsProgress={handleBgProgress}
            onAssetsReady={handleBgReady}
          />
        </div>

        {/* Layer 2: 3D Canvas Container */}
        <div class="fixed inset-0 z-20 pointer-events-none">
          <Interactive3DLayer
            activeSection={activeSection.value}
            onAssetsProgress={handleAssetsProgress}
            onAssetsReady={handleAssetsReady}
          />
        </div>

        {/* Layer 3: HTML Content Layer (Text, Buttons, Cards) */}
        <div class="relative z-30 pointer-events-none">
          <ContentLayer />
        </div>
      </main>
    );
  },
});