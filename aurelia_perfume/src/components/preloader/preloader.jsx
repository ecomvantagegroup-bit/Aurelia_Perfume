import { defineComponent, ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import gsap from 'gsap';
import './preloader.css';

export default defineComponent({
    name: 'Preloader',
    props: {
        // Real 0-100 loading progress reported by the app (3D layer + image
        // sequence frames).
        progress: {
            type: Number,
            default: 0,
        },
        // True once EVERY app-level resource has finished: content.json,
        // sequences.json / all frames, models.json / all models, textures and
        // shader warm-up. The preloader never exits before this is true.
        ready: {
            type: Boolean,
            default: false,
        },
        // Per-kind source counts shown under the bar, e.g.
        // [{ label: 'Image frames', loaded: 120, total: 744 }, ...]
        sources: {
            type: Array,
            default: () => [],
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
        let exitDelayCall = null;

        // ---------------------------------------------------------------------
        // Browser-level gates. On top of the app's `ready` flag, the preloader
        // also waits for web fonts and the page's own load event (CSS, images
        // referenced in markup, etc.), so nothing visible can still pop in
        // after the preloader is gone.
        // ---------------------------------------------------------------------
        let fontsReady = !(typeof document !== 'undefined' && document.fonts && document.fonts.ready);
        let pageLoaded = typeof document === 'undefined' || document.readyState === 'complete';

        const allResourcesReady = () => props.ready && fontsReady && pageLoaded;

        // Keeps the preloader visible for at least as long as its own entrance
        // animation takes, so a fully-cached/instant load still reads as a
        // deliberate reveal instead of a flash. This is purely a display
        // *minimum* — it never fakes or blocks the underlying progress value.
        const mountedAt = typeof performance !== 'undefined' ? performance.now() : Date.now();
        const MIN_DISPLAY_MS = 1800;

        // ---------------------------------------------------------------------
        // Scroll lock while loading, so the user can't scroll (and trigger
        // section changes / pins) before the experience is fully ready.
        // ---------------------------------------------------------------------
        let previousHtmlOverflow = '';
        let previousBodyOverflow = '';
        let scrollLocked = false;

        const lockScroll = () => {
            if (scrollLocked) return;
            scrollLocked = true;
            previousHtmlOverflow = document.documentElement.style.overflow;
            previousBodyOverflow = document.body.style.overflow;
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
        };

        const unlockScroll = () => {
            if (!scrollLocked) return;
            scrollLocked = false;
            document.documentElement.style.overflow = previousHtmlOverflow;
            document.body.style.overflow = previousBodyOverflow;
        };

        const runExit = () => {
            if (hasExited) return;
            hasExited = true;

            // Exit Animation (Fade out into main experience)
            const exitTl = gsap.timeline({
                onComplete: () => {
                    unlockScroll();
                    emit('loaded');
                },
            });

            exitTl
                .to(
                    [
                        logoRef.value,
                        subtitleRef.value,
                        progressTrackRef.value,
                        percentageRef.value,
                        footerRef.value,
                    ],
                    {
                        opacity: 0,
                        y: -15,
                        duration: 0.6,
                        stagger: 0.06,
                        ease: 'power2.in',
                    }
                )
                .to(
                    preloaderRef.value,
                    {
                        opacity: 0,
                        duration: 0.8,
                        ease: 'power3.inOut',
                    },
                    '-=0.2'
                );
        };

        const animateDisplayTo = (target, onArrive) => {
            gsap.to(displayState, {
                value: target,
                duration: 0.35,
                ease: 'power1.out',
                overwrite: true,
                onUpdate: () => {
                    progress.value = Math.round(displayState.value);
                },
                onComplete: () => {
                    if (onArrive) onArrive();
                },
            });
        };

        // Runs only when every gate is open. Safe to call repeatedly — each
        // gate (app ready, fonts, page load) calls it when it opens, and it
        // does nothing until the last one has.
        let exitScheduled = false;
        const attemptExit = () => {
            if (hasExited || exitScheduled || !allResourcesReady()) return;
            exitScheduled = true;

            const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
            const wait = Math.max(0, MIN_DISPLAY_MS - (now - mountedAt));

            animateDisplayTo(100, () => {
                if (wait > 0) {
                    exitDelayCall = gsap.delayedCall(wait / 1000, runExit);
                } else {
                    runExit();
                }
            });
        };

        watch(
            () => props.progress,
            (val) => {
                if (hasExited || exitScheduled) return;
                // Cap at 99 until every gate is open, so the bar never claims
                // completion before everything is truly loaded. Never moves
                // backwards, even if a layer's own number dips.
                const target = Math.max(displayState.value, Math.min(val, 99));
                animateDisplayTo(target);
            }
        );

        watch(
            () => props.ready,
            () => attemptExit()
        );

        const handleWindowLoad = () => {
            pageLoaded = true;
            attemptExit();
        };

        onMounted(async () => {
            lockScroll();

            if (!pageLoaded) {
                window.addEventListener('load', handleWindowLoad, { once: true });
            }

            if (!fontsReady) {
                document.fonts.ready
                    .then(() => {
                        fontsReady = true;
                        attemptExit();
                    })
                    .catch(() => {
                        // A font API failure must never trap the user on the loader.
                        fontsReady = true;
                        attemptExit();
                    });
            }

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

            // Covers the edge case where everything finished loading before this
            // component even mounted (e.g. a fully cached repeat visit) — the
            // watchers above would have already missed their trigger.
            attemptExit();
        });

        onBeforeUnmount(() => {
            window.removeEventListener('load', handleWindowLoad);
            if (exitDelayCall) exitDelayCall.kill();
            gsap.killTweensOf(displayState);
            unlockScroll();
        });

        // Overall "x / y sources" across every kind. Kinds whose total isn't
        // known yet are skipped, so the line only shows once there is a real
        // number to show.
        const overallCounts = () => {
            const known = props.sources.filter((s) => s.total > 0);
            return {
                loaded: known.reduce((sum, s) => sum + s.loaded, 0),
                total: known.reduce((sum, s) => sum + s.total, 0),
            };
        };

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

                        {/* Sources loaded: overall count, then a line per kind */}
                        <div class="mt-3 text-center text-[10px] font-mono tracking-[0.2em] uppercase text-white/70">
                            {overallCounts().total > 0
                                ? `${overallCounts().loaded} / ${overallCounts().total} sources loaded`
                                : 'Preparing sources…'}
                        </div>

                        <div class="mt-3 space-y-1">
                            {props.sources.map((s) => (
                                <div
                                    key={s.label}
                                    class="flex items-center justify-between text-[10px] font-mono tracking-[0.15em] uppercase text-white/40"
                                >
                                    <span>{s.label}</span>
                                    <span>{s.total > 0 ? `${s.loaded} / ${s.total}` : '—'}</span>
                                </div>
                            ))}
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
    },
});