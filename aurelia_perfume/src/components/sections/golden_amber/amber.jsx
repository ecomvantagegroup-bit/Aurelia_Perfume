import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './amber.css';

gsap.registerPlugin(ScrollTrigger);

export default defineComponent({
  name: 'GoldenAmberSection',
  setup() {
    const sectionRef = ref(null);
    let ctx = null;

    const fragrancePyramid = [
      { category: 'TOP NOTE', detail: 'Warm Spices & Amber Dust' },
      { category: 'HEART NOTE', detail: 'Smokey Resin & Solar Accord' },
      { category: 'BASE NOTE', detail: 'Golden Amber & Sandalwood' },
    ];

    onMounted(() => {
      const sectionEl = sectionRef.value || document.getElementById('sec-amber');
      if (!sectionEl) return;

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top top',
            end: '+=150%',
            pin: true,
            scrub: 0.5,
          },
        });

        // Midday Solar Sunburst Expansion (Gold/Black theme)
        tl.fromTo(
          '.solar-flare',
          { scale: 0.7, opacity: 0.3 },
          { scale: 1.4, opacity: 0.85, duration: 1.5, ease: 'power2.out' }
        )
        .fromTo(
          '.midday-dust',
          { opacity: 0, y: 30 },
          { opacity: 0.6, y: -20, duration: 1.5, ease: 'none' },
          '-=1.5'
        )
        .fromTo(
          '.amber-reveal',
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 1, stagger: 0.2, ease: 'power3.out' },
          '-=1.2'
        )
        .fromTo(
          '.amber-card',
          { opacity: 0, y: 30, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out' },
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
        id="sec-amber"
        class="amber-section-container relative min-h-screen w-full flex items-center justify-between px-8 md:px-16 lg:px-24 bg-transparent select-none overflow-hidden"
      >
        {/* Midday Desert Sunburst Glow (Warm Gold to Dark Gradient) */}
        <div class="solar-flare pointer-events-none absolute top-[-10%] right-[15%] w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-amber-400/40 via-amber-600/15 to-transparent blur-3xl opacity-0 z-0" />

        {/* Subtle Ambient Dust Layer */}
        <div class="midday-dust pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-600/10 via-black/10 to-transparent blur-2xl z-0" />

        {/* Left Column: Gold & Black Typography */}
        <div class="max-w-xl z-10 space-y-8">
          <div class="amber-reveal space-y-4">
            <div class="flex items-center space-x-3">
              <span class="h-[1px] w-8 bg-amber-500" />
              <p class="text-xs font-mono uppercase tracking-[0.3em] font-semibold text-black drop-shadow-sm">
                07 — Fragrance Chapter
              </p>
            </div>

            {/* Black & Gold Metallic Title */}
            <h1 class="text-6xl md:text-8xl font-extralight tracking-tight text-black font-serif leading-none drop-shadow-sm">
              Golden <br />
              <span class="italic font-normal bg-gradient-to-r from-amber-500 via-amber-300 to-yellow-600 bg-clip-text text-transparent drop-shadow">
                Amber
              </span>
            </h1>
          </div>

          <div class="amber-reveal space-y-2">
            <span class="text-[10px] font-mono tracking-[0.25em] font-bold text-amber-600 uppercase">
              Fragrance Character
            </span>
            <p class="text-base md:text-lg font-light tracking-[0.2em] text-black font-serif uppercase">
              Warm / Sensual / Rich
            </p>
          </div>

          <p class="amber-reveal text-sm md:text-base text-stone-900 leading-relaxed font-normal max-w-md backdrop-blur-[4px] bg-black/5 p-4 rounded-xl border border-black/10 shadow-sm">
            Immersed in midday desert heat. Resinous warmth enveloped in golden sunbeams, subtle floating smoke, and warm reflections captured under intense solar rays.
          </p>

          <div class="amber-reveal flex space-x-3">
            {['Warm', 'Sensual', 'Rich'].map((tag) => (
              <span
                key={tag}
                class="px-3 py-1 text-[10px] font-mono tracking-widest uppercase rounded-full border border-amber-500/40 bg-black text-amber-400 font-medium backdrop-blur-md shadow-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Deep Obsidian Glass Cards with Gold Accents */}
        <div class="hidden lg:flex flex-col space-y-4 w-full max-w-xs z-10 pointer-events-auto">
          {fragrancePyramid.map((item) => (
            <div
              key={item.category}
              class="amber-card p-5 rounded-2xl border border-amber-500/30 bg-black/90 text-white backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]"
            >
              <span class="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400 font-semibold block mb-1">
                {item.category}
              </span>
              <p class="text-xs md:text-sm font-light text-stone-200 tracking-wide">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  },
});