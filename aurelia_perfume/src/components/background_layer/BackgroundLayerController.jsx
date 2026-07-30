import { defineComponent, computed, ref, watch, onMounted } from 'vue';
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

    const isForestActive = computed(() => ['forest'].includes(props.activeSection));
    const isOceanActive = computed(() => props.activeSection === 'ocean');
    const isAmberActive = computed(() => ['amber', 'collection', 'cta'].includes(props.activeSection));

    // Handle Iris Circular Expansion for Fragrance Notes Section
    watch(
      () => props.activeSection,
      (newSection) => {
        if (!irisOverlayRef.value) return;

        if (newSection === 'notes') {
          // Circular expand from center to full black
          gsap.to(irisOverlayRef.value, {
            clipPath: 'circle(150% at 50% 50%)',
            duration: 1.2,
            ease: 'power3.inOut',
          });
        } else {
          // Collapse circular mask back
          gsap.to(irisOverlayRef.value, {
            clipPath: 'circle(0% at 50% 50%)',
            duration: 1.0,
            ease: 'power3.inOut',
          });
        }
      }
    );

    return () => (
      <div class="bg-layer-fixed relative w-full h-full">
        {/* Film grain and vignette overlays */}
        <div class="bg-film-grain" />
        <div class="bg-vignette" />

        {/* Modular Sequence Engines */}
        <ForestSequence isActive={isForestActive.value} />
        <OceanSequence isActive={isOceanActive.value} />
        <AmberSequence isActive={isAmberActive.value} />

        {/* Circular Transition Layer for Fragrance Notes Section */}
        <div
          ref={irisOverlayRef}
          class="fixed inset-0 z-15 bg-[#08080a] pointer-events-none"
          style={{ clipPath: 'circle(0% at 50% 50%)' }}
        />
      </div>
    );
  },
});