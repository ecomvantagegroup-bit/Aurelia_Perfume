import { defineComponent, ref, onMounted, nextTick } from 'vue';
import gsap from 'gsap';
import './preloader.css';

export default defineComponent({
  name: 'Preloader',
  emits: ['loaded'],
  setup(_, { emit }) {
    const progress = ref(0);
    const preloaderRef = ref(null);
    const logoRef = ref(null);
    const subtitleRef = ref(null);
    const progressTrackRef = ref(null);
    const percentageRef = ref(null);
    const footerRef = ref(null);

    onMounted(async () => {
      await nextTick();

      // Intro Entrance Animation
      const introTl = gsap.timeline();
      introTl
        .fromTo(
          logoRef.value,
          { opacity: 0, y: 25, letterSpacing: '0.2em' },
          { opacity: 1, y: 0, letterSpacing: '0.6em', duration: 1.2, ease: 'power3.out' }
        )
        .fromTo(
          subtitleRef.value,
          { opacity: 0, y: 10 },
          { opacity: 0.8, y: 0, duration: 0.8, ease: 'power2.out' },
          '-=0.6'
        )
        .fromTo(
          [progressTrackRef.value, percentageRef.value, footerRef.value],
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.4'
        );

      // Progress Simulation
      const progressObj = { value: 0 };
      gsap.to(progressObj, {
        value: 100,
        duration: 2.5,
        delay: 0.5,
        ease: 'power1.inOut',
        onUpdate: () => {
          progress.value = Math.round(progressObj.value);
        },
        onComplete: () => {
          // Exit Animation (Fade out into main experience)
          const exitTl = gsap.timeline({
            onComplete: () => {
              emit('loaded');
            }
          });

          exitTl
            .to(
              [
                logoRef.value,
                subtitleRef.value,
                progressTrackRef.value,
                percentageRef.value,
                footerRef.value
              ],
              {
                opacity: 0,
                y: -15,
                duration: 0.6,
                stagger: 0.06,
                ease: 'power2.in'
              }
            )
            .to(
              preloaderRef.value,
              {
                opacity: 0,
                duration: 0.8,
                ease: 'power3.inOut'
              },
              '-=0.2'
            );
        }
      });
    });

    return () => (
      <div ref={preloaderRef} class="preloader-screen">
        {/* Dead Center Wrapper */}
        <div class="preloader-center-content">
          {/* Main Logo */}
          <h1
            ref={logoRef}
            class="text-3xl md:text-5xl font-light uppercase tracking-[0.6em] text-white"
          >
            A U R E L I A
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            class="preloader-accent-text mt-4 text-xs font-light tracking-[0.35em] uppercase opacity-90"
          >
            Loading Experience
          </p>

          {/* Minimal Progress Bar */}
          <div class="mt-12 w-48 md:w-60">
            <div ref={progressTrackRef} class="preloader-track">
              <div
                class="preloader-bar"
                style={{ width: `${progress.value}%` }}
              />
            </div>

            {/* Percentage Indicator */}
            <div
              ref={percentageRef}
              class="mt-4 text-[11px] tracking-[0.2em] font-mono text-center text-white/50"
            >
              {String(progress.value).padStart(3, '0')} %
            </div>
          </div>

          {/* Footnote Details */}
          <div
            ref={footerRef}
            class="preloader-muted-text mt-12 text-[10px] tracking-[0.25em] uppercase opacity-50 font-light"
          >
            Application Shell &bull; Assets &bull; 3D Model
          </div>
        </div>
      </div>
    );
  }
});