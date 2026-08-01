import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './footer.css';

gsap.registerPlugin(ScrollTrigger);

export default defineComponent({
  name: 'FooterSection',
  setup() {
    const footerRef = ref(null);
    let ctx = null;

    onMounted(() => {
      const footerEl = footerRef.value || document.getElementById('sec-footer');
      if (!footerEl) return;

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: footerEl,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });

        // 1. Divider line expand
        tl.fromTo(
          '.footer-divider',
          { scaleX: 0 },
          { scaleX: 1, duration: 1.2, ease: 'power3.inOut' }
        )
        // 2. Large Brand Watermark reveal
        .fromTo(
          '.footer-brand-title',
          { opacity: 0, y: 30, letterSpacing: '0.1em' },
          { opacity: 1, y: 0, letterSpacing: '0.22em', duration: 1.4, ease: 'power3.out' },
          '-=0.8'
        )
        // 3. Navigation Columns stagger reveal
        .fromTo(
          '.footer-nav-col',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' },
          '-=0.9'
        )
        // 4. Copyright bottom row reveal
        .fromTo(
          '.footer-bottom',
          { opacity: 0 },
          { opacity: 0.6, duration: 0.8, ease: 'power2.out' },
          '-=0.4'
        );
      }, footerEl);

      ScrollTrigger.refresh();
    });

    onUnmounted(() => {
      if (ctx) ctx.revert();
    });

    return () => (
      <footer
        ref={footerRef}
        id="sec-footer"
        class="footer-section relative w-full bg-[#050507] text-white pt-20 pb-12 px-6 md:px-16 overflow-hidden select-none"
      >
        {/* Subtle Ambient Background Light Pulse */}
        <div class="footer-bg-glow pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-500/10 via-amber-950/5 to-transparent blur-3xl" />

        <div class="max-w-7xl mx-auto relative z-10 flex flex-col justify-between min-h-[50vh]">
          {/* Top Divider */}
          <div class="footer-divider w-full h-[1px] bg-gradient-to-r from-transparent via-amber-200/25 to-transparent origin-center mb-16 md:mb-24" />

          {/* Main Content Grid */}
          <div class="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-start pb-16">
            
            {/* Brand Statement / Monogram */}
            <div class="md:col-span-6 lg:col-span-7 space-y-4">
              <h2 class="footer-brand-title font-serif text-5xl sm:text-7xl lg:text-9xl font-extralight uppercase tracking-[0.22em] bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent leading-none">
                Aurelia
              </h2>
              <p class="font-mono text-xs uppercase tracking-[0.3em] text-amber-200/60 pt-2">
                Haute Parfumerie • Paris
              </p>
            </div>

            {/* Navigation Links Column */}
            <div class="footer-nav-col md:col-span-3 lg:col-span-3 space-y-5">
              <span class="block font-mono text-[10px] uppercase tracking-[0.35em] text-amber-300/40 font-semibold">
                Navigation
              </span>
              <ul class="space-y-3 font-serif text-lg md:text-xl font-light text-slate-300">
                <li>
                  <a href="#sec-collection" class="footer-link inline-block hover:text-amber-200 transition-colors">
                    Collection
                  </a>
                </li>
                <li>
                  <a href="#sec-story" class="footer-link inline-block hover:text-amber-200 transition-colors">
                    Story
                  </a>
                </li>
                <li>
                  <a href="#contact" class="footer-link inline-block hover:text-amber-200 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Links Column */}
            <div class="footer-nav-col md:col-span-3 lg:col-span-2 space-y-5">
              <span class="block font-mono text-[10px] uppercase tracking-[0.35em] text-amber-300/40 font-semibold">
                Social
              </span>
              <ul class="space-y-3 font-serif text-lg md:text-xl font-light text-slate-300">
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="footer-link inline-block hover:text-amber-200 transition-colors"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://pinterest.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="footer-link inline-block hover:text-amber-200 transition-colors"
                  >
                    Pinterest
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar / Copyright */}
          <div class="footer-bottom w-full border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono tracking-[0.25em] uppercase text-slate-400 gap-4">
            <p>© 2026 VINTEGE.DIGITAL</p>
            <div class="flex items-center space-x-6">
              <a href="#privacy" class="hover:text-amber-200 transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#terms" class="hover:text-amber-200 transition-colors">Terms of Use</a>
            </div>
          </div>
        </div>
      </footer>
    );
  },
});