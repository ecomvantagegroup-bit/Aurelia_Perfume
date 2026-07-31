import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ocean_bloom.css';

gsap.registerPlugin(ScrollTrigger);

export default defineComponent({
  name: 'OceanBloom',
  setup() {
    const sectionRef = ref(null);
    const contentRef = ref(null);
    const nodesRef = ref(null);

    let ctx = null;

    const fragranceNotes = [
      { category: 'TOP NOTE', detail: 'Crisp Sea Salt & Bergamot' },
      { category: 'HEART NOTE', detail: 'Ocean Water Lily & Sage' },
      { category: 'BASE NOTE', detail: 'Driftwood & Ambergris' },
    ];

    onMounted(() => {
      const sectionEl = sectionRef.value || document.getElementById('sec-ocean');
      if (!sectionEl) return;

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top top',
            end: '+=150%',
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
          },
        });

        // Ambient Abyssal Indigo Glow Expansion
        tl.fromTo(
          '.abyssal-glow',
          { scale: 0.6, opacity: 0.2 },
          { scale: 1.3, opacity: 0.8, duration: 1.5, ease: 'power2.out' }
        )
        // Entrance animation bound to scroll scrub
        .fromTo(
          '.ocean-reveal',
          { opacity: 0, y: 50, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 1, stagger: 0.2, ease: 'power2.out' },
          '-=1.2'
        )
        .fromTo(
          '.ocean-node',
          { opacity: 0, scale: 0.9, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'back.out(1.4)' },
          '-=0.5'
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
        id="sec-ocean"
        class="ocean-bloom-section relative min-h-screen w-full flex flex-col justify-between p-8 md:p-16 lg:p-24 bg-transparent select-none overflow-hidden"
      >
        {/* Abyssal Indigo & Deep Oceanic Ambient Glow */}
        <div class="abyssal-glow pointer-events-none absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] md:w-[950px] md:h-[950px] rounded-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-indigo-600/25 via-slate-900/40 to-transparent blur-3xl opacity-0 z-0" />

        {/* Top Header Row */}
        <div class="w-full flex items-center justify-between z-10 ocean-reveal">
          <div class="flex items-center space-x-3">
            <span class="h-[1px] w-8 bg-indigo-400/60" />
            <p class="text-xs font-mono uppercase tracking-[0.3em] font-medium text-indigo-300">
              05 — Fragrance Chapter
            </p>
          </div>
          <div class="hidden sm:flex space-x-2">
            {['Aquatic', 'Mineral', 'Fresh'].map((tag) => (
              <span
                key={tag}
                class="px-3.5 py-1 text-[10px] font-mono tracking-widest uppercase rounded-full border border-indigo-400/30 bg-indigo-950/40 text-indigo-200 backdrop-blur-xl shadow-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Hero Central Section */}
        <div ref={contentRef} class="my-auto z-10 max-w-2xl ocean-reveal space-y-6">
          <h1 class="text-6xl md:text-8xl font-extralight tracking-tight text-white font-serif leading-none drop-shadow-md">
            Ocean <br />
            <span class="italic font-normal bg-gradient-to-r from-indigo-200 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              Bloom
            </span>
          </h1>
          <p class="text-sm md:text-base text-slate-200/90 leading-relaxed font-light max-w-md backdrop-blur-[2px] bg-slate-950/20 p-4 rounded-xl border border-indigo-500/10">
            Descend into cooler aquatic depths. A crisp synthesis of coastal sunrise, mineral currents, and pristine underwater refraction capturing the raw vitality of the open sea.
          </p>
        </div>

        {/* Bottom Arc Node Layout: Deep Oceanic Glass Cards */}
        <div ref={nodesRef} class="z-10 grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-indigo-500/20 pointer-events-auto">
          {fragranceNotes.map((note) => (
            <div
              key={note.category}
              class="ocean-node p-5 rounded-2xl border border-indigo-400/20 bg-slate-950/80 backdrop-blur-2xl shadow-2xl transition-all duration-300 hover:border-indigo-400/60 hover:bg-indigo-950/60 hover:shadow-[0_0_25px_rgba(99,102,241,0.2)]"
            >
              <span class="text-[10px] font-mono uppercase tracking-[0.25em] text-indigo-300 font-semibold block mb-1">
                {note.category}
              </span>
              <p class="text-xs md:text-sm font-light text-slate-100 tracking-wide">{note.detail}</p>
            </div>
          ))}
        </div>
      </section>
    );
  },
});