/**
 * CodeAlpha 3D Hotel Reservation System
 * Booking Confirmation — Sleeping Baby 3D Animation (Three.js)
 */

const SleepingBabyViewer = (function() {
  let scene, camera, renderer;
  let animationFrameId = null;
  let container = null;
  let babyGroup = null;
  let bedGroup = null;
  let blanketMesh = null;
  let starsGroup = null;
  let clock = null;
  let isRising = true;
  let riseStartTime = 0;

  function init(containerElement, options = {}) {
    container = containerElement;
    if (!container) return;

    if (!window.WebGLRenderingContext || !window.THREE) {
      showFallback(container);
      return;
    }

    cleanup();

    const width = container.clientWidth || 700;
    const height = container.clientHeight || 360;

    clock = new THREE.Clock();

    // 1. Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c111e);

    // 2. Camera
    camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 1.8, 4.8);
    camera.lookAt(0, 0.5, 0);

    // 3. Renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;

      container.innerHTML = '';
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn("WebGL failure on sleeping baby scene:", e);
      showFallback(container);
      return;
    }

    // 4. Warm Pastel Lighting
    const ambientLight = new THREE.AmbientLight(0xffecd2, 0.65);
    scene.add(ambientLight);

    const warmLight = new THREE.PointLight(0xffb74d, 1.8, 10);
    warmLight.position.set(1.5, 2.5, 2.0);
    warmLight.castShadow = true;
    scene.add(warmLight);

    const softMoonLight = new THREE.DirectionalLight(0xb4c5e7, 0.9);
    softMoonLight.position.set(-2, 3, -1);
    scene.add(softMoonLight);

    // 5. Build Bed and Sleeping Baby
    bedGroup = new THREE.Group();
    scene.add(bedGroup);

    // If starting fresh, begin below and rise up
    isRising = true;
    riseStartTime = performance.now();
    bedGroup.position.y = -2.5;

    buildBed();
    buildStylizedBaby();
    buildFloatingDreamStars();

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      bedGroup.position.y = 0;
      isRising = false;
    }

    animate();
  }

  function buildBed() {
    // Bed frame
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x241812, roughness: 0.4 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.8 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xfdfaf6, roughness: 0.8 });

    // Base
    const baseGeo = new THREE.BoxGeometry(2.2, 0.3, 2.8);
    const base = new THREE.Mesh(baseGeo, woodMat);
    base.position.set(0, 0.15, 0);
    base.castShadow = true;
    base.receiveShadow = true;
    bedGroup.add(base);

    // Legs
    for (let x of [-0.95, 0.95]) {
      for (let z of [-1.2, 1.2]) {
        const legGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.25, 12);
        const leg = new THREE.Mesh(legGeo, goldMat);
        leg.position.set(x, 0.05, z);
        bedGroup.add(leg);
      }
    }

    // Headboard
    const headboardGeo = new THREE.BoxGeometry(2.3, 1.1, 0.18);
    const headboard = new THREE.Mesh(headboardGeo, new THREE.MeshStandardMaterial({ color: 0x1f293d, roughness: 0.6 }));
    headboard.position.set(0, 0.75, -1.35);
    headboard.castShadow = true;
    bedGroup.add(headboard);

    // Headboard gold trim
    const trimGeo = new THREE.BoxGeometry(2.35, 0.06, 0.2);
    const trim = new THREE.Mesh(trimGeo, goldMat);
    trim.position.set(0, 1.3, -1.35);
    bedGroup.add(trim);

    // Fluffy Mattress
    const mattressGeo = new THREE.BoxGeometry(2.0, 0.35, 2.6);
    const mattress = new THREE.Mesh(mattressGeo, whiteMat);
    mattress.position.set(0, 0.45, 0);
    mattress.castShadow = true;
    mattress.receiveShadow = true;
    bedGroup.add(mattress);

    // Puffy Pillow
    const pillowGeo = new THREE.BoxGeometry(1.4, 0.22, 0.6);
    const pillow = new THREE.Mesh(pillowGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }));
    pillow.position.set(0, 0.7, -0.85);
    pillow.rotation.x = 0.2;
    pillow.castShadow = true;
    bedGroup.add(pillow);
  }

  function buildStylizedBaby() {
    babyGroup = new THREE.Group();
    bedGroup.add(babyGroup);

    // Baby materials
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xfcdac2,
      roughness: 0.7,
      metalness: 0.0
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x4a2c16,
      roughness: 0.9
    });

    const cheekMat = new THREE.MeshBasicMaterial({
      color: 0xf59d9d
    });

    const eyeMat = new THREE.MeshBasicMaterial({
      color: 0x221a15
    });

    // 1. Cute Round Baby Head
    const headGeo = new THREE.SphereGeometry(0.32, 28, 28);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.set(0, 0.88, -0.65);
    head.castShadow = true;
    babyGroup.add(head);

    // Soft baby hair tuft
    const hairGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 1.15, -0.65);
    hair.scale.set(0.9, 0.45, 0.9);
    babyGroup.add(hair);

    // Rosy Cheeks
    for (let side of [-1, 1]) {
      const cheekGeo = new THREE.CircleGeometry(0.06, 16);
      const cheek = new THREE.Mesh(cheekGeo, cheekMat);
      cheek.position.set(side * 0.16, 0.83, -0.38);
      cheek.rotation.x = -0.15;
      babyGroup.add(cheek);
    }

    // Closed Sleeping Eyes (Gentle peaceful curve)
    for (let side of [-1, 1]) {
      const eyeCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(side * 0.15 - 0.05, 0.90, -0.37),
        new THREE.Vector3(side * 0.15, 0.88, -0.37),
        new THREE.Vector3(side * 0.15 + 0.05, 0.90, -0.37)
      );
      const eyeGeo = new THREE.TubeGeometry(eyeCurve, 12, 0.012, 8, false);
      const eye = new THREE.Mesh(eyeGeo, eyeMat);
      babyGroup.add(eye);
    }

    // Peaceful Smile
    const smileCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.04, 0.77, -0.38),
      new THREE.Vector3(0, 0.74, -0.38),
      new THREE.Vector3(0.04, 0.77, -0.38)
    );
    const smileGeo = new THREE.TubeGeometry(smileCurve, 10, 0.009, 8, false);
    const smile = new THREE.Mesh(smileGeo, eyeMat);
    babyGroup.add(smile);

    // Baby Sleeping Cap with pompom
    const capMat = new THREE.MeshStandardMaterial({ color: 0xefdfc8, roughness: 0.85 });
    const capGeo = new THREE.ConeGeometry(0.33, 0.5, 20);
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(0, 1.22, -0.72);
    cap.rotation.x = -0.35;
    cap.rotation.z = -0.2;
    babyGroup.add(cap);

    const pompomGeo = new THREE.SphereGeometry(0.07, 16, 16);
    const pompom = new THREE.Mesh(pompomGeo, new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.4 }));
    pompom.position.set(-0.12, 1.48, -0.84);
    babyGroup.add(pompom);

    // 2. Cozy Fluffy Blanket covering the baby up to chest
    const blanketMat = new THREE.MeshStandardMaterial({
      color: 0x8ea8cf,
      roughness: 0.65,
      metalness: 0.08
    });

    const blanketGeo = new THREE.BoxGeometry(1.9, 0.28, 1.85);
    blanketMesh = new THREE.Mesh(blanketGeo, blanketMat);
    blanketMesh.position.set(0, 0.72, 0.35);
    blanketMesh.castShadow = true;
    babyGroup.add(blanketMesh);

    // Golden embroidered hem on blanket
    const hemGeo = new THREE.BoxGeometry(1.92, 0.05, 0.12);
    const hem = new THREE.Mesh(hemGeo, new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.3 }));
    hem.position.set(0, 0.85, -0.52);
    babyGroup.add(hem);
  }

  function buildFloatingDreamStars() {
    starsGroup = new THREE.Group();
    scene.add(starsGroup);

    // Golden Moon Motif
    const moonGeo = new THREE.TorusGeometry(0.35, 0.08, 16, 32, Math.PI * 1.3);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0xf5d77f,
      emissive: 0xd4af37,
      emissiveIntensity: 0.5,
      roughness: 0.3,
      metalness: 0.8
    });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(1.8, 1.9, -0.6);
    moon.rotation.z = 0.5;
    starsGroup.add(moon);

    // Floating Stars
    const starGeo = new THREE.OctahedronGeometry(0.08, 0);
    const starMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffe29a,
      emissiveIntensity: 0.6
    });

    for (let i = 0; i < 18; i++) {
      const star = new THREE.Mesh(starGeo, starMat);
      const angle = (i / 18) * Math.PI * 2;
      const radius = 1.6 + Math.random() * 0.9;
      star.position.set(
        Math.cos(angle) * radius,
        1.0 + Math.random() * 1.5,
        Math.sin(angle) * 0.8 - 0.4
      );
      star.userData = {
        baseY: star.position.y,
        speed: 1.0 + Math.random() * 1.5,
        rotSpeed: 0.02 + Math.random() * 0.03
      };
      starsGroup.add(star);
    }
  }

  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Scene 2: Rise animation easing
    if (isRising && bedGroup) {
      const riseProgress = Math.min(1.0, (performance.now() - riseStartTime) / 1800);
      // Cubic ease out
      const ease = 1 - Math.pow(1 - riseProgress, 3);
      bedGroup.position.y = -2.5 + ease * 2.5;

      if (riseProgress >= 1.0) {
        isRising = false;
        bedGroup.position.y = 0;
      }
    }

    // Scene 3: Rhythmic breathing animation
    if (blanketMesh) {
      // Gentle sine breathing (approx 16 breaths per minute)
      const breath = Math.sin(elapsedTime * 2.6);
      blanketMesh.position.y = 0.72 + breath * 0.018;
      blanketMesh.scale.y = 1.0 + breath * 0.035;
    }

    // Gentle baby head sway
    if (babyGroup) {
      babyGroup.position.y = Math.sin(elapsedTime * 2.6) * 0.008;
    }

    // Floating dream stars motion
    if (starsGroup) {
      starsGroup.rotation.y = elapsedTime * 0.04;
      starsGroup.children.forEach((star) => {
        if (star.userData && star.userData.baseY) {
          star.position.y = star.userData.baseY + Math.sin(elapsedTime * star.userData.speed) * 0.08;
          star.rotation.x += star.userData.rotSpeed;
          star.rotation.y += star.userData.rotSpeed;
        }
      });
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  function replay() {
    if (!bedGroup) return;
    isRising = true;
    riseStartTime = performance.now();
    bedGroup.position.y = -2.5;
  }

  function showFallback(container) {
    if (!container) return;
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:#f3e5ab; text-align:center; padding:1.5rem;">
        <div style="font-size:3.5rem; margin-bottom:0.5rem;">🌙 ✨ 👶</div>
        <div style="font-family:'Playfair Display',serif; font-size:1.6rem; color:#fff; margin-bottom:0.4rem;">All Booked. Time to Dream.</div>
        <div style="font-size:0.9rem; color:#a0aec0; max-width:400px;">Your stay is secured. A peaceful, luxurious experience awaits you at CodeAlpha.</div>
      </div>
    `;
  }

  function cleanup() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    if (renderer) {
      try {
        renderer.dispose();
      } catch (e) {}
      renderer = null;
    }
    scene = null;
    camera = null;
    bedGroup = null;
    babyGroup = null;
    blanketMesh = null;
    starsGroup = null;
    if (container) {
      container.innerHTML = '';
    }
  }

  return {
    init,
    replay,
    cleanup
  };
})();

