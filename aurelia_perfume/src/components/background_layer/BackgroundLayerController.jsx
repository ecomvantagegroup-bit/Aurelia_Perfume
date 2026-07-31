import { defineComponent } from 'vue';

import ForestSequence from './sequences/forestSequence';
import FragranceSequence from './sequences/fragranceSequence';
import OceanSequence from './sequences/OceanSequence';
import AmberSequence from './sequences/amberSequence';

import './background_layer.css';

export default defineComponent({
  name: 'BackgroundLayerController',
  props: {
    activeSection: {
      type: String,
      default: 'hero',
    },
  },
  setup(props) {
    return () => {
      const { activeSection } = props;

      const isForest = activeSection === 'forest';
      const isNotes = activeSection === 'notes';
      const isOcean = activeSection === 'ocean';
      const isAmber = activeSection === 'amber';

      return (
        <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-transparent">
          {/* Base Atmosphere Overlays */}
          <div class="bg-film-grain" />
          <div class="bg-vignette" />

          {/* 03 — Forest Essence Sequence */}
          <div
            class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: isForest ? 1 : 0 }}
          >
            <ForestSequence isActive={isForest} />
          </div>

          {/* 04 — Fragrance Notes Sequence (Replaces Iris Mask between Forest & Ocean) */}
          <div
            class="absolute inset-0 transition-opacity duration-1000 ease-in-out z-0"
            style={{ opacity: isNotes ? 1 : 0 }}
          >
            <FragranceSequence isActive={isNotes} />
          </div>

          {/* 05 — Ocean Bloom Sequence */}
          <div
            class="absolute inset-0 transition-opacity duration-1000 ease-in-out z-0"
            style={{ opacity: isOcean ? 1 : 0 }}
          >
            <OceanSequence isActive={isOcean} />
          </div>

          {/* 06 — Amber Sequence */}
          <div
            class="absolute inset-0 transition-opacity duration-1000 ease-in-out z-0"
            style={{ opacity: isAmber ? 1 : 0 }}
          >
            <AmberSequence isActive={isAmber} />
          </div>
        </div>
      );
    };
  },
});