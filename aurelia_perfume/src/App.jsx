import { defineComponent, ref, onMounted, onUnmounted, nextTick } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// UI Overlays
import Preloader from './components/preloader/preloader';
import Navbar from './components/navbar/navbar';

// Layer 1: Background Canvas Engine (Image Sequences)
import BackgroundLayerController from './components/background_layer/BackgroundLayerController';

// Layer 2: Interactive Three.js Layer (3D Bottles & Particles)
import Interactive3DLayer from './components/interactive-3d-layer/Interactive3DLayer';

// Layer 3: Section Text & CTA Components
import HeroSection from './components/sections/hero/hero';
import ForestEssence from './components/sections/forest_essence/forest_essence';
import FragranceNotes from './components/sections/fragrance_notes/fragrance_notes';
import OceanBloom from './components/sections/ocean_bloom/ocean_bloom';
/*
import AureliaStory from './components/sections/AureliaStory';
import GoldenAmber from './components/sections/GoldenAmber';
import CollectionSection from './components/sections/CollectionSection';
import FinalCTA from './components/sections/FinalCTA';
import FooterSection from './components/sections/FooterSection';
*/

gsap.registerPlugin(ScrollTrigger);

export default defineComponent({
  name: 'App',
  setup() {
    const isLoading = ref(true);
    const activeSection = ref('hero'); 
    let scrollTriggers = [];

    // Fired when preloader finishes initial asset loading
    const handlePreloaderLoaded = () => {
      isLoading.value = false;
      nextTick(() => {
        ScrollTrigger.refresh();
      });
    };

    const initScrollTriggers = () => {
      scrollTriggers.forEach((st) => st.kill());
      scrollTriggers = [];

      const sections = [
        { id: 'sec-hero', key: 'hero' },
        { id: 'sec-forest', key: 'forest' }, 
        { id: 'sec-notes', key: 'notes' },
        { id: 'sec-ocean', key: 'ocean' },
        /*
        { id: 'sec-story', key: 'story' },
        { id: 'sec-amber', key: 'amber' },
        { id: 'sec-collection', key: 'collection' },
        { id: 'sec-cta', key: 'cta' },
        { id: 'sec-footer', key: 'footer' },
        */
      ];

      sections.forEach(({ id, key }) => {
        const el = document.getElementById(id);
        if (!el) return;

        const trigger = ScrollTrigger.create({
          trigger: el,
          start: 'top 50%',
          end: 'bottom 50%',
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
      ScrollTrigger.refresh();
    });

    onUnmounted(() => {
      scrollTriggers.forEach((st) => st.kill());
      scrollTriggers = [];
    });

    return () => (
      <main class="relative min-h-screen w-full bg-background text-text selection:bg-primary selection:text-black overflow-x-hidden">
        
        {/* =========================================================
            TOP LEVEL OVERLAY: PRELOADER (z-50)
            Shown on initial load, fades away when assets are ready.
           ========================================================= */}
        {isLoading.value && <Preloader onLoaded={handlePreloaderLoaded} />}

        {/* =========================================================
            LAYER 1: BACKGROUND ENGINE (z-10)
            Controls image sequences (Forest, Ocean, Amber) & overlays
           ========================================================= */}
        <BackgroundLayerController activeSection={activeSection.value} />

        {/* =========================================================
            LAYER 2: INTERACTIVE 3D LAYER (z-20)
            3D Bottles, lighting, floating leaf/bubble particles
           ========================================================= */}
        <Interactive3DLayer activeSection={activeSection.value} />

        {/* =========================================================
            LAYER 3: DOM TEXT, NAVBAR & CTAs (z-30)
            Interactive foreground UI
           ========================================================= */}
        <div class="relative z-30 w-full pointer-events-auto">
          
          {/* Fixed Navbar persistent across all sections */}
          <Navbar activeSection={activeSection.value} />

          {/* 02 - Hero */}
          <div id="sec-hero">
            <HeroSection />
          </div>

          {/* 03 - Forest Essence */}
          <div id="sec-forest">
            <ForestEssence />
          </div>

          {/* 04 - Fragrance Notes */}
          <div id="sec-notes">
            <FragranceNotes />
          </div>
          

          {/* 05 - Ocean Bloom */} 
          <div id="sec-ocean">
            <OceanBloom />
          </div>
          

          {/* 06 - Aurelia Story */}
          {/* 
          <div id="sec-story">
            <AureliaStory />
          </div>
          */}

          {/* 07 - Golden Amber */}
          {/* 
          <div id="sec-amber">
            <GoldenAmber />
          </div>
          */}

          {/* 08 - The Collection */}
          {/* 
          <div id="sec-collection">
            <CollectionSection />
          </div>
          */}

          {/* 09 - Final CTA */}
          {/* 
          <div id="sec-cta">
            <FinalCTA />
          </div>
          */}

          {/* 10 - Footer */}
          {/* 
          <div id="sec-footer">
            <FooterSection />
          </div>
          */}
        </div>
      </main>
    );
  },
});