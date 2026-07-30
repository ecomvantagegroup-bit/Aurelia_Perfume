import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './forest_essence.css';

gsap.registerPlugin(ScrollTrigger);

export default defineComponent({
  name: 'ForestEssence',
  emits: ['explore-notes'],
  setup(_, { emit }) {
    const contentRef = ref(null);
    const numberRef = ref(null);
    const titleRef = ref(null);
    const notesRef = ref(null);

    let scrollTriggerInstance = null;

    onMounted(() => {
      const sectionEl = document.getElementById('world1');
      if (!sectionEl) return;

      // Pin Section & Sync Scroll Progress Event to Layer 1 (Background Sequence) & Layer 2 (3D Model)
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: sectionEl,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          // Dispatch custom event so BackgroundLayerController syncs sequence frames automatically
          window.dispatchEvent(
            new CustomEvent('forest-scroll-progress', {
              detail: {
                progress: self.progress,
                direction: self.direction,
              },
            })
          );
        },
      });

      // Typography entrance animation
      gsap.fromTo(
        [numberRef.value, titleRef.value, notesRef.value],
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top 60%',
          },
        }
      );
    });

    onUnmounted(() => {
      if (scrollTriggerInstance) scrollTriggerInstance.kill();
    });

    return () => (
      <section id="world1" class="forest-section-container relative z-30 pointer-events-auto min-h-screen flex items-center justify-center">
        {/* DOM Content Layer Only */}
        <div ref={contentRef} class="forest-content-wrapper text-center">
          <div ref={numberRef} class="forest-number-tag">
            01
          </div>

          <h2 ref={titleRef} class="forest-title">
            FOREST ESSENCE
          </h2>

          <div ref={notesRef} class="forest-notes-container">
            <span class="forest-note-badge">Fresh</span>
            <span class="forest-note-separator">•</span>
            <span class="forest-note-badge">Botanical</span>
            <span class="forest-note-separator">•</span>
            <span class="forest-note-badge">Earthy</span>
          </div>

          <div class="mt-10">
            <button
              class="btn btn-outline hover:border-emerald-500/50 hover:text-emerald-300"
              onClick={() => emit('explore-notes')}
            >
              Discover Fragrance Notes
            </button>
          </div>
        </div>
      </section>
    );
  },
});