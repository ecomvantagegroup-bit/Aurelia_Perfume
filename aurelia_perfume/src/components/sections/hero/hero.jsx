import { defineComponent, ref, onMounted } from 'vue';
import gsap from 'gsap';
import './hero.css';

export default defineComponent({
  name: 'HeroSection',
  emits: ['explore'],
  setup(_, { emit }) {
    const logoRef = ref(null);
    const subtitleRef = ref(null);
    const taglineRef = ref(null);
    const ctaRef = ref(null);
    const scrollRef = ref(null);

    onMounted(() => {
      // DOM-only Entrance Animation
      const timeline = gsap.timeline({ delay: 0.2 });

      timeline.fromTo(
        logoRef.value,
        { opacity: 0, y: 35, letterSpacing: '0.2em' },
        { opacity: 1, y: 0, letterSpacing: '0.5em', duration: 1.4, ease: 'power3.out' }
      );

      timeline.fromTo(
        subtitleRef.value,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.8'
      );

      timeline.fromTo(
        [taglineRef.value, ctaRef.value],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' },
        '-=0.4'
      );

      timeline.fromTo(
        scrollRef.value,
        { opacity: 0 },
        { opacity: 0.7, duration: 0.8, ease: 'power2.out' },
        '-=0.2'
      );
    });

    return () => (
      <section class="relative min-h-screen w-full flex flex-col justify-between px-6 py-10 md:px-12 lg:px-20 select-none">
        
        {/* Header Branding */}
        <div class="relative z-20 text-center pt-8 md:pt-12">
          <h1
            ref={logoRef}
            class="heading !text-4xl md:!text-6xl lg:!text-7xl !tracking-[0.5em] !font-light uppercase !text-white"
          >
            A U R E L I A
          </h1>

          <p
            ref={subtitleRef}
            class="mt-4 text-xs md:text-sm font-extralight uppercase tracking-[0.35em] text-primary"
          >
            THE ART OF SCENT
          </p>
        </div>

        {/* Bottom Content & Interactive Actions */}
        <div class="relative z-20 flex flex-col items-center text-center my-auto pt-52 md:pt-64">
          <div
            ref={taglineRef}
            class="space-y-1 text-sm md:text-base font-extralight tracking-[0.2em] text-muted uppercase"
          >
            <p>Three worlds.</p>
            <p>Three compositions.</p>
            <p class="text-text font-light pt-1">One signature.</p>
          </div>

          <div ref={ctaRef} class="mt-8">
            <button class="btn btn-primary" onClick={() => emit('explore')}>
              Explore the Collection
            </button>
          </div>
        </div>

        {/* Scroll Indicator Prompt */}
        <div
          ref={scrollRef}
          class="flex flex-col items-center gap-2 text-center text-muted transition-colors duration-300 hover:text-primary cursor-pointer pb-6"
          onClick={() => emit('explore')}
        >
          <span class="text-[10px] font-extralight uppercase tracking-[0.3em]">
            SCROLL TO DISCOVER
          </span>
          <span class="text-sm font-light tracking-widest transition-transform duration-500 ease-out">↓</span>
        </div>
      </section>
    );
  },
});