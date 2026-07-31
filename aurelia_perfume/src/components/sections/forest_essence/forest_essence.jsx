import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './forest_essence.css';

gsap.registerPlugin(ScrollTrigger);

export default defineComponent({
  name: 'ForestEssence',
  emits: ['explore-notes'],
  setup(_, { emit }) {
    const sectionRef = ref(null);
    let ctx = null;

    onMounted(() => {
      const sectionEl = sectionRef.value || document.getElementById('sec-forest');
      if (!sectionEl) return;

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top top',
            end: '+=200%',
            pin: true,
            scrub: 0.5,
            onUpdate: (self) => {
              window.dispatchEvent(
                new CustomEvent('forest-scroll-progress', {
                  detail: { progress: self.progress, direction: self.direction },
                })
              );
            },
          },
        });

        tl.fromTo(
          '.forest-title-anim',
          { opacity: 0, y: 60, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out' }
        )
        .fromTo(
          '.forest-badge-anim',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' },
          '-=0.6'
        );
      }, sectionEl);

      ScrollTrigger.refresh();
    });

    onUnmounted(() => {
      if (ctx) ctx.revert();
    });

    return () => (
      <section
        ref={sectionRef}
        id="sec-forest"
        class="forest-section-container relative min-h-screen w-full flex items-center justify-center bg-transparent select-none overflow-hidden"
      >
        <div class="forest-content-wrapper text-center max-w-3xl z-20">
          <div class="forest-title-anim space-y-3 mb-6">
            <span class="forest-number-tag inline-block">01 — ESSENCE</span>
            <h2 class="forest-title">FOREST ESSENCE</h2>
          </div>

          <div class="forest-notes-container forest-badge-anim mb-10">
            <span class="forest-note-badge">Fresh</span>
            <span class="forest-note-separator">•</span>
            <span class="forest-note-badge">Botanical</span>
            <span class="forest-note-separator">•</span>
            <span class="forest-note-badge">Earthy</span>
          </div>

          <div class="forest-badge-anim">
            <button
              class="px-8 py-3 rounded-full border border-emerald-400/40 bg-emerald-950/20 text-emerald-200 text-xs font-mono uppercase tracking-widest backdrop-blur-md hover:bg-emerald-500/20 transition-all duration-300"
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