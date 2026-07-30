import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ocean_bloom.css';

gsap.registerPlugin(ScrollTrigger);

export default defineComponent({
  name: 'OceanBloom',
  setup() {
    const containerRef = ref(null);
    const textGroupRef = ref(null);

    let scrollTriggerInstance = null;

    const fragranceNotes = [
      { category: 'Top Notes', detail: 'Crisp Sea Salt, Italian Bergamot, Coastal Mist' },
      { category: 'Heart Notes', detail: 'Ocean Water Lily, Mineral Flora, Wild Sage' },
      { category: 'Base Notes', detail: 'Sun-Bleached Driftwood, Ambergris, Deep Kelp' },
    ];

    onMounted(() => {
      const sectionEl = document.getElementById('sec-ocean');
      if (!sectionEl) return;

      scrollTriggerInstance = ScrollTrigger.create({
        trigger: sectionEl,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          window.dispatchEvent(
            new CustomEvent('ocean-scroll-progress', {
              detail: {
                progress: self.progress,
                direction: self.direction,
              },
            })
          );
        },
      });

      if (textGroupRef.value) {
        gsap.fromTo(
          textGroupRef.value.children,
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
        id="world-ocean"
        class="ocean-bloom-section relative min-h-screen w-full flex items-center justify-between px-8 md:px-16 lg:px-24 bg-transparent pointer-events-none select-none"
      >
        <div ref={textGroupRef} class="max-w-lg z-10 space-y-6">
          <div class="flex items-center space-x-3">
            <span class="h-[1px] w-8 bg-sky-400/60" />
            <p class="text-xs font-mono uppercase tracking-[0.3em] text-sky-300/80">
              05 — Fragrance Chapter
            </p>
          </div>

          <h1 class="text-5xl md:text-7xl font-extralight tracking-tight text-white font-serif leading-none">
            Ocean <br />
            <span class="italic font-normal bg-gradient-to-r from-sky-200 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
              Bloom
            </span>
          </h1>

          <div class="flex items-center space-x-2 pt-2">
            {['Aquatic', 'Mineral', 'Fresh'].map((tag) => (
              <span
                key={tag}
                class="px-3 py-1 text-[10px] font-mono tracking-widest uppercase rounded-full border border-sky-400/20 bg-sky-950/20 text-sky-200 backdrop-blur-md"
              >
                {tag}
              </span>
            ))}
          </div>

          <p class="text-sm md:text-base text-slate-300/80 leading-relaxed font-light">
            Descend into cooler aquatic depths. A crisp synthesis of coastal sunrise, mineral currents, and pristine underwater refraction capturing the raw vitality of the open sea.
          </p>

          <div class="pt-4 pointer-events-auto">
            <button class="group relative inline-flex items-center space-x-4 px-6 py-3 rounded-full border border-sky-300/30 bg-sky-950/10 hover:bg-sky-500/10 backdrop-blur-md transition-all duration-300">
              <span class="text-xs font-mono tracking-widest uppercase text-sky-100">
                Explore Olfactory Pyramid
              </span>
              <span class="w-2 h-2 rounded-full bg-sky-400 group-hover:scale-125 transition-transform duration-300" />
            </button>
          </div>
        </div>

        <div class="hidden lg:flex flex-col space-y-4 max-w-xs z-10 pointer-events-auto">
          {fragranceNotes.map((note) => (
            <div
              key={note.category}
              class="p-5 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md hover:border-sky-400/30 transition-all duration-300 group"
            >
              <span class="text-[10px] font-mono uppercase tracking-widest text-sky-400/80 block mb-1">
                {note.category}
              </span>
              <p class="text-xs font-light text-slate-200 group-hover:text-white transition-colors">
                {note.detail}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  },
});