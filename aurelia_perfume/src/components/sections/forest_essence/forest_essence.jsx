import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './forest_essence.css';

gsap.registerPlugin(ScrollTrigger);

export default defineComponent({
    name: 'ForestEssence',
    props: {
        // Text comes from data/content.json -> "forest"
        content: { type: Object, required: true },
    },
    emits: ['explore-notes'],
    setup(props, { emit }) {
        const sectionRef = ref(null);
        let ctx = null;

        onMounted(() => {
            const sectionEl = sectionRef.value || document.getElementById('sec-forest');
            if (!sectionEl) return;

            ctx = gsap.context(() => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionEl,
                        start: 'top top',
                        end: '+=200%',
                        pin: true,
                        scrub: 0.5,
                        onUpdate: (self) => {
                            window.dispatchEvent(
                                new CustomEvent('forest-scroll-progress', {
                                    detail: { progress: self.progress, direction: self.direction },
                                })
                            );
                        },
                    },
                });

                tl.fromTo(
                    '.forest-title-anim',
                    { opacity: 0, y: 60, scale: 0.9 },
                    { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out' }
                )
                    .fromTo(
                        '.forest-badge-anim',
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' },
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
            const notes = c.notes || [];

            return (
                <section
                    ref={sectionRef}
                    id="sec-forest"
                    class="forest-section-container relative min-h-screen w-full flex items-center justify-center bg-transparent select-none overflow-hidden"
                >
                    <div class="forest-content-wrapper text-center max-w-3xl z-20">
                        <div class="forest-title-anim space-y-3 mb-6">
                            <span class="forest-number-tag inline-block">{c.number}</span>
                            <h2 class="forest-title">{c.title}</h2>
                        </div>

                        <div class="forest-notes-container forest-badge-anim mb-10">
                            {notes.map((note, i) => [
                                i > 0 && <span key={`sep-${i}`} class="forest-note-separator">•</span>,
                                <span key={note} class="forest-note-badge">{note}</span>,
                            ])}
                        </div>

                        <div class="forest-badge-anim">
                            <button
                                class="px-8 py-3 rounded-full border border-emerald-400/40 bg-emerald-950/20 text-emerald-200 text-xs font-mono uppercase tracking-widest backdrop-blur-md hover:bg-emerald-500/20 transition-all duration-300"
                                onClick={() => emit('explore-notes')}
                            >
                                {c.ctaLabel}
                            </button>
                        </div>
                    </div>
                </section>
            );
        };
    },
});