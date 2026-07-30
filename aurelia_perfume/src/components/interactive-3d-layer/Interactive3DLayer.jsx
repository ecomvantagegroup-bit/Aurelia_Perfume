import { defineComponent, ref, onMounted, onUnmounted, watch } from 'vue';
import * as THREE from 'three';
import gsap from 'gsap';

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
    let bottleMesh = null;

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    // Create a sleek, simple perfume bottle model
    const createBottle = () => {
      const group = new THREE.Group();

      const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x08080a,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.85,
        ior: 1.5,
      });

      const goldMaterial = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.9,
        roughness: 0.2,
      });

      // Body
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 2.2, 32), glassMaterial);
      body.position.y = -0.2;
      group.add(body);

      // Neck & Cap
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.2, 16), goldMaterial);
      neck.position.y = 0.95;
      group.add(neck);

      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.5), goldMaterial);
      cap.position.y = 1.35;
      group.add(cap);

      group.position.set(3, -0.2, 0);
      group.scale.set(0.2, 0.2, 0.2);
      group.visible = false;
      return group;
    };

    const handleMouseMove = (event) => {
      mouse.targetX = (event.clientX / window.innerWidth - 0.5) * 0.5;
      mouse.targetY = (event.clientY / window.innerHeight - 0.5) * 0.5;
    };

    const transitionSection = (targetSection) => {
      if (!bottleMesh) return;

      const isActive = ['hero', 'forest', 'notes', 'ocean'].includes(targetSection);

      if (isActive) {
        bottleMesh.visible = true;
        gsap.to(bottleMesh.position, { x: 0, y: -0.2, z: 0, duration: 1.0, ease: 'power3.out' });
        gsap.to(bottleMesh.scale, { x: 1, y: 1, z: 1, duration: 0.8, ease: 'power2.out' });
      } else {
        gsap.to(bottleMesh.position, {
          x: -4,
          duration: 0.6,
          ease: 'power2.in',
          onComplete: () => {
            bottleMesh.visible = false;
            bottleMesh.position.x = 3;
          },
        });
      }
    };

    const initScene = () => {
      const container = canvasRef.value;
      if (!container) return;

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(0, 0, 6);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // Lighting
      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
      dirLight.position.set(5, 5, 5);
      scene.add(dirLight);

      // Bottle Setup
      bottleMesh = createBottle();
      scene.add(bottleMesh);

      transitionSection(props.activeSection);

      // Animation Loop
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        if (bottleMesh && bottleMesh.visible) {
          bottleMesh.rotation.y += 0.004;
          bottleMesh.rotation.z = mouse.x * 0.1;
          bottleMesh.rotation.x = mouse.y * 0.1;
        }

        renderer.render(scene, camera);
      };
      animate();

      window.addEventListener('mousemove', handleMouseMove);
    };

    const handleResize = () => {
      if (!renderer || !camera || !canvasRef.value) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    watch(() => props.activeSection, (newSection) => {
      transitionSection(newSection);
    });

    onMounted(() => {
      initScene();
      window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer) renderer.dispose();
    });

    return () => (
      <div class="fixed inset-0 z-20 h-screen w-screen pointer-events-none overflow-hidden flex items-center justify-center">
        <div ref={canvasRef} class="absolute inset-0 h-full w-full" />
      </div>
    );
  },
});