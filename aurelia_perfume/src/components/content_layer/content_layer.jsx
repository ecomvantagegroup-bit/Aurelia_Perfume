import { defineComponent } from 'vue';
import HeroSection from '../sections/hero/hero';
import ForestEssence from '../sections/forest_essence/forest_essence';
import FragranceNotes from '../sections/fragrance_notes/fragrance_notes';
import OceanBloom from '../sections/ocean_bloom/ocean_bloom';

export default defineComponent({
  name: 'ContentLayer',
  setup() {
    return () => (
      <div class="relative z-30 w-full pointer-events-auto">
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
    );
  },
});