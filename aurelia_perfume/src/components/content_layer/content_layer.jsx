import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
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

    onMounted(() => {
      if (!sequenceWrapperRef.value) return;

      // Master continuous trigger spanning Forest -> Notes -> Ocean -> AureliaStory
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
    });

    onUnmounted(() => {
      if (triggerInstance) triggerInstance.kill();
    });

    return () => (
      <div class="relative z-30 w-full pointer-events-auto">
        {/* 01 — Hero Section (Standalone Premium Black & Gold style) */}
        <div id="sec-hero" class="relative z-10 bg-black text-amber-400">
          <HeroSection />
        </div>

        {/* 02-05 — Master Continuous Canvas Sequence Container */}
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