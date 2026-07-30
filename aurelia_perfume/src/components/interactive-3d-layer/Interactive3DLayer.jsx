import { defineComponent, ref, onMounted, onUnmounted, watch } from 'vue';
import * as THREE from 'three';
import gsap from 'gsap';
// =========================================================================
// TODO: UNCOMMENT THIS IMPORT WHEN READY TO LOAD YOUR .GLB FILE
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// =========================================================================

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

    let renderer, scene, camera, animationFrameId;
    const models = {
      hero: null,
      forest: null, // Forest Essence (Model 2)
    };

    let floatingLeavesGroup = null;
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    // Create Studio Reflection Map
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

    // MODEL 1: Monolithic Hero Bottle
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

      bottleGroup.visible = false;
      return bottleGroup;
    };

    // MODEL 2: Forest Essence Bottle
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

      forestGroup.position.set(0, -0.2, 0);
      forestGroup.visible = false;
      return forestGroup;
    };

    // Particle Effect: Floating Forest Leaves
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

    // Parallax Mouse Handler
    const handleMouseMove = (event) => {
      mouse.targetX = (event.clientX / window.innerWidth - 0.5) * 0.6;
      mouse.targetY = (event.clientY / window.innerHeight - 0.5) * 0.6;
    };

    // Scroll progress handler sent from ForestEssence.jsx
    const handleForestScrollProgress = (e) => {
      if (props.activeSection !== 'forest') return;
      const { progress } = e.detail;

      const forestModel = models.forest;
      if (!forestModel) return;

      // 1. Zoom in model as image sequence plays
      const targetScale = 1 + progress * 0.35;
      const targetZ = progress * 0.8;

      gsap.to(forestModel.scale, { x: targetScale, y: targetScale, z: targetScale, duration: 0.2 });
      gsap.to(forestModel.position, { z: targetZ, duration: 0.2 });

      // 2. Slide off when progress > 0.85
      if (progress > 0.85) {
        const exitProgress = (progress - 0.85) / 0.15;
        gsap.to(forestModel.position, { x: -3.5 * exitProgress, duration: 0.3 });
        gsap.to(forestModel.rotation, { y: exitProgress * -1.2, duration: 0.3 });
      } else {
        gsap.to(forestModel.position, { x: 0, duration: 0.3 });
      }
    };

    const transitionSection = (targetSection) => {
      // Handle Hero Model
      if (models.hero) {
        if (targetSection === 'hero') {
          models.hero.visible = true;
          gsap.to(models.hero.position, { x: 0, y: -0.2, z: 0, duration: 1.2 });
          gsap.to(models.hero.scale, { x: 1, y: 1, z: 1, duration: 1 });
        } else {
          gsap.to(models.hero.scale, {
            x: 0, y: 0, z: 0, duration: 0.6,
            onComplete: () => { models.hero.visible = false; },
          });
        }
      }

      // Handle Forest Essence Model (Active during 'forest' and 'notes')
      if (models.forest) {
        const isForestActive = ['forest', 'notes'].includes(targetSection);

        if (isForestActive) {
          models.forest.visible = true;
          if (floatingLeavesGroup) floatingLeavesGroup.visible = true;

          gsap.fromTo(
            models.forest.position,
            { x: 3, y: -0.2, z: 0 },
            { x: 0, y: -0.2, z: 0, duration: 1.4, ease: 'power3.out' }
          );
          gsap.fromTo(
            models.forest.scale,
            { x: 0.2, y: 0.2, z: 0.2 },
            { x: 1, y: 1, z: 1, duration: 1.2, ease: 'power2.out' }
          );
        } else {
          gsap.to(models.forest.position, {
            x: -4, duration: 0.8, ease: 'power2.in',
            onComplete: () => {
              models.forest.visible = false;
              if (floatingLeavesGroup) floatingLeavesGroup.visible = false;
            },
          });
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

      // Environment lighting
      scene.add(new THREE.AmbientLight(0xffffff, 0.2));
      const keyLight = new THREE.DirectionalLight(0xdcfce7, 3.0);
      keyLight.position.set(4, 6, 3);
      scene.add(keyLight);

      // Initialize Models
      models.hero = createHeroBottle();
      scene.add(models.hero);

      models.forest = createForestBottleModel();
      scene.add(models.forest);

      floatingLeavesGroup = createFloatingLeaves();
      scene.add(floatingLeavesGroup);

      transitionSection(props.activeSection);

      // Render Loop
      let clock = new THREE.Clock();
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        // Animate currently active model
        const activeModelKey = ['forest', 'notes'].includes(props.activeSection) ? 'forest' : props.activeSection;
        const activeModel = models[activeModelKey];

        if (activeModel && activeModel.visible) {
          activeModel.rotation.y += 0.003;
          activeModel.position.y = -0.2 + Math.sin(elapsedTime * 1.5) * 0.05;

          activeModel.rotation.z = mouse.x * 0.15;
          activeModel.rotation.x = 0.05 + mouse.y * 0.15;
        }

        // Animate Floating Leaves
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
      <div
        ref={canvasRef}
        class="fixed inset-0 z-20 h-screen w-screen pointer-events-none overflow-hidden"
      />
    );
  },
});