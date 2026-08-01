import { defineComponent, ref, onMounted, onUnmounted, nextTick } from 'vue';
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

    const handlePreloaderLoaded = () => {
      isLoading.value = false;
      nextTick(() => {
        ScrollTrigger.refresh();
      });
    };

    const initScrollTriggers = () => {
      // Clear previous triggers safely
      scrollTriggers.forEach((st) => st.kill());
      scrollTriggers = [];

      // Array matching all sections rendered inside ContentLayer
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

      // Refresh layout measurements after child component DOM nodes settle
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
        {/* Preloader Screen */}
        {isLoading.value && <Preloader onLoaded={handlePreloaderLoaded} />}

        {/* Global Navigation */}
        <Navbar activeSection={activeSection.value} />

        {/* 1. Background Image Sequence & Atmosphere Layer */}
        <BackgroundLayerController activeSection={activeSection.value} />

        {/* 2. Interactive WebGL / 3D Canvas Layer */}
        {/*<Interactive3DLayer activeSection={activeSection.value} />*/}

        {/* 3. HTML Content & DOM Layout Layer */}
        <ContentLayer />
      </main>
    );
  },
});