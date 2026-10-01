import { defineComponent, ref, onMounted, onUnmounted, nextTick } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { loadContent } from '@/utils/dataLoader';

import HeroSection from '../sections/hero/hero';
import ForestEssence from '../sections/forest_essence/forest_essence';
import FragranceNotes from '../sections/fragrance_notes/fragrance_notes';
import OceanBloom from '../sections/ocean_bloom/ocean_bloom';
import AureliaStory from '../sections/aurelia_story/aurelia_story';
import GoldenAmber from '../sections/golden_amber/amber';
import Collection from '../sections/collection/collection';
import Cta from '../sections/cta/cta';
import Footer from '../sections/footer/footer';

gsap.registerPlugin(ScrollTrigger);

export default defineComponent({
    name: 'ContentLayer',
    emits: ['contentReady'],
    setup(_, { emit }) {
        const sequenceWrapperRef = ref(null);
        const content = ref(null);
        let triggerInstance = null;
        let disposed = false;

        const initMasterSequence = () => {
            if (disposed || !sequenceWrapperRef.value) return;

            if (triggerInstance) triggerInstance.kill();

            // Master continuous trigger spanning image sequence sections (Forest -> CTA)
            triggerInstance = ScrollTrigger.create({
                trigger: sequenceWrapperRef.value,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    window.dispatchEvent(
                        new CustomEvent('global-sequence-progress', {
                            detail: { progress: self.progress },
                        })
                    );
                },
            });
        };

        onMounted(async () => {
            // 1. Read content.json first; sections are only rendered once it exists.
            try {
                content.value = await loadContent();
            } catch (err) {
                console.error('[ContentLayer] Failed to load data/content.json:', err);
            }
            if (disposed) return;

            // 2. Wait for the sections to mount (their GSAP pins are created in
            //    their own onMounted hooks), then tell the app.
            await nextTick();
            emit('contentReady', !!content.value);

            // Allow child section pins (e.g. CTA, Collection) to initialize first
            setTimeout(() => {
                initMasterSequence();
                ScrollTrigger.refresh();
            }, 200);
        });

        onUnmounted(() => {
            disposed = true;
            if (triggerInstance) {
                triggerInstance.kill();
                triggerInstance = null;
            }
        });

        return () => {
            const c = content.value;

            /* Root Layer: Set pointer-events-none so raycasting hits 3D layer behind empty space */
            if (!c) return <div class="content-layer relative z-30 w-full pointer-events-none" />;

            return (
                <div class="content-layer relative z-30 w-full pointer-events-none">
                    {/* 01 — Standalone Hero */}
                    <div id="sec-hero" class="relative z-10 bg-black text-amber-400 pointer-events-auto">
                        <HeroSection content={c.hero} />
                    </div>

                    {/* 02-09 — Master Continuous Canvas Sequence Container */}
                    <div ref={sequenceWrapperRef} class="relative w-full">
                        <div id="sec-forest" class="pointer-events-auto">
                            <ForestEssence content={c.forest} />
                        </div>
                        <div id="sec-notes" class="pointer-events-auto">
                            <FragranceNotes content={c.notes} />
                        </div>
                        <div id="sec-ocean" class="pointer-events-auto">
                            <OceanBloom content={c.ocean} />
                        </div>
                        <div id="sec-story" class="pointer-events-auto">
                            <AureliaStory content={c.story} />
                        </div>
                        <div id="sec-amber" class="pointer-events-auto">
                            <GoldenAmber content={c.amber} />
                        </div>
                        <div id="sec-collection" class="relative w-full pointer-events-auto">
                            <Collection content={c.collection} />
                        </div>
                        <div id="sec-cta" class="relative w-full pointer-events-auto">
                            <Cta content={c.cta} />
                        </div>
                    </div>

                    {/* 10 — Standalone Footer */}
                    <div id="sec-footer" class="relative z-20 w-full bg-[#050507] pointer-events-auto">
                        <Footer content={c.footer} />
                    </div>
                </div>
            );
        };
    },
});