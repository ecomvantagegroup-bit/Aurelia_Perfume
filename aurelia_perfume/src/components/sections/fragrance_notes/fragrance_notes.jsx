import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './fragrance_notes.css';

gsap.registerPlugin(ScrollTrigger);

export default defineComponent({
  name: 'FragranceNotes',
  setup() {
    const containerRef = ref(null);
    const contentRef = ref(null);
    let revealTrigger = null;
    let progressTrigger = null;

    onMounted(() => {
      const sectionEl = containerRef.value;
      if (!sectionEl) return;

      // 1. Text reveal stagger animation
      const revealElements = sectionEl.querySelectorAll('.editorial-reveal');
      revealTrigger = ScrollTrigger.create({
        trigger: sectionEl,
        start: 'top 70%',
        onEnter: () => {
          gsap.fromTo(
            revealElements,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 1.2,
              stagger: 0.15,
              ease: 'power3.out',
              overwrite: 'auto',
            }
          );
        },
      });

      // 2. SCRUB TRIGGER: Dispatches scroll progress to FragranceSequence canvas
      progressTrigger = ScrollTrigger.create({
        trigger: sectionEl,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const detail = { progress: self.progress };
          // Dispatches both event formats to guarantee listener match
          window.dispatchEvent(
            new CustomEvent('fragrance-scroll-progress', { detail })
          );
          window.dispatchEvent(
            new CustomEvent('fragranceSequenceProgress', { detail })
          );
        },
      });
    });

    onUnmounted(() => {
      if (revealTrigger) revealTrigger.kill();
      if (progressTrigger) progressTrigger.kill();
    });

    return () => (
      <section
        ref={containerRef}
        /* Increased min-h to 250vh so the sequence has smooth scroll duration */
        class="notes-section-container relative z-30 min-h-[250vh] w-full flex items-center justify-center text-white px-8 py-24 select-none pointer-events-auto"
      >
        {/* Sticky content container so the text stays centered while scrolling through the sequence */}
        <div
          ref={contentRef}
          class="sticky top-0 h-screen max-w-xl w-full flex flex-col items-center justify-center text-center space-y-12"
        >
          {/* Section Header */}
          <div class="editorial-reveal space-y-3">
            <span class="text-[10px] md:text-xs font-mono tracking-[0.4em] text-emerald-400/80 uppercase">
              SPECIFICATION — 04
            </span>
            <h2 class="text-2xl md:text-4xl font-extralight tracking-[0.3em] uppercase text-white/90">
              FOREST ESSENCE
            </h2>
            <p class="text-[11px] md:text-xs tracking-[0.25em] font-light text-zinc-400 uppercase">
              Fresh / Botanical / Earthy
            </p>
          </div>

          <div class="editorial-reveal w-12 h-[1px] bg-zinc-800" />

          {/* Fragrance Pyramid - Editorial Layout */}
          <div class="w-full space-y-8">
            {/* TOP NOTE */}
            <div class="editorial-reveal flex flex-col items-center space-y-1">
              <span class="text-[9px] font-mono tracking-[0.35em] text-zinc-500 uppercase">
                01 / TOP NOTE
              </span>
              <span class="text-lg md:text-2xl font-light tracking-[0.2em] text-zinc-100 uppercase">
                Bergamot
              </span>
            </div>

            <div class="editorial-reveal w-full h-[1px] bg-zinc-900" />

            {/* HEART NOTE */}
            <div class="editorial-reveal flex flex-col items-center space-y-1">
              <span class="text-[9px] font-mono tracking-[0.35em] text-zinc-500 uppercase">
                02 / HEART NOTE
              </span>
              <span class="text-lg md:text-2xl font-light tracking-[0.2em] text-zinc-100 uppercase">
                Cedar Leaf
              </span>
            </div>

            <div class="editorial-reveal w-full h-[1px] bg-zinc-900" />

            {/* BASE NOTE */}
            <div class="editorial-reveal flex flex-col items-center space-y-1">
              <span class="text-[9px] font-mono tracking-[0.35em] text-zinc-500 uppercase">
                03 / BASE NOTE
              </span>
              <span class="text-lg md:text-2xl font-light tracking-[0.2em] text-zinc-100 uppercase">
                Moss
              </span>
            </div>
          </div>

          <div class="editorial-reveal w-12 h-[1px] bg-zinc-800" />

          {/* Footer Specifications */}
          <div class="editorial-reveal flex items-center justify-between w-full text-[9px] font-mono tracking-[0.2em] text-zinc-500 uppercase pt-4">
            <span>Vol. 100ML</span>
            <span>Eau De Parfum</span>
            <span>75% VOL.</span>
          </div>
        </div>
      </section>
    );
  },
});