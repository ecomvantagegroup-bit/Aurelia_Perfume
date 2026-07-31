import { defineComponent, ref, onMounted, onUnmounted, nextTick } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import HeroSection from '../sections/hero/hero';
import ForestEssence from '../sections/forest_essence/forest_essence';
import FragranceNotes from '../sections/fragrance_notes/fragrance_notes';
import OceanBloom from '../sections/ocean_bloom/ocean_bloom';
import AureliaStory from '../sections/aurelia_story/aurelia_story';
import GoldenAmber from '../sections/golden_amber/amber';

gsap.registerPlugin(ScrollTrigger);

export default defineComponent({
  name: 'ContentLayer',
  setup() {
    const sequenceWrapperRef = ref(null);
    let triggerInstance = null;

    const initMasterSequence = () => {
      if (!sequenceWrapperRef.value) return;

      // Kill previous instance if re-initializing
      if (triggerInstance) {
        triggerInstance.kill();
      }

      // Master continuous trigger spanning Forest -> Notes -> Ocean -> AureliaStory -> GoldenAmber
      triggerInstance = ScrollTrigger.create({
        trigger: sequenceWrapperRef.value,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
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

      // Initialize the master continuous scroll trigger
      initMasterSequence();

      // Delay refresh slightly to allow child section triggers (pinning) to complete mounting
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    });

    onUnmounted(() => {
      if (triggerInstance) {
        triggerInstance.kill();
        triggerInstance = null;
      }
    });

    return () => (
      <div class="relative z-30 w-full pointer-events-auto">
        {/* 01 — Hero Section (Standalone Premium Style) */}
        <div id="sec-hero" class="relative z-10 bg-black text-amber-400">
          <HeroSection />
        </div>

        {/* 02-06 — Master Continuous Canvas Sequence Container */}
        <div ref={sequenceWrapperRef} class="relative w-full">
          <div id="sec-forest">
            <ForestEssence />
          </div>

          <div id="sec-notes">
            <FragranceNotes />
          </div>

          <div id="sec-ocean">
            <OceanBloom />
          </div>

          <div id="sec-story">
            <AureliaStory />
          </div>

          <div id="sec-amber">
            <GoldenAmber />
          </div>
        </div>
      </div>
    );
  },
});