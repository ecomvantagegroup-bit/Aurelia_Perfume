import { defineComponent, ref, onMounted, onUnmounted, nextTick } from 'vue';
import * as THREE from 'three';
import gsap from 'gsap';
import './hero.css';

export default defineComponent({
  name: 'HeroSection',
  emits: ['explore'],
  setup(_, { emit }) {
    const canvasContainerRef = ref(null);
    const logoRef = ref(null);
    const subtitleRef = ref(null);
    const taglineRef = ref(null);
    const ctaRef = ref(null);
    const scrollRef = ref(null);

    let renderer, scene, camera, bottleGroup, animationFrameId;

    // Helper: Create procedural studio reflection texture
    const createStudioEnvironment = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      const gradient = ctx.createLinearGradient(0, 0, 512, 512);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.3, '#888888');
      gradient.addColorStop(0.7, '#111111');
      gradient.addColorStop(1, '#000000');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);

      const texture = new THREE.CanvasTexture(canvas);
      texture.mapping = THREE.EquirectangularReflectionMapping;
      return texture;
    };

    const initThreeScene = (container) => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      scene = new THREE.Scene();
      scene.environment = createStudioEnvironment();

      camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      camera.position.set(0, 0.2, 6.5);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;

      container.appendChild(renderer.domElement);

      // ===========================
      // Studio Lighting Setup
      // ===========================

      // Low Ambient Base
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
      scene.add(ambientLight);

      // Key Warm Studio Light
      const keyLight = new THREE.DirectionalLight(0xf2e3c6, 3.5);
      keyLight.position.set(4, 6, 3);
      scene.add(keyLight);

      // Left Edge Rim Light (Sharp White Silhouette)
      const leftRim = new THREE.DirectionalLight(0xffffff, 4.0);
      leftRim.position.set(-6, 2, -2);
      scene.add(leftRim);

      // Right Edge Rim Light (Champagne Accent Silhouette)
      const rightRim = new THREE.DirectionalLight(0xc5a059, 3.0);
      rightRim.position.set(6, -1, -2);
      scene.add(rightRim);

      // Top Soft Overhead Light
      const topLight = new THREE.PointLight(0xffffff, 2.0, 10);
      topLight.position.set(0, 4, 1);
      scene.add(topLight);

      // ===========================
      // 3D Bottle Geometry & Materials (No Label)
      // ===========================

      bottleGroup = new THREE.Group();

      const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x08080a,
        metalness: 0.1,
        roughness: 0.08,
        transmission: 0.9,
        ior: 1.52,
        thickness: 1.5,
        specularIntensity: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.03,
        reflectivity: 0.9,
      });

      const goldCapMaterial = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.92,
        roughness: 0.18,
      });

      // 1. Monolithic Glass Body
      const bodyGeo = new THREE.CylinderGeometry(0.8, 0.8, 2.3, 48);
      const bottleBody = new THREE.Mesh(bodyGeo, glassMaterial);
      bottleBody.position.y = -0.3;
      bottleGroup.add(bottleBody);

      // 2. Metallic Neck Ring
      const neckGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.25, 32);
      const neckMesh = new THREE.Mesh(neckGeo, goldCapMaterial);
      neckMesh.position.y = 0.95;
      bottleGroup.add(neckMesh);

      // 3. Polished Metallic Cap
      const capGeo = new THREE.BoxGeometry(0.6, 0.7, 0.6);
      const capMesh = new THREE.Mesh(capGeo, goldCapMaterial);
      capMesh.position.y = 1.4;
      bottleGroup.add(capMesh);

      // Position & Angle Setup
      bottleGroup.position.set(0, -0.2, 0);
      bottleGroup.rotation.x = 0.05;
      bottleGroup.rotation.z = -0.04;

      scene.add(bottleGroup);

      // Render & Slow Rotation Loop
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        if (bottleGroup) {
          bottleGroup.rotation.y += 0.0035;
        }
        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);
    };

    onMounted(async () => {
      await nextTick();
      if (canvasContainerRef.value) {
        initThreeScene(canvasContainerRef.value);
      }

      // GSAP Entrance Animation Timeline
      const timeline = gsap.timeline({ delay: 0.2 });

      timeline.fromTo(
        logoRef.value,
        { opacity: 0, y: 35, letterSpacing: '0.2em' },
        { opacity: 1, y: 0, letterSpacing: '0.5em', duration: 1.4, ease: 'power3.out' }
      );

      timeline.fromTo(
        subtitleRef.value,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.8'
      );

      if (bottleGroup) {
        timeline.fromTo(
          bottleGroup.position,
          { y: -1.2, opacity: 0 },
          { y: -0.2, opacity: 1, duration: 1.6, ease: 'power3.out' },
          '-=1.0'
        );
      }

      timeline.fromTo(
        [taglineRef.value, ctaRef.value],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' },
        '-=0.6'
      );

      timeline.fromTo(
        scrollRef.value,
        { opacity: 0 },
        { opacity: 0.7, duration: 0.8, ease: 'power2.out' },
        '-=0.2'
      );
    });

    onUnmounted(() => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (renderer) renderer.dispose();
    });

    return () => (
      <section class="hero-container">
        {/* Dual Radial Ambient Studio Glow */}
        <div class="hero-glow-primary" />
        <div class="hero-glow-secondary" />

        {/* 3D Render Canvas */}
        <div ref={canvasContainerRef} class="hero-canvas-container" />

        {/* Header Branding */}
        <div class="relative z-10 text-center pt-8 md:pt-12">
          <h1
            ref={logoRef}
            class="text-4xl md:text-6xl lg:text-7xl font-light uppercase text-white tracking-[0.5em]"
          >
            A U R E L I A
          </h1>

          <p
            ref={subtitleRef}
            class="mt-4 text-xs md:text-sm font-extralight uppercase tracking-[0.35em] text-primary"
          >
            THE ART OF SCENT
          </p>
        </div>

        {/* Bottom Content & Interactive Actions */}
        <div class="relative z-10 flex flex-col items-center text-center my-auto pt-52 md:pt-64">
          <div ref={taglineRef} class="space-y-1 text-sm md:text-base font-extralight tracking-[0.2em] text-muted uppercase">
            <p>Three worlds.</p>
            <p>Three compositions.</p>
            <p class="text-text font-light pt-1">One signature.</p>
          </div>

          <div ref={ctaRef} class="mt-8">
            <button
              class="btn btn-primary"
              onClick={() => emit('explore')}
            >
              Explore the Collection
            </button>
          </div>
        </div>

        {/* Scroll Indicator Prompt */}
        <div
          ref={scrollRef}
          class="scroll-indicator-wrapper pb-6"
          onClick={() => emit('explore')}
        >
          <span class="text-[10px] font-extralight uppercase tracking-[0.3em]">
            SCROLL TO DISCOVER
          </span>
          <span class="scroll-arrow text-sm">↓</span>
        </div>
      </section>
    );
  }
});