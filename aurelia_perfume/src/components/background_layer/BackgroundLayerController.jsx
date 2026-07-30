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

    // Circular Iris Transition on entry/exit of 'notes' section
    watch(
      () => props.activeSection,
      (newSection) => {
        if (!irisOverlayRef.value) return;

        gsap.to(irisOverlayRef.value, {
          clipPath: newSection === 'notes' ? 'circle(150% at 50% 50%)' : 'circle(0% at 50% 50%)',
          duration: newSection === 'notes' ? 1.2 : 1.0,
          ease: 'power3.inOut',
        });
      }
    );

    return () => (
      <div class="bg-layer-fixed relative w-full h-full">
        {/* Visual Overlays */}
        <div class="bg-film-grain" />
        <div class="bg-vignette" />

        {/* Modular Sequence Engines */}
        <ForestSequence isActive={props.activeSection === 'forest'} />
        <OceanSequence isActive={props.activeSection === 'ocean'} />
        <AmberSequence isActive={['amber', 'collection', 'cta'].includes(props.activeSection)} />

        {/* Black Transition Mask */}
        <div
          ref={irisOverlayRef}
          class="fixed inset-0 z-15 bg-[#08080a] pointer-events-none"
          style={{ clipPath: 'circle(0% at 50% 50%)' }}
        />
      </div>
    );
  },
});