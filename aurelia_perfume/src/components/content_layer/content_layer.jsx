import { defineComponent, ref, onMounted, onUnmounted, nextTick } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import HeroSection from '../sections/hero/hero';
import ForestEssence from '../sections/forest_essence/forest_essence';
import FragranceNotes from '../sections/fragrance_notes/fragrance_notes';
import OceanBloom from '../sections/ocean_bloom/ocean_bloom';
import AureliaStory from '../sections/aurelia_story/aurelia_story';
import GoldenAmber from '../sections/golden_amber/amber';
import Collection from '../sections/collection/collection';
import Cta from '../sections/cta/cta';
import Footer from '../sections/footer/footer';

gsap.registerPlugin(ScrollTrigger);

export default defineComponent({
  name: 'ContentLayer',
  setup() {
    const sequenceWrapperRef = ref(null);
    let triggerInstance = null;

    const initMasterSequence = () => {
      if (!sequenceWrapperRef.value) return;

      if (triggerInstance) triggerInstance.kill();

      // Master continuous trigger spanning image sequence sections (Forest -> CTA)
      triggerInstance = ScrollTrigger.create({
        trigger: sequenceWrapperRef.value,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          window.dispatchEvent(
            new CustomEvent('global-sequence-progress', {
              detail: { progress: self.progress },
            })
          );
        },
      });
    };

    onMounted(async () => {
      await nextTick();

      // Allow child section pins (e.g. CTA, Collection) to initialize first
      setTimeout(() => {
        initMasterSequence();
        ScrollTrigger.refresh();
      }, 200);
    });

    onUnmounted(() => {
      if (triggerInstance) {
        triggerInstance.kill();
        triggerInstance = null;
      }
    });

    return () => (
      /* Root Layer: Set pointer-events-none so raycasting hits 3D layer behind empty space */
      <div class="content-layer relative z-30 w-full pointer-events-none">
        {/* 01 — Standalone Hero */}
        <div id="sec-hero" class="relative z-10 bg-black text-amber-400 pointer-events-auto">
          <HeroSection />
        </div>

        {/* 02-09 — Master Continuous Canvas Sequence Container */}
        <div ref={sequenceWrapperRef} class="relative w-full">
          <div id="sec-forest" class="pointer-events-auto">
            <ForestEssence />
          </div>
          <div id="sec-notes" class="pointer-events-auto">
            <FragranceNotes />
          </div>
          <div id="sec-ocean" class="pointer-events-auto">
            <OceanBloom />
          </div>
          <div id="sec-story" class="pointer-events-auto">
            <AureliaStory />
          </div>
          <div id="sec-amber" class="pointer-events-auto">
            <GoldenAmber />
          </div>
          <div id="sec-collection" class="relative w-full pointer-events-auto">
            <Collection />
          </div>
          <div id="sec-cta" class="relative w-full pointer-events-auto">
            <Cta />
          </div>
        </div>

        {/* 10 — Standalone Footer */}
        <div id="sec-footer" class="relative z-20 w-full bg-[#050507] pointer-events-auto">
          <Footer />
        </div>
      </div>
    );
  },
});