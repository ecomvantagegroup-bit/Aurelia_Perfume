import { defineComponent, ref, watch } from 'vue';
import gsap from 'gsap';
import ForestSequence from './sequences/forestSequence';
import OceanSequence from './sequences/OceanSequence';
import AmberSequence from './sequences/AmberSequence';
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

    // Circular Iris Expand/Shrink Transition on enter/exit of Fragrance Notes section
    watch(
      () => props.activeSection,
      (newSection) => {
        if (!irisOverlayRef.value) return;

        if (newSection === 'notes') {
          gsap.to(irisOverlayRef.value, {
            clipPath: 'circle(150% at 50% 50%)',
            duration: 1.2,
            ease: 'power3.inOut',
          });
        } else {
          gsap.to(irisOverlayRef.value, {
            clipPath: 'circle(0% at 50% 50%)',
            duration: 1.0,
            ease: 'power3.inOut',
          });
        }
      }
    );

    return () => {
      // Evaluate active flags inside the render function so Vue tracks reactivity properly
      const isForestActive = ['forest'].includes(props.activeSection);
      const isOceanActive = props.activeSection === 'ocean';
      const isAmberActive = ['amber', 'collection', 'cta'].includes(props.activeSection);

      return (
        <div class="bg-layer-fixed relative w-full h-full">
          {/* Film grain and vignette overlays */}
          <div class="bg-film-grain" />
          <div class="bg-vignette" />

          {/* Modular Sequence Engines */}
          <ForestSequence isActive={isForestActive} />
          <OceanSequence isActive={isOceanActive} />
          <AmberSequence isActive={isAmberActive} />

          {/* Circular Mask Overlay for Section 04 Editorial Black Transition */}
          <div
            ref={irisOverlayRef}
            class="fixed inset-0 z-15 bg-[#08080a] pointer-events-none"
            style={{ clipPath: 'circle(0% at 50% 50%)' }}
          />
        </div>
      );
    };
  },
});