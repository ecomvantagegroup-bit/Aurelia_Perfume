import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './fragrance_notes.css';

gsap.registerPlugin(ScrollTrigger);

export default defineComponent({
  name: 'FragranceNotes',
  setup() {
    const containerRef = ref(null);
    const textGroupRef = ref(null);

    let scrollTriggerInstance = null;

    const fragrancePyramid = [
      { category: '01 / Top Note', title: 'Bergamot', tag: 'Fresh' },
      { category: '02 / Heart Note', title: 'Cedar Leaf', tag: 'Botanical' },
      { category: '03 / Base Note', title: 'Moss', tag: 'Earthy' },
    ];

    onMounted(() => {
      const sectionEl = document.getElementById('sec-notes');
      if (!sectionEl) return;

      // Pin the section during scroll to match OceanBloom behavior
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: sectionEl,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 0.5,
      });

      // Entry reveal animation
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
        id="world-notes"
        class="notes-section-container relative min-h-screen w-full flex items-center justify-between px-8 md:px-16 lg:px-24 bg-transparent pointer-events-none select-none"
      >
        {/* Left Primary Editorial Content */}
        <div ref={textGroupRef} class="max-w-lg z-10 space-y-6">
          <div class="flex items-center space-x-3">
            <span class="h-[1px] w-8 bg-emerald-400/60" />
            <p class="text-xs font-mono uppercase tracking-[0.3em] text-emerald-300/80">
              04 — SPECIFICATION
            </p>
          </div>

          <h1 class="text-5xl md:text-7xl font-extralight tracking-tight text-white font-serif leading-none">
            Forest <br />
            <span class="italic font-normal bg-gradient-to-r from-emerald-200 via-teal-300 to-green-400 bg-clip-text text-transparent">
              Essence
            </span>
          </h1>

          <div class="flex items-center space-x-2 pt-2">
            {['Fresh', 'Botanical', 'Earthy'].map((tag) => (
              <span
                key={tag}
                class="px-3 py-1 text-[10px] font-mono tracking-widest uppercase rounded-full border border-emerald-400/20 bg-emerald-950/20 text-emerald-200 backdrop-blur-md"
              >
                {tag}
              </span>
            ))}
          </div>

          <p class="text-sm md:text-base text-slate-300/80 leading-relaxed font-light">
            An immersive botanical depth. Crisp top notes of Italian bergamot layered over rich cedar leaf and grounded in deep forest moss.
          </p>

          <div class="flex items-center justify-between max-w-xs text-[10px] font-mono tracking-[0.2em] text-emerald-400/80 uppercase pt-4 border-t border-emerald-500/10">
            <span>Vol. 100ML</span>
            <span>Eau De Parfum</span>
            <span>75% VOL.</span>
          </div>
        </div>

        {/* Right Olfactory Pyramid Cards */}
        <div class="hidden lg:flex flex-col space-y-4 max-w-xs z-10 pointer-events-auto">
          {fragrancePyramid.map((note) => (
            <div
              key={note.category}
              class="p-5 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md hover:border-emerald-400/30 transition-all duration-300 group"
            >
              <span class="text-[10px] font-mono uppercase tracking-widest text-emerald-400/80 block mb-1">
                {note.category}
              </span>
              <p class="text-sm font-light tracking-widest uppercase text-slate-200 group-hover:text-white transition-colors">
                {note.title}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  },
});