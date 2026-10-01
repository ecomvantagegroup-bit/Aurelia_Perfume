import { defineComponent, ref, computed, onUnmounted, nextTick } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Layer Controllers & System Overlays
import Preloader from './components/preloader/preloader';
import Navbar from './components/navbar/navbar';
import BackgroundLayerController from './components/background_layer/BackgroundLayerController.jsx';
import Interactive3DLayer from './components/interactive-3d-layer/Interactive3DLayer.jsx';

// Content Layer
import ContentLayer from './components/content_layer/content_layer.jsx';

gsap.registerPlugin(ScrollTrigger);

export default defineComponent({
    name: 'App',
    setup() {
        const isLoading = ref(true);
        const activeSection = ref('hero');
        let scrollTriggers = [];

        // Real asset loading state from each layer that has something to
        // preload. Interactive3DLayer reports models/textures/shaders;
        // BackgroundLayerController reports its image-sequence frames;
        // ContentLayer reports that content.json has been read and the
        // sections are mounted. The Preloader is only told the experience is
        // "ready" once every layer has finished.
        const assetsReady = ref(false);
        const assetsCount = ref({ loaded: 0, total: 0 });

        const bgReady = ref(false);
        const bgCount = ref({ loaded: 0, total: 0 });

        const contentReady = ref(false);

        // A finished layer always counts as fully loaded (and as at least one
        // source, so an empty/failed list can't leave the bar stuck at 0).
        const settle = (count, ready) => {
            if (!ready) return count;
            const total = Math.max(count.total, 1);
            return { loaded: total, total };
        };

        // The list the Preloader displays: how many sources of each kind are
        // loaded out of how many exist.
        const sources = computed(() => [
            { label: 'Content', loaded: contentReady.value ? 1 : 0, total: 1 },
            { label: 'Image frames', ...settle(bgCount.value, bgReady.value) },
            { label: '3D models', ...settle(assetsCount.value, assetsReady.value) },
        ]);

        // Overall progress is the real loaded / total across every source.
        // Stays at 0 until every layer has reported its total, so the bar can't
        // briefly claim a high percentage while totals are still unknown.
        const combinedProgress = computed(() => {
            const list = sources.value;
            if (list.some((s) => s.total === 0)) return 0;
            const loaded = list.reduce((sum, s) => sum + s.loaded, 0);
            const total = list.reduce((sum, s) => sum + s.total, 0);
            return Math.round((loaded / total) * 100);
        });

        const combinedReady = computed(() => assetsReady.value && bgReady.value && contentReady.value);

        const handlePreloaderLoaded = () => {
            isLoading.value = false;
            nextTick(() => {
                ScrollTrigger.refresh();
            });
        };

        const handleAssetsProgress = (_percent, loaded = 0, total = 0) => {
            assetsCount.value = { loaded, total };
        };

        const handleAssetsReady = () => {
            assetsReady.value = true;
        };

        const handleBgProgress = (_percent, loaded = 0, total = 0) => {
            bgCount.value = { loaded, total };
        };

        const handleBgReady = () => {
            bgReady.value = true;
        };

        const initScrollTriggers = () => {
            scrollTriggers.forEach((st) => st.kill());
            scrollTriggers = [];

            const sections = [
                { id: 'sec-hero', key: 'hero' },
                { id: 'sec-forest', key: 'forest' },
                { id: 'sec-notes', key: 'notes' },
                { id: 'sec-ocean', key: 'ocean' },
                { id: 'sec-story', key: 'story' },
                { id: 'sec-amber', key: 'amber' },
                { id: 'sec-collection', key: 'collection' },
                { id: 'sec-cta', key: 'cta' },
                { id: 'sec-footer', key: 'footer' },
            ];

            sections.forEach(({ id, key }) => {
                const el = document.getElementById(id);
                if (!el) return;

                const isCollection = key === 'collection';

                const trigger = ScrollTrigger.create({
                    trigger: el,
                    start: isCollection ? 'top top' : 'top 50%',
                    end: isCollection ? 'bottom top' : 'bottom 50%',
                    onEnter: () => {
                        activeSection.value = key;
                    },
                    onEnterBack: () => {
                        activeSection.value = key;
                    },
                });

                scrollTriggers.push(trigger);
            });
        };

        // Sections only exist in the DOM once content.json has been loaded, so
        // the section-tracking triggers are created here instead of in
        // onMounted.
        const handleContentReady = async () => {
            contentReady.value = true;
            await nextTick();
            initScrollTriggers();

            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 200);
        };

        onUnmounted(() => {
            scrollTriggers.forEach((st) => st.kill());
            scrollTriggers = [];
        });

        return () => (
            <main class="relative min-h-screen w-full bg-background text-text selection:bg-primary selection:text-black overflow-x-hidden">
                {/* System Overlays */}
                {isLoading.value && (
                    <Preloader
                        progress={combinedProgress.value}
                        sources={sources.value}
                        ready={combinedReady.value}
                        onLoaded={handlePreloaderLoaded}
                    />
                )}
                <Navbar activeSection={activeSection.value} class="z-50" />

                {/* Layer 1: Background Controller */}
                <div class="fixed inset-0 z-0 pointer-events-none">
                    <BackgroundLayerController
                        activeSection={activeSection.value}
                        onAssetsProgress={handleBgProgress}
                        onAssetsReady={handleBgReady}
                    />
                </div>

                {/* Layer 2: 3D Canvas Container */}
                <div class="fixed inset-0 z-20 pointer-events-none">
                    <Interactive3DLayer
                        activeSection={activeSection.value}
                        onAssetsProgress={handleAssetsProgress}
                        onAssetsReady={handleAssetsReady}
                    />
                </div>

                {/* Layer 3: HTML Content Layer (Text, Buttons, Cards) */}
                <div class="relative z-30 pointer-events-none">
                    <ContentLayer onContentReady={handleContentReady} />
                </div>
            </main>
        );
    },
});