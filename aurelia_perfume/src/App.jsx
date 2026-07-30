import { defineComponent, ref, onMounted, onUnmounted, nextTick } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// UI Overlays
import Preloader from './components/preloader/preloader';
import Navbar from './components/navbar/navbar';

// Layer Controllers
import BackgroundLayerController from './components/background_layer/BackgroundLayerController';
import Interactive3DLayer from './components/interactive-3d-layer/Interactive3DLayer';

// Section Components
import HeroSection from './components/sections/hero/hero';
import ForestEssence from './components/sections/forest_essence/forest_essence';
import FragranceNotes from './components/sections/fragrance_notes/fragrance_notes';
import OceanBloom from './components/sections/ocean_bloom/ocean_bloom';

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

        const trigger = ScrollTrigger.create({
          trigger: el,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => { activeSection.value = key; },
          onEnterBack: () => { activeSection.value = key; },
        });

        scrollTriggers.push(trigger);
      });
    };

    onMounted(async () => {
      await nextTick();
      initScrollTriggers();
      ScrollTrigger.refresh();
    });

    onUnmounted(() => {
      scrollTriggers.forEach((st) => st.kill());
      scrollTriggers = [];
    });

    return () => (
      <main class="relative min-h-screen w-full bg-background text-text selection:bg-primary selection:text-black overflow-x-hidden">
        {/* Preloader */}
        {isLoading.value && <Preloader onLoaded={handlePreloaderLoaded} />}

        {/* Background Canvas Layer */}
        <BackgroundLayerController activeSection={activeSection.value} />

        {/* 3D Scene Layer */}
        <Interactive3DLayer activeSection={activeSection.value} />

        {/* Foreground UI & Sections */}
        <div class="relative z-30 w-full pointer-events-auto">
          <Navbar activeSection={activeSection.value} />

          <div id="sec-hero">
            <HeroSection />
          </div>

          <div id="sec-forest">
            <ForestEssence />
          </div>

          <div id="sec-notes">
            <FragranceNotes />
          </div>

          <div id="sec-ocean">
            <OceanBloom />
          </div>
        </div>
      </main>
    );
  },
});