import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './collection.css';

gsap.registerPlugin(ScrollTrigger);

export default defineComponent({
  name: 'CollectionSection',
  setup() {
    const sectionRef = ref(null);
    let ctx = null;

    const collectionData = [
      {
        id: '02',
        title: 'Ocean Bloom',
        subtitle: 'Aquatic / Mineral / Fresh',
        bgGlow: 'from-emerald-500/20 via-emerald-950/10 to-transparent',
        borderHover: 'hover:border-emerald-400/50 hover:shadow-[0_0_35px_rgba(16,185,129,0.2)]',
        badgeClass: 'text-emerald-300 border-emerald-500/30 bg-emerald-950/40',
        ctaHover: 'hover:bg-emerald-500 hover:text-black',
        modelKey: 'forest',
      },
     
        
      {
        id: '01',
        title: 'Forest Essence', 
        subtitle: 'Fresh / Botanical / Earthy',
        bgGlow: 'from-indigo-500/20 via-slate-950/10 to-transparent',
        borderHover: 'hover:border-indigo-400/50 hover:shadow-[0_0_35px_rgba(99,102,241,0.2)]',
        badgeClass: 'text-indigo-300 border-indigo-500/30 bg-indigo-950/40',
        ctaHover: 'hover:bg-indigo-400 hover:text-black',
        modelKey: 'ocean',
      },
      {
        id: '03',
        title: 'Golden Amber',
        subtitle: 'Warm / Sensual / Rich',
        bgGlow: 'from-amber-500/20 via-amber-950/10 to-transparent',
        borderHover: 'hover:border-amber-400/50 hover:shadow-[0_0_35px_rgba(245,158,11,0.2)]',
        badgeClass: 'text-amber-300 border-amber-500/30 bg-amber-950/40',
        ctaHover: 'hover:bg-amber-400 hover:text-black',
        modelKey: 'amber',
      },
    ];

    onMounted(() => {
      const sectionEl = sectionRef.value || document.getElementById('sec-collection');
      if (!sectionEl) return;

      ctx = gsap.context(() => {
        // ScrollTrigger with clean pin/unpin timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top top',
            end: '+=180%',
            pin: true,
            pinSpacing: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // 1. Camera Pull-Back: Expand multi-colored ambient aura
        tl.fromTo(
          '.collection-ambient-aura',
          { scale: 0.5, opacity: 0 },
          { scale: 1.2, opacity: 1, duration: 1.2, ease: 'power2.out' }
        )
        // 2. Reveal section header copy
        .fromTo(
          '.collection-header-reveal',
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out' },
          '-=0.8'
        )
        // 3. Staggered reveal of bottle card elements
        .fromTo(
          '.collection-card',
          { opacity: 0, y: 50, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 1, stagger: 0.2, ease: 'back.out(1.2)' },
          '-=0.4'
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
        id="sec-collection"
        class="collection-section relative min-h-screen w-full flex flex-col justify-between p-6 md:p-12 lg:p-16 bg-transparent select-none overflow-hidden"
      >
        {/* Soft Multi-Tone Ambient Light Aura */}
        <div class="collection-ambient-aura pointer-events-none absolute inset-0 m-auto w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-amber-500/10 via-emerald-500/5 to-transparent blur-3xl opacity-0 z-0" />

        {/* Section Header */}
        <div class="w-full text-center z-10 max-w-2xl mx-auto space-y-3 pt-4">
          <p class="collection-header-reveal text-xs font-mono uppercase tracking-[0.3em] text-amber-200/80 font-medium">
            08 — The Complete Discovery
          </p>
          <h1 class="collection-header-reveal text-4xl md:text-6xl font-extralight tracking-tight text-white font-serif leading-none">
            THE <span class="italic font-normal bg-gradient-to-r from-amber-200 via-emerald-200 to-indigo-200 bg-clip-text text-transparent">COLLECTION</span>
          </h1>
          <p class="collection-header-reveal text-xs md:text-sm font-light text-slate-300/80 tracking-widest uppercase">
            The three fragrance worlds finally come together.
          </p>
        </div>

        {/*
          Column count comes entirely from the .collection-grid CSS Grid
          rules in collection.css (1 col mobile / 2 tablet / 3 desktop).
          Only spacing/sizing utilities (max-width, centering, gap) live
          here — there's a single source of truth for the column layout.
        */}
        <div class="collection-grid w-full max-w-6xl mx-auto gap-4 md:gap-6 my-auto z-10 py-6">
          {collectionData.map((item) => (
            <div
              key={item.id}
              class={`collection-card group relative p-5 md:p-8 rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur-xl transition-all duration-500 ease-out flex flex-col justify-between min-h-[240px] md:min-h-[280px] pointer-events-auto ${item.borderHover}`}
            >
              {/* Inner Soft Glow */}
              <div
                class={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
              />

              <div class="space-y-3 md:space-y-4 z-10">
                <div class="flex items-center justify-between">
                  <span
                    class={`px-2.5 py-0.5 text-[10px] font-mono tracking-widest uppercase rounded-full border ${item.badgeClass}`}
                  >
                    {item.id}
                  </span>
                  <span class="text-[10px] font-mono tracking-widest text-slate-400/80 uppercase">
                    100 ML
                  </span>
                </div>

                {/* Subtly Shifting Title & Subtitle */}
                <div class="transition-transform duration-300 group-hover:-translate-y-1">
                  <h3 class="text-xl md:text-3xl font-serif font-light text-white tracking-wide">
                    {item.title}
                  </h3>
                  <p class="text-[10px] md:text-xs font-mono tracking-wider text-slate-300/70 pt-1 uppercase">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              {/* Action Button revealed on hover */}
              <div class="z-10 pt-2">
                <button
                  class={`w-full py-2 md:py-2.5 px-3 text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] rounded-xl border border-white/20 bg-white/5 text-white backdrop-blur-md transition-all duration-300 opacity-80 group-hover:opacity-100 ${item.ctaHover}`}
                >
                  Explore World
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Section Footer */}
        <div class="w-full flex justify-between items-center z-10 border-t border-white/10 pt-4 text-[10px] font-mono text-slate-400/70 uppercase tracking-widest">
          <span>Aurelia Parfums</span>
          <span>Trilogy Edition</span>
          <span>Crafted in France</span>
        </div>
      </section>
    );
  },
});