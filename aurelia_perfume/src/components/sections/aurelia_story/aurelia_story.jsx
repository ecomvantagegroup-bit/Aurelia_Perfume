import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './aurelia_story.css';

gsap.registerPlugin(ScrollTrigger);

export default defineComponent({
  name: 'StorySection',
  setup() {
    const containerRef = ref(null);
    const contentRef = ref(null);

    let scrollTriggerInstance = null;

    onMounted(() => {
      const sectionEl = document.getElementById('sec-story');
      if (!sectionEl) return;

      // Pin story content centered on screen while scrolling
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: sectionEl,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 0.5,
      });

      // Entry reveal animation
      if (contentRef.value) {
        gsap.fromTo(
          contentRef.value.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: 'power3.out',
            delay: 0.2,
          }
        );
      }

      ScrollTrigger.refresh();
    });

    onUnmounted(() => {
      if (scrollTriggerInstance) scrollTriggerInstance.kill();
    });

    return () => (
      <section
        ref={containerRef}
        id="world-story"
        class="story-section-container relative min-h-screen w-full flex items-center justify-center text-white px-6 md:px-12 bg-transparent select-none pointer-events-none"
      >
        <div
          ref={contentRef}
          class="max-w-2xl w-full flex flex-col items-center justify-center text-center space-y-10 z-10"
        >
          {/* Section Identification */}
          <div class="space-y-2">
            <span class="text-xs font-mono tracking-[0.4em] text-amber-400/80 uppercase">
              06 — AURELIA STORY
            </span>
            <p class="text-[11px] md:text-xs tracking-[0.25em] font-light text-zinc-400 uppercase">
              A visual breathing point
            </p>
          </div>

          <div class="w-12 h-[1px] bg-zinc-800" />

          {/* Main Statement */}
          <div class="space-y-4">
            <h2 class="text-2xl md:text-4xl font-extralight tracking-[0.2em] text-zinc-100 uppercase leading-snug">
              A fragrance is more than a scent.
            </h2>
            <div class="space-y-1 text-sm md:text-lg font-light tracking-[0.25em] text-zinc-400 uppercase">
              <p>It is a place.</p>
              <p>A memory.</p>
              <p>A moment that stays.</p>
            </div>
          </div>

          <div class="w-12 h-[1px] bg-zinc-800" />

          {/* Brand Story */}
          <div class="space-y-3 max-w-lg">
            <span class="text-[10px] font-mono tracking-[0.35em] text-zinc-500 uppercase">
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