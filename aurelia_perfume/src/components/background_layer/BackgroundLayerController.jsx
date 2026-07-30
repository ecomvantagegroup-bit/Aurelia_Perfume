// src/components/background_layer/BackgroundLayerController.jsx
import { defineComponent, computed } from 'vue';
import ForestSequence from './sequences/forestSequence';
import OceanSequence from './sequences/OceanSequence';
import AmberSequence from './sequences/AmberSequence';
import './background_layer.css';

export default defineComponent({
  name: 'BackgroundLayerController',
  props: {
    activeSection: {
      type: String,
      default: 'hero', // 'hero' | 'forest' | 'notes' | 'ocean' | 'story' | 'amber' | 'collection' | 'cta' | 'footer'
    },
  },
  setup(props) {
    // Map active section to appropriate sequence component
    const isForestActive = computed(() => ['forest', 'notes'].includes(props.activeSection));
    const isOceanActive = computed(() => props.activeSection === 'ocean'); // 'story' dissolves to pure black
    const isAmberActive = computed(() => ['amber', 'collection', 'cta'].includes(props.activeSection));

    return () => (
      <div class="bg-layer-fixed">
        {/* Film grain and vignette overlays */}
        <div class="bg-film-grain" />
        <div class="bg-vignette" />

        {/* Modular Sequence Engines */}
        <ForestSequence isActive={isForestActive.value} />
        <OceanSequence isActive={isOceanActive.value} />
        <AmberSequence isActive={isAmberActive.value} />
      </div>
    );
  },
});