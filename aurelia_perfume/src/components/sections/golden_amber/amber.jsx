import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './amber.css';

gsap.registerPlugin(ScrollTrigger);

export default defineComponent({
  name: 'GoldenAmberSection',
  setup() {
    const sectionRef = ref(null);
    let revealTrigger = null;

    onMounted(() => {
      const sectionEl = sectionRef.value;
      if (!sectionEl) return;

      const elements = sectionEl.querySelectorAll('.amber-reveal');

      revealTrigger = ScrollTrigger.create({
        trigger: sectionEl,
        start: 'top 60%',
        onEnter: () => {
          gsap.fromTo(
            elements,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 1.4,
              stagger: 0.18,
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
        ref={sectionRef}
        class="amber-section-container relative z-30 min-h-[250vh] w-full flex items-center justify-center text-white px-6 md:px-16 py-24 select-none pointer-events-auto bg-transparent overflow-hidden"
      >
        {/* Amber Atmosphere Highlights */}
        <div class="amber-radial-glow pointer-events-none" />

        {/* Sticky Viewport Layout */}
        <div class="sticky top-0 h-screen max-w-4xl w-full flex flex-col items-center justify-center text-center space-y-10 z-10">
          {/* Section Number & Name */}
          <div class="amber-reveal space-y-2">
            <span class="text-xs md:text-sm font-mono tracking-[0.5em] text-amber-400 uppercase">
              07 — GOLDEN AMBER
            </span>
            <p class="text-[10px] md:text-xs tracking-[0.3em] font-light text-amber-200/60 uppercase">
              The Climax of the Fragrance Journey
            </p>
          </div>

          <div class="amber-reveal w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

          {/* Fragrance Character Specs */}
          <div class="amber-reveal space-y-3">
            <span class="text-[9px] md:text-[10px] font-mono tracking-[0.4em] text-amber-500/80 uppercase">
              FRAGRANCE CHARACTER
            </span>
            <h2 class="text-2xl md:text-5xl font-extralight tracking-[0.25em] text-amber-100 uppercase leading-snug drop-shadow-lg">
              Warm <span class="text-amber-500/80">/</span> Sensual <span class="text-amber-500/80">/</span> Rich
            </h2>
          </div>

          {/* Cinematic Environment Description Grid */}
          <div class="amber-reveal grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl w-full pt-4">
            <div class="amber-glass-card p-4 rounded-sm border border-amber-500/10 bg-amber-950/20 backdrop-blur-md">
              <span class="block text-[10px] font-mono tracking-[0.2em] text-amber-400/70 uppercase">
                ENVIRONMENT
              </span>
              <p class="text-xs tracking-[0.15em] font-light text-amber-100/90 uppercase mt-1">
                Sand Dunes & Sunset
              </p>
            </div>

            <div class="amber-glass-card p-4 rounded-sm border border-amber-500/10 bg-amber-950/20 backdrop-blur-md">
              <span class="block text-[10px] font-mono tracking-[0.2em] text-amber-400/70 uppercase">
                3D PRODUCT
              </span>
              <p class="text-xs tracking-[0.15em] font-light text-amber-100/90 uppercase mt-1">
                Amber Glass Bottle
              </p>
            </div>

            <div class="amber-glass-card p-4 rounded-sm border border-amber-500/10 bg-amber-950/20 backdrop-blur-md">
              <span class="block text-[10px] font-mono tracking-[0.2em] text-amber-400/70 uppercase">
                ATMOSPHERE
              </span>
              <p class="text-xs tracking-[0.15em] font-light text-amber-100/90 uppercase mt-1">
                Dust, Smoke & Light
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  },
});