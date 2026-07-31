import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './amber.css';

gsap.registerPlugin(ScrollTrigger);

export default defineComponent({
  name: 'GoldenAmberSection',
  setup() {
    const containerRef = ref(null);
    const contentRef = ref(null);

    let scrollTriggerInstance = null;

    const amberHighlights = [
      { category: 'Environment', detail: 'Sand Dunes & Sunset' },
      { category: '3D Product', detail: 'Amber Glass Bottle' },
      { category: 'Atmosphere', detail: 'Dust, Smoke & Light' },
    ];

    onMounted(() => {
      const sectionEl = document.getElementById('sec-amber');
      if (!sectionEl) return;

      // Pin section to freeze layout in viewport during sequence scroll
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: sectionEl,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 0.5,
      });

      // Entry reveal animation matching the suite pattern
      if (contentRef.value) {
        gsap.fromTo(
          contentRef.value.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            stagger: 0.15,
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
        id="world-amber"
        class="amber-section-container relative min-h-screen w-full flex items-center justify-between px-8 md:px-16 lg:px-24 bg-transparent select-none pointer-events-none"
      >
        {/* Glow Overlay */}
        <div class="amber-radial-glow pointer-events-none" />

        {/* Primary Content Left Column */}
        <div ref={contentRef} class="max-w-lg z-10 space-y-6">
          <div class="flex items-center space-x-3">
            <span class="h-[1px] w-8 bg-amber-400/60" />
            <p class="text-xs font-mono uppercase tracking-[0.3em] text-amber-300/80">
              07 — GOLDEN AMBER
            </p>
          </div>

          <h1 class="text-5xl md:text-7xl font-extralight tracking-tight text-white font-serif leading-none">
            Golden <br />
            <span class="italic font-normal bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              Amber
            </span>
          </h1>

          <div class="flex items-center space-x-2 pt-2">
            {['Warm', 'Sensual', 'Rich'].map((tag) => (
              <span
                key={tag}
                class="px-3 py-1 text-[10px] font-mono tracking-widest uppercase rounded-full border border-amber-400/20 bg-amber-950/20 text-amber-200 backdrop-blur-md"
              >
                {tag}
              </span>
            ))}
          </div>

          <p class="text-sm md:text-base text-slate-300/80 leading-relaxed font-light">
            The climax of the fragrance journey. Deep resinous warmth enveloped in golden dust, glowing light, and the raw elegance of sunset dunes.
          </p>

          <div class="pt-4 pointer-events-auto">
            <button class="group relative inline-flex items-center space-x-4 px-6 py-3 rounded-full border border-amber-300/30 bg-amber-950/10 hover:bg-amber-500/10 backdrop-blur-md transition-all duration-300">
              <span class="text-xs font-mono tracking-widest uppercase text-amber-100">
                Experience Climax Note
              </span>
              <span class="w-2 h-2 rounded-full bg-amber-400 group-hover:scale-125 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Secondary Spec Cards Right Column */}
        <div class="hidden lg:flex flex-col space-y-4 max-w-xs z-10 pointer-events-auto">
          {amberHighlights.map((item) => (
            <div
              key={item.category}
              class="p-5 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md hover:border-amber-400/30 transition-all duration-300 group"
            >
              <span class="text-[10px] font-mono uppercase tracking-widest text-amber-400/80 block mb-1">
                {item.category}
              </span>
              <p class="text-xs font-light text-slate-200 group-hover:text-white transition-colors">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  },
});