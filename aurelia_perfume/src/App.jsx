import { defineComponent, ref } from "vue";
import Preloader from "./components/preloader/preloader";

export default defineComponent({
  name: "App",

  setup() {
    const isLoading = ref(true);

    const handleLoaded = () => {
      isLoading.value = false;
    };

    return () => (
      <main class="min-h-screen bg-background text-text">
        {/* Render Preloader until completion event fires */}
        {isLoading.value && <Preloader onLoaded={handleLoaded} />}

        <section class="container flex min-h-screen flex-col items-center justify-center text-center">
          <span class="mb-4 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            Luxury Fragrances
          </span>

          <h1 class="heading text-gradient">
            Aurelia Perfume
          </h1>

          <p class="subheading mt-6 max-w-2xl">
            Discover timeless fragrances crafted with elegance,
            sophistication, and unforgettable aromas.
          </p>

          <div class="mt-10 flex gap-4">
            <button class="btn btn-primary">
              Shop Now
            </button>

            <button class="btn btn-outline">
              Explore Collection
            </button>
          </div>
        </section>
      </main>
    );
  },
});