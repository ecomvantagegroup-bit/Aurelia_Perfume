import { defineComponent, ref, onMounted, watch, nextTick } from 'vue';
import gsap from 'gsap';
import './preloader.css';

export default defineComponent({
  name: 'Preloader',
  props: {
    // Real 0-100 asset loading progress, reported by the 3D layer.
    progress: {
      type: Number,
      default: 0,
    },
    // True once every 3D asset (models, textures, materials, shaders) has
    // finished loading and is safe to render without further stutter.
    ready: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['loaded'],
  setup(props, { emit }) {
    const progress = ref(0);
    const preloaderRef = ref(null);
    const logoRef = ref(null);
    const subtitleRef = ref(null);
    const progressTrackRef = ref(null);
    const percentageRef = ref(null);
    const footerRef = ref(null);

    // The number on screen is tweened toward whatever real progress value
    // just arrived, so it reads as continuous motion rather than jumping
    // between discrete percentages every time another asset finishes.
    const displayState = { value: 0 };
    let hasExited = false;

    // Keeps the preloader visible for at least as long as its own entrance
    // animation takes, so a fully-cached/instant load still reads as a
    // deliberate reveal instead of a flash. This is purely a display
    // *minimum* — it never fakes or blocks the underlying progress value,
    // it only delays the exit if real loading happens to finish first.
    const mountedAt = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const MIN_DISPLAY_MS = 1800;

    const runExit = () => {
      if (hasExited) return;
      hasExited = true;

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
    };

    const animateDisplayTo = (target, onArrive) => {
      gsap.to(displayState, {
        value: target,
        duration: 0.35,
        ease: 'power1.out',
        onUpdate: () => {
          progress.value = Math.round(displayState.value);
        },
        onComplete: () => {
          if (onArrive) onArrive();
        },
      });
    };

    const attemptExit = () => {
      if (hasExited) return;
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const elapsed = now - mountedAt;
      const wait = Math.max(0, MIN_DISPLAY_MS - elapsed);

      animateDisplayTo(100, () => {
        if (wait > 0) {
          gsap.delayedCall(wait / 1000, runExit);
        } else {
          runExit();
        }
      });
    };

    watch(
      () => props.progress,
      (val) => {
        if (hasExited || props.ready) return;
        // Cap under 100 until we get the real "ready" signal, so the bar
        // never claims completion before shaders/materials are actually
        // warmed up.
        animateDisplayTo(Math.min(val, 99));
      }
    );

    watch(
      () => props.ready,
      (val) => {
        if (val) attemptExit();
      }
    );

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

      // Covers the edge case where assets finished loading before this
      // component even mounted (e.g. a fully cached repeat visit) — the
      // watcher above would have already missed its trigger.
      if (props.ready) {
        attemptExit();
      }
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