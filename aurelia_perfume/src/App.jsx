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

        
      </main>
    );
  },
});