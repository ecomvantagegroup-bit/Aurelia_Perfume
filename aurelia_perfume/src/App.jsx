import { defineComponent, ref } from "vue";
import Preloader from "./components/preloader/preloader";
import Navbar from "./components/navbar/navbar";
import HeroSection from "./components/hero/hero";

export default defineComponent({
  name: "App",

  setup() {
    const isLoading = ref(true);

    const handleLoaded = () => {
      isLoading.value = false;
    };

    const handleExplore = () => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
      });
    };

    return () => (
      <main class="relative min-h-screen bg-background text-text selection:bg-primary selection:text-black">
        {/* Preloader Overlay */}
        {isLoading.value && <Preloader onLoaded={handleLoaded} />}

        {/* Top Auto-Hiding Navbar */}
        <Navbar />

        {/* Ambient Dark Luxury Background Glow */}
        <div class="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
          <div class="h-[600px] w-[600px] rounded-full bg-primary/5 blur-[160px]" />
        </div>

        {/* Interactive 3D Hero Section */}
        <HeroSection onExplore={handleExplore} />
      </main>
    );
  },
});