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

    onMounted(async () => {
      await nextTick();

      // Intro Entrance Animation
      const introTl = gsap.timeline();
      introTl
        .fromTo(
          logoRef.value,
          { opacity: 0, y: 20, letterSpacing: '0.2em' },
          { opacity: 1, y: 0, letterSpacing: '0.6em', duration: 1.2, ease: 'power3.out' }
        )
        .fromTo(
          subtitleRef.value,
          { opacity: 0, y: 10 },
          { opacity: 0.7, y: 0, duration: 0.8, ease: 'power2.out' },
          '-=0.6'
        )
        .fromTo(
          [progressTrackRef.value, percentageRef.value],
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
          // Exit Animation (Fade out to hero)
          const exitTl = gsap.timeline({
            onComplete: () => {
              emit('loaded');
            }
          });

          exitTl
            .to([logoRef.value, subtitleRef.value, progressTrackRef.value, percentageRef.value], {
              opacity: 0,
              y: -20,
              duration: 0.6,
              stagger: 0.08,
              ease: 'power2.in'
            })
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
        {/* Top Spacer */}
        <div class="h-8" />

        {/* Core Brand & Loading Content */}
        <div class="flex flex-col items-center text-center">
          <h1
            ref={logoRef}
            class="text-2xl md:text-4xl font-light uppercase tracking-[0.6em] text-white"
          >
            A U R E L I A
          </h1>

          <p
            ref={subtitleRef}
            class="preloader-accent-text mt-3 text-xs md:text-sm font-medium tracking-[0.3em] uppercase"
          >
            Loading Experience
          </p>

          {/* Progress Bar Container */}
          <div class="mt-10 w-48 md:w-64">
            <div ref={progressTrackRef} class="preloader-track">
              <div
                class="preloader-bar"
                style={{ width: `${progress.value}%` }}
              />
            </div>

            {/* Percentage Display */}
            <div
              ref={percentageRef}
              class="mt-3 text-[10px] tracking-widest text-gray-400 font-mono text-center"
            >
              {String(progress.value).padStart(3, '0')} %
            </div>
          </div>
        </div>

        {/* Minimal Footer Details */}
        <div class="preloader-muted-text text-[10px] tracking-widest uppercase opacity-60">
          Application Shell &bull; Assets &bull; 3D Model
        </div>
      </div>
    );
  }
});