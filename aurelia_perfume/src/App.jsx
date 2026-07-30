import { defineComponent, ref, onMounted, onUnmounted, nextTick } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Layer Controllers & Direct Overlays
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
      nextTick(() => ScrollTrigger.refresh());
    };

    const initScrollTriggers = () => {
      // Clear out previous triggers if re-initialized
      scrollTriggers.forEach((st) => st.kill());
      scrollTriggers = [];

      const sections = [
        { id: 'sec-hero', key: 'hero' },
        { id: 'sec-forest', key: 'forest' },
        { id: 'sec-notes', key: 'notes' },
        { id: 'sec-ocean', key: 'ocean' },
      ];

      sections.forEach(({ id, key }) => {
        const el = document.getElementById(id);
        if (!el) return;

        // Custom trigger offsets so the last section ('ocean') registers accurately 
        // even if the page doesn't scroll past 50% viewport height.
        const isOcean = key === 'ocean';
        const startPoint = isOcean ? 'top 85%' : 'top 50%';
        const endPoint = isOcean ? 'bottom bottom' : 'bottom 50%';

        const trigger = ScrollTrigger.create({
          trigger: el,
          start: startPoint,
          end: endPoint,
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
      
      // Secondary refresh after fonts & images lay out completely
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
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
        <Navbar />

        {/* 1. Background Image Sequence & Atmosphere Layer */}
        <BackgroundLayerController activeSection={activeSection.value} />

        {/* 2. Interactive WebGL / 3D Canvas Layer */}
        <Interactive3DLayer activeSection={activeSection.value} />

        {/* 3. HTML Content & DOM Layout Layer */}
        <ContentLayer />
      </main>
    );
  },
});