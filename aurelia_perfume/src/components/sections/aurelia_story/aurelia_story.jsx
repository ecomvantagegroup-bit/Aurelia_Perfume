import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './aurelia_story.css';

gsap.registerPlugin(ScrollTrigger);

export default defineComponent({
  name: 'StorySection',
  setup() {
    const sectionRef = ref(null);
    const contentRef = ref(null);

    let ctx = null;

    onMounted(() => {
      const sectionEl = sectionRef.value || document.getElementById('sec-story');
      if (!sectionEl) return;

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top top',
            end: '+=150%',
            pin: true,
            scrub: 0.6,
          },
        });

        tl.fromTo(
          '.story-reveal',
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.3, ease: 'power2.out' }
        )
        .fromTo(
          '.story-line',
          { scaleX: 0 },
          { scaleX: 1, transformOrigin: 'center', duration: 1, ease: 'power3.inOut' },
          '-=0.8'
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
        id="sec-story"
        class="story-section-container relative min-h-screen w-full flex items-center justify-center text-white px-6 md:px-12 bg-transparent select-none"
      >
        <div
          ref={contentRef}
          class="max-w-3xl w-full flex flex-col items-center justify-center text-center space-y-10 z-10"
        >
          <div class="story-reveal space-y-2">
            <span class="text-xs font-mono tracking-[0.4em] text-amber-400/80 uppercase">
              06 — Aurelia Story
            </span>
            <p class="text-[11px] md:text-xs tracking-[0.25em] font-light text-zinc-400 uppercase">
              A visual breathing point
            </p>
          </div>

          <div class="story-line w-24 h-[1px] bg-amber-400/40" />

          <div class="story-reveal space-y-4">
            <h2 class="text-3xl md:text-5xl font-extralight tracking-[0.15em] text-zinc-100 uppercase leading-relaxed font-serif">
              A fragrance is more than a scent.
            </h2>
            <div class="space-y-2 text-base md:text-xl font-light tracking-[0.2em] text-zinc-400 uppercase">
              <p>It is a place.</p>
              <p>A memory.</p>
              <p>A moment that stays.</p>
            </div>
          </div>

          <div class="story-line w-24 h-[1px] bg-amber-400/40" />

          <div class="story-reveal space-y-3 max-w-lg">
            <span class="text-[10px] font-mono tracking-[0.35em] text-zinc-500 uppercase">
              Brand Story
            </span>
            <h3 class="text-base md:text-lg font-light tracking-[0.3em] text-amber-200/90 uppercase">
              The Aurelia House
            </h3>
            <p class="text-xs md:text-sm font-extralight tracking-[0.18em] leading-relaxed text-zinc-300 uppercase">
              Aurelia creates fragrances inspired by places, memories, and moments
              that remain long after the first impression.
            </p>
          </div>
        </div>
      </section>
    );
  },
});