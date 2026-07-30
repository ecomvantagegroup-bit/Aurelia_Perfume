import { defineComponent, ref, watch } from 'vue';
import gsap from 'gsap';

import ForestSequence from './sequences/forestSequence';
import OceanSequence from './sequences/OceanSequence';

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
    const irisOverlayRef = ref(null);

    // Watch section changes to trigger Iris mask between Forest and Ocean
    watch(
      () => props.activeSection,
      (newSection) => {
        if (!irisOverlayRef.value) return;

        // The Iris overlay expands exclusively during Section 04 (Fragrance Notes),
        // acting as a dark editorial bridge between Forest Essence and Ocean Bloom.
        const isNotesBridge = newSection === 'notes';

        gsap.to(irisOverlayRef.value, {
          clipPath: isNotesBridge
            ? 'circle(150% at 50% 50%)'
            : 'circle(0% at 50% 50%)',
          duration: isNotesBridge ? 1.2 : 0.9,
          ease: 'power3.inOut',
        });
      },
      { immediate: true }
    );

    return () => {
      const { activeSection } = props;

      const isForest = activeSection === 'forest';
      const isOcean = activeSection === 'ocean';

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

          {/* 04 — Editorial Iris Overlay (Acts as transition bridge between Forest and Ocean) */}
          <div
            ref={irisOverlayRef}
            class="fixed inset-0 z-10 bg-[#08080a]"
            style={{ clipPath: 'circle(0% at 50% 50%)' }}
          />

          {/* 05 — Ocean Bloom Sequence */}
          <div
            class="absolute inset-0 transition-opacity duration-1000 ease-in-out z-0"
            style={{ opacity: isOcean ? 1 : 0 }}
          >
            <OceanSequence isActive={isOcean} />
          </div>
        </div>
      );
    };
  },
});