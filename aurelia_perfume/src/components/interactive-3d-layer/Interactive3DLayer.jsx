import { defineComponent, ref, onMounted, onUnmounted, watch } from 'vue';
import * as THREE from 'three';
import gsap from 'gsap';

// =========================================================================
// STEP 1 FOR GLB FILE:
// Uncomment the line below when you are ready to import GLTFLoader.
// =========================================================================
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default defineComponent({
  name: 'Interactive3DLayer',
  props: {
    activeSection: {
      type: String,
      default: 'hero',
    },
  },
  setup(props) {
    const canvasRef = ref(null);
    const cardFrameRef = ref(null);

    let renderer, scene, camera, animationFrameId;
    const models = {
      hero: null,
      forest: null,
    };

    let floatingLeavesGroup = null;
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

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

    // MODEL 1: Monolithic Hero Bottle (Starts off-screen right)
    const createHeroBottle = () => {
      const bottleGroup = new THREE.Group();
      const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x08080a,
        metalness: 0.1,
        roughness: 0.08,
        transmission: 0.9,
        ior: 1.52,
        thickness: 1.5,
        clearcoat: 1.0,
      });
      const goldMaterial = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.92,
        roughness: 0.18,
      });

      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2.3, 48), glassMaterial);
      body.position.y = -0.3;
      bottleGroup.add(body);

      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.25, 32), goldMaterial);
      neck.position.y = 0.95;
      bottleGroup.add(neck);

      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.7, 0.6), goldMaterial);
      cap.position.y = 1.4;
      bottleGroup.add(cap);

      // Start off-screen right to avoid popping up in center
      bottleGroup.position.set(3, -0.2, 0);
      bottleGroup.scale.set(0.2, 0.2, 0.2);
      bottleGroup.visible = false;
      return bottleGroup;
    };

    // MODEL 2: Forest Essence Bottle (Procedural Placeholder)
    const createForestBottleModel = () => {
      const forestGroup = new THREE.Group();

      const frostedGreenGlass = new THREE.MeshPhysicalMaterial({
        color: 0x113824,
        emissive: 0x03140b,
        metalness: 0.05,
        roughness: 0.35,
        transmission: 0.82,
        ior: 1.48,
        thickness: 1.8,
        clearcoat: 0.6,
        clearcoatRoughness: 0.2,
      });

      const brushedGoldMat = new THREE.MeshStandardMaterial({
        color: 0xc2a649,
        metalness: 0.85,
        roughness: 0.25,
      });

      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 2.4, 48), frostedGreenGlass);
      body.position.y = -0.3;
      forestGroup.add(body);

      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.22, 32), brushedGoldMat);
      neck.position.y = 0.95;
      forestGroup.add(neck);

      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.65, 0.55), brushedGoldMat);
      cap.position.y = 1.38;
      forestGroup.add(cap);

      // Start off-screen right
      forestGroup.position.set(3, -0.2, 0);
      forestGroup.scale.set(0.35, 0.35, 0.35);
      forestGroup.visible = false;
      return forestGroup;
    };

    // =========================================================================
    // STEP 2 FOR GLB FILE:
    // GLB Model Loader function
    // =========================================================================
    /*
    const loadForestGLBModel = (sceneRef, onCompleteCallback) => {
      const loader = new GLTFLoader();
      loader.load(
        '/models/forest_essence.glb', // Path in /public/models/
        (gltf) => {
          const model = gltf.scene;
          model.position.set(3, -0.2, 0); // Off-screen right
          model.scale.set(0.35, 0.35, 0.35); 
          model.visible = false;

          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          sceneRef.add(model);
          models.forest = model;
          if (onCompleteCallback) onCompleteCallback();
        },
        undefined,
        (error) => console.error('Error loading forest GLB model:', error)
      );
    };
    */

    const createFloatingLeaves = () => {
      const count = 25;
      const group = new THREE.Group();
      const leafGeo = new THREE.PlaneGeometry(0.08, 0.15);
      const leafMat = new THREE.MeshStandardMaterial({
        color: 0x2a5c3a,
        roughness: 0.6,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
      });

      for (let i = 0; i < count; i++) {
        const leaf = new THREE.Mesh(leafGeo, leafMat);
        leaf.position.set(
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 3
        );
        leaf.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        leaf.userData = {
          rotSpeedX: (Math.random() - 0.5) * 0.02,
          rotSpeedY: (Math.random() - 0.5) * 0.02,
          floatSpeedY: 0.002 + Math.random() * 0.003,
        };
        group.add(leaf);
      }
      group.visible = false;
      return group;
    };

    const handleMouseMove = (event) => {
      mouse.targetX = (event.clientX / window.innerWidth - 0.5) * 0.6;
      mouse.targetY = (event.clientY / window.innerHeight - 0.5) * 0.6;
    };

    // Increase model size gradually on scroll during Forest section up to 0.68x
    const handleForestScrollProgress = (e) => {
      if (props.activeSection !== 'forest') return;
      const { progress } = e.detail;

      const forestModel = models.forest;
      if (!forestModel) return;

      const targetScale = 0.35 + progress * (0.68 - 0.35);
      const targetY = -0.2 + progress * 0.35;

      gsap.to(forestModel.scale, { x: targetScale, y: targetScale, z: targetScale, duration: 0.15 });
      gsap.to(forestModel.position, { y: targetY, duration: 0.15 });
    };

    const transitionSection = (targetSection) => {
      // --- HERO MODEL TRANSITION ---
      if (models.hero) {
        if (targetSection === 'hero') {
          models.hero.visible = true;
          gsap.fromTo(
            models.hero.position,
            { x: 3, y: -0.2, z: 0 },
            { x: 0, y: -0.2, z: 0, duration: 1.2, ease: 'power3.out' }
          );
          gsap.fromTo(
            models.hero.scale,
            { x: 0.2, y: 0.2, z: 0.2 },
            { x: 1, y: 1, z: 1, duration: 1, ease: 'power2.out' }
          );
        } else {
          gsap.to(models.hero.position, {
            x: -4,
            duration: 0.6,
            ease: 'power2.in',
            onComplete: () => {
              models.hero.visible = false;
              models.hero.position.x = 3; // Reset off-screen right
            },
          });
        }
      }

      // --- FOREST ESSENCE & NOTES MODEL TRANSITION ---
      if (models.forest) {
        const isForestActive = ['forest', 'notes'].includes(targetSection);

        if (isForestActive) {
          const wasHidden = !models.forest.visible;
          models.forest.visible = true;
          if (floatingLeavesGroup) floatingLeavesGroup.visible = true;

          // Slide in from off-screen right if coming from another section
          if (wasHidden) {
            gsap.fromTo(
              models.forest.position,
              { x: 3, y: -0.2, z: 0 },
              { x: 0, y: -0.2, z: 0, duration: 1.2, ease: 'power3.out' }
            );
          }

          if (targetSection === 'notes') {
            // Fragrance Notes Mode: Lock into medium card size
            gsap.to(models.forest.scale, { x: 0.68, y: 0.68, z: 0.68, duration: 0.8, ease: 'power2.out' });
            gsap.to(models.forest.position, { x: 0, y: 0.15, z: 0.5, duration: 0.8, ease: 'power2.out' });

            if (cardFrameRef.value) {
              gsap.to(cardFrameRef.value, { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' });
            }
          } else {
            // Forest Essence Mode
            if (cardFrameRef.value) {
              gsap.to(cardFrameRef.value, { opacity: 0, scale: 0.9, duration: 0.4 });
            }
          }
        } else {
          // Slide off-screen left when exiting both forest and notes
          gsap.to(models.forest.position, {
            x: -4,
            duration: 0.8,
            ease: 'power2.in',
            onComplete: () => {
              models.forest.visible = false;
              if (floatingLeavesGroup) floatingLeavesGroup.visible = false;
              models.forest.position.x = 3; // Reset off-screen right for next entry
            },
          });
          if (cardFrameRef.value) {
            gsap.to(cardFrameRef.value, { opacity: 0, scale: 0.9, duration: 0.4 });
          }
        }
      }
    };

    const initScene = () => {
      const container = canvasRef.value;
      if (!container) return;

      scene = new THREE.Scene();
      scene.environment = createStudioEnvironment();

      camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(0, 0.2, 6.5);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;

      container.appendChild(renderer.domElement);

      scene.add(new THREE.AmbientLight(0xffffff, 0.2));
      const keyLight = new THREE.DirectionalLight(0xdcfce7, 3.0);
      keyLight.position.set(4, 6, 3);
      scene.add(keyLight);

      models.hero = createHeroBottle();
      scene.add(models.hero);

      // =========================================================================
      // STEP 3 FOR GLB FILE:
      // Comment `createForestBottleModel()` & uncomment `loadForestGLBModel()`
      // =========================================================================
      models.forest = createForestBottleModel();
      scene.add(models.forest);

      // loadForestGLBModel(scene, () => transitionSection(props.activeSection));

      floatingLeavesGroup = createFloatingLeaves();
      scene.add(floatingLeavesGroup);

      transitionSection(props.activeSection);

      let clock = new THREE.Clock();
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        const activeModelKey = ['forest', 'notes'].includes(props.activeSection) ? 'forest' : props.activeSection;
        const activeModel = models[activeModelKey];

        if (activeModel && activeModel.visible) {
          activeModel.rotation.y += 0.003;

          // Gentle mouse movement
          activeModel.rotation.z = mouse.x * 0.12;
          activeModel.rotation.x = 0.05 + mouse.y * 0.12;
        }

        if (floatingLeavesGroup && floatingLeavesGroup.visible) {
          floatingLeavesGroup.children.forEach((leaf) => {
            leaf.rotation.x += leaf.userData.rotSpeedX;
            leaf.rotation.y += leaf.userData.rotSpeedY;
            leaf.position.y -= leaf.userData.floatSpeedY;
            if (leaf.position.y < -2.5) leaf.position.y = 2.5;
          });
        }

        renderer.render(scene, camera);
      };
      animate();

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('forest-scroll-progress', handleForestScrollProgress);
    };

    watch(() => props.activeSection, (newSection) => {
      transitionSection(newSection);
    });

    onMounted(() => {
      initScene();
    });

    onUnmounted(() => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('forest-scroll-progress', handleForestScrollProgress);
      if (renderer) renderer.dispose();
    });

    return () => (
      <div class="fixed inset-0 z-20 h-screen w-screen pointer-events-none overflow-hidden flex items-center justify-center">
        {/* Card Template Frame for Fragrance Notes Section */}
        <div
          ref={cardFrameRef}
          class="absolute w-[320px] h-[480px] md:w-[380px] md:h-[540px] rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm shadow-2xl transition-all pointer-events-none opacity-0 scale-90 -translate-y-6"
        />

        {/* Canvas Layer */}
        <div ref={canvasRef} class="absolute inset-0 h-full w-full" />
      </div>
    );
  },
});