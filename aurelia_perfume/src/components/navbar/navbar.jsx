import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import './navbar.css';

export default defineComponent({
  name: 'Navbar',
  setup() {
    const isVisible = ref(false);

    // Mouse movement handler to reveal navbar when near top threshold (first 80px)
    const handleMouseMove = (event) => {
      if (event.clientY <= 80) {
        isVisible.value = true;
      } else if (event.clientY > 120 && isVisible.value) {
        isVisible.value = false;
      }
    };

    onMounted(() => {
      window.addEventListener('mousemove', handleMouseMove);
    });

    onUnmounted(() => {
      window.removeEventListener('mousemove', handleMouseMove);
    });

    const navItems = [
      { name: 'Fragrances', href: '#fragrances' },
      { name: 'The Craft', href: '#craft' },
      { name: 'Notes & Accord', href: '#notes' },
      { name: 'Bespoke', href: '#bespoke' },
    ];

    return () => (
      <>
        {/* Top hover detection zone */}
        <div
          class="nav-trigger-zone"
          onMouseenter={() => (isVisible.value = true)}
        />

        {/* Animated Navigation Header */}
        <header
          class={['nav-header', isVisible.value ? 'nav-visible' : 'nav-hidden']}
          onMouseleave={() => (isVisible.value = false)}
        >
          <div class="container flex h-20 items-center justify-between">
            {/* Brand Logo */}
            <a href="#" class="text-lg md:text-xl font-light uppercase tracking-[0.5em] text-white">
              A U R E L I A
            </a>

            {/* Navigation Links */}
            <nav class="hidden md:flex items-center gap-10">
              {navItems.map((item) => (
                <a key={item.name} href={item.href} class="nav-link">
                  {item.name}
                </a>
              ))}
            </nav>

            {/* Header Actions */}
            <div class="flex items-center gap-6">
              <button class="text-xs tracking-[0.2em] uppercase text-text/80 hover:text-primary transition-colors">
                Search
              </button>
              <button class="btn btn-outline py-2 px-5 text-[10px]">
                Bag (0)
              </button>
            </div>
          </div>
        </header>
      </>
    );
  },
});