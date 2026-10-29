/**
 * CodeAlpha 3D Hotel Reservation System
 * Interactive 3D Room Explorer Module (Three.js)
 */

const Room3DViewer = (function() {
  let scene, camera, renderer, controls;
  let animationFrameId = null;
  let currentLightingMode = 'dusk';
  let dirLight, ambientLight, lampLeft, lampRight, chandelierLight;
  let container = null;
  let roomMeshGroup = null;

  function init(containerElement, roomType = 'DELUXE') {
    container = containerElement;
    if (!container) return;

    // Check WebGL support
    if (!window.WebGLRenderingContext || !window.THREE) {
      showFallback(container, roomType);
      return;
    }

    cleanup();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e17);
    scene.fog = new THREE.FogExp2(0x0a0e17, 0.035);

    // 2. Camera
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 6.5);

    // 3. Renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;

      container.innerHTML = '';
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn("WebGL initialization failed, falling back to static preview:", e);
      showFallback(container, roomType);
      return;
    }

    // 4. OrbitControls
    if (THREE.OrbitControls) {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't go below floor
      controls.minDistance = 2.5;
      controls.maxDistance = 9.0;
      controls.target.set(0, 1.2, 0);
    }

    // 5. Lighting Setup
    setupLighting();

    // 6. Build Procedural Room Architecture
    roomMeshGroup = new THREE.Group();
    scene.add(roomMeshGroup);
    buildRoomArchitecture(roomType);

    // 7. Event listeners
    window.addEventListener('resize', onWindowResize);

    // 8. Start loop
    animate();
  }

  function setupLighting() {
    ambientLight = new THREE.AmbientLight(0xffecd2, 0.45);
    scene.add(ambientLight);

    dirLight = new THREE.DirectionalLight(0xffeedd, 1.2);
    dirLight.position.set(4, 5, 4);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // Warm Bedside lamps (Point Lights)
    lampLeft = new THREE.PointLight(0xffa834, 1.4, 5);
    lampLeft.position.set(-1.8, 1.6, -0.6);
    scene.add(lampLeft);

    lampRight = new THREE.PointLight(0xffa834, 1.4, 5);
    lampRight.position.set(1.8, 1.6, -0.6);
    scene.add(lampRight);

    // Chandelier
    chandelierLight = new THREE.PointLight(0xffdf9e, 1.1, 7);
    chandelierLight.position.set(0, 3.2, 0.5);
    scene.add(chandelierLight);

    setLightingMode('dusk');
  }

  function setLightingMode(mode) {
    currentLightingMode = mode;
    if (!scene) return;

    if (mode === 'daylight') {
      scene.background.setHex(0x1a2638);
      ambientLight.color.setHex(0xffffff);
      ambientLight.intensity = 0.8;
      dirLight.color.setHex(0xfffaed);
      dirLight.intensity = 1.6;
      dirLight.position.set(5, 6, 3);
      lampLeft.intensity = 0.4;
      lampRight.intensity = 0.4;
      chandelierLight.intensity = 0.5;
    } else if (mode === 'dusk') {
      scene.background.setHex(0x151221);
      ambientLight.color.setHex(0xffd8b3);
      ambientLight.intensity = 0.45;
      dirLight.color.setHex(0xff914d);
      dirLight.intensity = 1.2;
      dirLight.position.set(4, 3.5, 3);
      lampLeft.intensity = 1.5;
      lampRight.intensity = 1.5;
      chandelierLight.intensity = 1.1;
    } else if (mode === 'midnight') {
      scene.background.setHex(0x05070d);
      ambientLight.color.setHex(0x2d3a54);
      ambientLight.intensity = 0.2;
      dirLight.color.setHex(0x5075a8);
      dirLight.intensity = 0.4;
      dirLight.position.set(-4, 5, 2);
      lampLeft.intensity = 2.0;
      lampRight.intensity = 2.0;
      chandelierLight.intensity = 1.4;
    }
  }

  function buildRoomArchitecture(roomType) {
    const isSuite = roomType === 'SUITE' || roomType === 'PRESIDENTIAL';
    const isDeluxe = roomType === 'DELUXE';

    // Materials
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x3d271d,
      roughness: 0.35,
      metalness: 0.1
    });

    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x1f2430,
      roughness: 0.8,
      metalness: 0.05
    });

    const goldAccentMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.25,
      metalness: 0.85
    });

    const linenMat = new THREE.MeshStandardMaterial({
      color: 0xfaf8f5,
      roughness: 0.9,
      metalness: 0.0
    });

    const velvetMat = new THREE.MeshStandardMaterial({
      color: isSuite ? 0x611a28 : 0x1c355e,
      roughness: 0.7,
      metalness: 0.15
    });

    // 1. Floor
    const floorGeo = new THREE.PlaneGeometry(8, 7);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    roomMeshGroup.add(floor);

    // 2. Back Wall (Behind Bed)
    const backWallGeo = new THREE.BoxGeometry(8, 4, 0.2);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, 2, -1.8);
    backWall.receiveShadow = true;
    roomMeshGroup.add(backWall);

    // 3. Wall Wainscoting / Decorative Gold Panels
    const panelGeo = new THREE.BoxGeometry(4.4, 2.6, 0.05);
    const wallPanel = new THREE.Mesh(panelGeo, new THREE.MeshStandardMaterial({
      color: 0x181d28,
      roughness: 0.6,
      metalness: 0.2
    }));
    wallPanel.position.set(0, 1.8, -1.68);
    roomMeshGroup.add(wallPanel);

    const frameGeo = new THREE.BoxGeometry(4.5, 0.06, 0.08);
    const goldTrimTop = new THREE.Mesh(frameGeo, goldAccentMat);
    goldTrimTop.position.set(0, 3.1, -1.65);
    roomMeshGroup.add(goldTrimTop);

    // 4. Luxury Bed Base & Mattress
    const bedWidth = isSuite ? 2.4 : (isDeluxe ? 2.2 : 1.9);
    const bedLength = 2.4;

    const bedBaseGeo = new THREE.BoxGeometry(bedWidth + 0.15, 0.45, bedLength + 0.15);
    const bedBase = new THREE.Mesh(bedBaseGeo, new THREE.MeshStandardMaterial({ color: 0x221610, roughness: 0.4 }));
    bedBase.position.set(0, 0.225, -0.4);
    bedBase.castShadow = true;
    bedBase.receiveShadow = true;
    roomMeshGroup.add(bedBase);

    // Mattress
    const mattressGeo = new THREE.BoxGeometry(bedWidth, 0.4, bedLength);
    const mattress = new THREE.Mesh(mattressGeo, linenMat);
    mattress.position.set(0, 0.65, -0.4);
    mattress.castShadow = true;
    mattress.receiveShadow = true;
    roomMeshGroup.add(mattress);

    // Headboard
    const headboardGeo = new THREE.BoxGeometry(bedWidth + 0.3, 1.4, 0.15);
    const headboard = new THREE.Mesh(headboardGeo, velvetMat);
    headboard.position.set(0, 1.3, -1.55);
    headboard.castShadow = true;
    roomMeshGroup.add(headboard);

    // Bed Runner / Throw Blanket
    const runnerGeo = new THREE.BoxGeometry(bedWidth + 0.02, 0.04, 0.9);
    const runner = new THREE.Mesh(runnerGeo, velvetMat);
    runner.position.set(0, 0.86, 0.3);
    roomMeshGroup.add(runner);

    // Pillows
    for (let i = -1; i <= 1; i += 2) {
      const pillowGeo = new THREE.BoxGeometry(0.7, 0.2, 0.45);
      const pillow = new THREE.Mesh(pillowGeo, linenMat);
      pillow.position.set(i * (bedWidth * 0.26), 0.95, -1.1);
      pillow.rotation.x = 0.25;
      pillow.castShadow = true;
      roomMeshGroup.add(pillow);

      const accentPillowGeo = new THREE.BoxGeometry(0.5, 0.18, 0.35);
      const accentPillow = new THREE.Mesh(accentPillowGeo, velvetMat);
      accentPillow.position.set(i * (bedWidth * 0.26), 1.05, -0.9);
      accentPillow.rotation.x = 0.4;
      accentPillow.castShadow = true;
      roomMeshGroup.add(accentPillow);
    }

    // 5. Dual Nightstands & Bedside Lamps
    const nsX = (bedWidth / 2) + 0.45;
    for (let dir of [-1, 1]) {
      const nsGeo = new THREE.BoxGeometry(0.65, 0.6, 0.55);
      const nightstand = new THREE.Mesh(nsGeo, new THREE.MeshStandardMaterial({ color: 0x1f1612, roughness: 0.3 }));
      nightstand.position.set(dir * nsX, 0.3, -1.2);
      nightstand.castShadow = true;
      nightstand.receiveShadow = true;
      roomMeshGroup.add(nightstand);

      // Lamp Base
      const lampBaseGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.45, 16);
      const lampBase = new THREE.Mesh(lampBaseGeo, goldAccentMat);
      lampBase.position.set(dir * nsX, 0.82, -1.2);
      roomMeshGroup.add(lampBase);

      // Lamp Shade
      const shadeGeo = new THREE.CylinderGeometry(0.18, 0.26, 0.35, 16);
      const lampShade = new THREE.Mesh(shadeGeo, new THREE.MeshStandardMaterial({
        color: 0xfff4db,
        emissive: 0xffaa33,
        emissiveIntensity: 0.45,
        roughness: 0.9
      }));
      lampShade.position.set(dir * nsX, 1.15, -1.2);
      roomMeshGroup.add(lampShade);
    }

    // 6. Accent Rug
    const rugGeo = new THREE.PlaneGeometry(bedWidth + 1.2, 3.4);
    const rug = new THREE.Mesh(rugGeo, new THREE.MeshStandardMaterial({
      color: 0x273042,
      roughness: 0.95
    }));
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0, 0.01, 0.2);
    rug.receiveShadow = true;
    roomMeshGroup.add(rug);

    // 7. Panoramic Window Frame & Vista Horizon
    const windowFrameGeo = new THREE.BoxGeometry(0.15, 3.2, 4.2);
    const windowFrame = new THREE.Mesh(windowFrameGeo, new THREE.MeshStandardMaterial({ color: 0x111622, roughness: 0.3 }));
    windowFrame.position.set(3.9, 1.8, 0.2);
    roomMeshGroup.add(windowFrame);

    // Glass pane
    const glassGeo = new THREE.BoxGeometry(0.04, 3.0, 4.0);
    const glass = new THREE.Mesh(glassGeo, new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.8
    }));
    glass.position.set(3.9, 1.8, 0.2);
    roomMeshGroup.add(glass);

    // 8. Suite / Deluxe Amenities (Lounge or Desk)
    if (isSuite) {
      // Luxury Velvet Chaise Lounge
      const chaiseGeo = new THREE.BoxGeometry(1.6, 0.4, 0.75);
      const chaise = new THREE.Mesh(chaiseGeo, velvetMat);
      chaise.position.set(-2.4, 0.2, 1.2);
      chaise.rotation.y = 0.5;
      chaise.castShadow = true;
      roomMeshGroup.add(chaise);

      // Marble Coffee Table
      const tableGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.35, 24);
      const table = new THREE.Mesh(tableGeo, new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        roughness: 0.2,
        metalness: 0.1
      }));
      table.position.set(-1.4, 0.175, 1.6);
      table.castShadow = true;
      roomMeshGroup.add(table);

      // Chandelier Geometry
      const chandelierGeo = new THREE.CylinderGeometry(0.05, 0.55, 0.6, 8);
      const chandelier = new THREE.Mesh(chandelierGeo, goldAccentMat);
      chandelier.position.set(0, 3.4, 0.5);
      roomMeshGroup.add(chandelier);
    } else {
      // Writing Desk & Modern Armchair
      const deskGeo = new THREE.BoxGeometry(1.4, 0.7, 0.6);
      const desk = new THREE.Mesh(deskGeo, new THREE.MeshStandardMaterial({ color: 0x1e1511, roughness: 0.4 }));
      desk.position.set(-2.5, 0.35, 0.8);
      desk.rotation.y = Math.PI / 2;
      desk.castShadow = true;
      roomMeshGroup.add(desk);
    }
  }

  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    if (controls) {
      controls.update();
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  function onWindowResize() {
    if (!container || !renderer || !camera) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function showFallback(container, roomType) {
    if (!container) return;
    const fallbackImage = 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80';
    container.innerHTML = `
      <div style="position:relative; width:100%; height:100%; overflow:hidden; border-radius:12px;">
        <img src="${fallbackImage}" alt="Luxury Room Preview" style="width:100%; height:100%; object-fit:cover;">
        <div style="position:absolute; bottom:1rem; left:1rem; background:rgba(7,9,14,0.85); padding:0.5rem 1rem; border-radius:8px; border:1px solid rgba(212,175,55,0.3); font-size:0.85rem; color:#f3e5ab;">
          High-Definition 3D Visual Rendering (${roomType})
        </div>
      </div>
    `;
  }

  function cleanup() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    window.removeEventListener('resize', onWindowResize);
    if (renderer) {
      try {
        renderer.dispose();
      } catch (e) {}
      renderer = null;
    }
    scene = null;
    camera = null;
    controls = null;
    if (container) {
      container.innerHTML = '';
    }
  }

  return {
    init,
    setLightingMode,
    cleanup
  };
})();

