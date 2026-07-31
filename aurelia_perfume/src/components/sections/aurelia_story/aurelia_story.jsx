import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './aurelia_story.css';

gsap.registerPlugin(ScrollTrigger);

export default defineComponent({
  name: 'StorySection',
  setup() {
    const containerRef = ref(null);
    let revealTrigger = null;

    onMounted(() => {
      const sectionEl = containerRef.value;
      if (!sectionEl) return;

      const revealElements = sectionEl.querySelectorAll('.story-reveal');

      revealTrigger = ScrollTrigger.create({
        trigger: sectionEl,
        start: 'top 65%',
        onEnter: () => {
          gsap.fromTo(
            revealElements,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 1.2,
              stagger: 0.2,
              ease: 'power3.out',
              overwrite: 'auto',
            }
          );
        },
      });
    });

    onUnmounted(() => {
      if (revealTrigger) revealTrigger.kill();
    });

    return () => (
      <section
        ref={containerRef}
        class="story-section-container relative z-30 min-h-[250vh] w-full flex items-center justify-center text-white px-6 md:px-12 py-24 select-none pointer-events-auto bg-transparent"
      >
        {/* Sticky viewport frame to anchor editorial text while scrolling through sequence */}
        <div class="sticky top-0 h-screen max-w-2xl w-full flex flex-col items-center justify-center text-center space-y-12">
          {/* Section Identification */}
          <div class="story-reveal space-y-2">
            <span class="text-[10px] md:text-xs font-mono tracking-[0.4em] text-amber-400/80 uppercase">
              06 — AURELIA STORY
            </span>
            <p class="text-[11px] md:text-xs tracking-[0.25em] font-light text-zinc-400 uppercase">
              A visual breathing point
            </p>
          </div>

          <div class="story-reveal w-12 h-[1px] bg-zinc-800" />

          {/* Main Statement */}
          <div class="story-reveal space-y-4">
            <h2 class="text-xl md:text-3xl font-extralight tracking-[0.2em] text-zinc-100 uppercase leading-snug">
              A fragrance is more than a scent.
            </h2>
            <div class="space-y-1 text-sm md:text-lg font-light tracking-[0.25em] text-zinc-400 uppercase">
              <p>It is a place.</p>
              <p>A memory.</p>
              <p>A moment that stays.</p>
            </div>
          </div>

          <div class="story-reveal w-12 h-[1px] bg-zinc-800" />

          {/* Brand Story */}
          <div class="story-reveal space-y-3 max-w-lg">
            <span class="text-[9px] md:text-[10px] font-mono tracking-[0.35em] text-zinc-500 uppercase">
              BRAND STORY
            </span>
            <h3 class="text-sm md:text-base font-light tracking-[0.3em] text-amber-200/90 uppercase">
              THE AURELIA HOUSE
            </h3>
            <p class="text-xs md:text-sm font-extralight tracking-[0.18em] leading-relaxed text-zinc-300 uppercase">
              Aurelia creates fragrances inspired by places, memories and moments
              that remain long after the first impression.
            </p>
          </div>
        </div>
      </section>
    );
  },
});