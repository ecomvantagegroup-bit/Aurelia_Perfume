import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './cta.css';

gsap.registerPlugin(ScrollTrigger);

export default defineComponent({
  name: 'CTASection',
  setup() {
    const sectionRef = ref(null);
    const buttonRef = ref(null);
    let ctx = null;

    // Magnetic Physics Handler
    const handleMouseMove = (e) => {
      const btn = buttonRef.value;
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Smooth magnetic pull towards cursor
      gsap.to(btn, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      const btn = buttonRef.value;
      if (!btn) return;

      // Elastic snap-back to center
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)',
      });
    };

    onMounted(() => {
      const sectionEl = sectionRef.value || document.getElementById('sec-cta');
      if (!sectionEl) return;

      ctx = gsap.context(() => {
        // Pin & Unpin ScrollTrigger Sequence
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top top',
            end: '+=150%',
            pin: true,
            pinSpacing: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // 1. Ethereal ambient light pulse expansion
        tl.fromTo(
          '.cta-ambient-glow',
          { scale: 0.5, opacity: 0 },
          { scale: 1.2, opacity: 0.5, duration: 1.2, ease: 'power2.out' }
        )
        // 2. Chapter label reveal
        .fromTo(
          '.cta-chapter-tag',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.8'
        )
        // 3. Large typography reveal with letter-spacing stretch
        .fromTo(
          '.cta-heading-line',
          { opacity: 0, y: 45, letterSpacing: '0.01em' },
          { opacity: 1, y: 0, letterSpacing: '0.07em', duration: 1.2, stagger: 0.25, ease: 'power3.out' },
          '-=0.6'
        )
        // 4. Magnetic CTA button pop-in
        .fromTo(
          '.cta-magnetic-wrapper',
          { opacity: 0, scale: 0.85, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'back.out(1.4)' },
          '-=0.4'
        )
      }, sectionEl);

      ScrollTrigger.refresh();
    });

    onUnmounted(() => {
      if (ctx) ctx.revert();
    });

    return () => (
      <section
        ref={sectionRef}
        id="sec-cta"
        class="cta-section relative min-h-screen w-full flex flex-col justify-between items-center p-6 md:p-12 lg:p-16 bg-transparent text-white select-none overflow-hidden"
      >
        {/* Soft Ambient Radial Light */}
        <div class="cta-ambient-glow pointer-events-none absolute inset-0 m-auto w-[550px] h-[550px] md:w-[850px] md:h-[850px] rounded-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-amber-500/15 via-emerald-950/10 to-transparent blur-3xl opacity-0 z-0" />

        {/* Top Tag Header */}
        <div class="w-full text-center z-10 pt-4">
          <p class="cta-chapter-tag text-xs font-mono uppercase tracking-[0.35em] text-amber-200/80 font-medium">
            09 — Final Chapter
          </p>
        </div>

        {/* Central Content Hero */}
        <div class="my-auto z-10 text-center max-w-5xl mx-auto space-y-8 md:space-y-12 py-8">
          <div class="space-y-2 md:space-y-4">
            <h1 class="cta-heading-line text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-extralight uppercase text-white leading-none tracking-normal drop-shadow-lg">
              Find the scent
            </h1>
            <h1 class="cta-heading-line text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-serif italic font-normal bg-gradient-to-r from-amber-100 via-amber-200/90 to-amber-400 bg-clip-text text-transparent leading-none tracking-normal drop-shadow-lg">
              that becomes yours.
            </h1>
          </div>

          {/* Magnetic Interactive CTA Button */}
          <div class="cta-magnetic-wrapper flex justify-center items-center pointer-events-auto pt-4">
            <button
              ref={buttonRef}
              onMousemove={handleMouseMove}
              onMouseleave={handleMouseLeave}
              class="cta-magnetic-btn group relative inline-flex items-center justify-center px-8 sm:px-12 md:px-14 py-4 md:py-5 rounded-full border border-amber-300/30 bg-black/30 backdrop-blur-md text-amber-200 font-mono text-xs md:text-sm tracking-[0.3em] uppercase transition-all duration-300 hover:border-amber-200 hover:bg-amber-400 hover:text-black hover:shadow-[0_0_45px_rgba(251,191,36,0.35)]"
            >
              <span class="relative z-10 transition-transform duration-300 group-hover:scale-105">
                Discover Aurelia
              </span>
              <span class="ml-3 relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        </div>
      </section>
    );
  },
});