import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './fragrance_notes.css';

gsap.registerPlugin(ScrollTrigger);

export default defineComponent({
    name: 'FragranceNotes',
    props: {
        // Text comes from data/content.json -> "notes"
        content: { type: Object, required: true },
    },
    setup(props) {
        const sectionRef = ref(null);
        let ctx = null;

        onMounted(() => {
            const sectionEl = sectionRef.value || document.getElementById('sec-notes');
            if (!sectionEl) return;

            ctx = gsap.context(() => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionEl,
                        start: 'top top',
                        end: '+=180%',
                        pin: true,
                        scrub: 0.5,
                    },
                });

                // Crisp Forest Sunrise Aura Expansion
                tl.fromTo(
                    '.forest-aura',
                    { scale: 0.5, opacity: 0 },
                    { scale: 1.3, opacity: 0.85, duration: 1.5, ease: 'power2.out' }
                )
                    .fromTo(
                        '.pyramid-header',
                        { opacity: 0, y: 30 },
                        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
                        '-=1.2'
                    )
                    .fromTo(
                        '.pyramid-tier',
                        { opacity: 0, scaleX: 0.7, y: 20 },
                        { opacity: 1, scaleX: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power2.out' },
                        '-=0.6'
                    );
            }, sectionEl);

            ScrollTrigger.refresh();
        });

        onUnmounted(() => {
            if (ctx) ctx.revert();
        });

        return () => {
            const c = props.content;
            const pyramid = c.pyramid || [];
            const footer = c.footer || [];

            return (
                <section
                    ref={sectionRef}
                    id="sec-notes"
                    class="notes-section-container relative min-h-screen w-full flex flex-col justify-center items-center px-6 md:px-16 bg-transparent select-none overflow-hidden"
                >
                    {/* Crisp Emerald & White Sunrise Aura */}
                    <div class="forest-aura pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[450px] md:w-[900px] md:h-[600px] rounded-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-emerald-400/20 via-white/10 to-transparent blur-3xl opacity-0 z-0" />

                    <div class="max-w-3xl w-full z-10 flex flex-col items-center space-y-8">
                        <div class="pyramid-header text-center space-y-3">
                            <p class="text-xs font-mono uppercase tracking-[0.3em] text-emerald-200/90 font-medium">
                                {c.chapter}
                            </p>

                            {/* Crisp Premium White & Emerald Gradient Title */}
                            <h1 class="text-4xl md:text-6xl font-extralight tracking-tight text-white font-serif">
                                {c.titleLead}{' '}
                                <span class="italic font-normal bg-gradient-to-r from-white via-emerald-100 to-emerald-300 bg-clip-text text-transparent">
                                    {c.titleAccent}
                                </span>
                            </h1>

                            <p class="text-xs md:text-sm font-mono tracking-[0.25em] text-emerald-100/80 uppercase pt-1 font-light">
                                {c.subtitle}
                            </p>
                        </div>

                        {/* Premium Emerald & White Frosted Cards.
                Widths come from JSON as a plain percentage (inline style) —
                Tailwind classes can't live in JSON because Tailwind only
                generates classes it finds in source files. */}
                        <div class="w-full flex flex-col items-center space-y-4 pointer-events-auto">
                            {pyramid.map((note) => (
                                <div
                                    key={note.category}
                                    style={{ width: `${note.widthPercent ?? 100}%` }}
                                    class="pyramid-tier p-5 rounded-2xl border border-white/20 bg-emerald-950/40 backdrop-blur-xl text-center shadow-lg transition-all duration-300 hover:border-emerald-300/60 hover:bg-emerald-900/50 hover:shadow-[0_0_30px_rgba(52,211,153,0.15)]"
                                >
                                    <span class="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-300 font-semibold block mb-1">
                                        {note.category}
                                    </span>
                                    <p class="text-sm md:text-base font-light text-white tracking-wide">
                                        {note.detail}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div class="pyramid-header flex items-center justify-between w-full max-w-md text-[10px] font-mono tracking-[0.2em] text-emerald-100/70 uppercase pt-4 border-t border-emerald-400/20">
                            {footer.map((item) => (
                                <span key={item}>{item}</span>
                            ))}
                        </div>
                    </div>
                </section>
            );
        };
    },
});