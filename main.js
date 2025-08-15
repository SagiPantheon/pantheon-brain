// main.js — без import, работает с three@0.128 и GLTFLoader из index.html
(function () {
  // Кэш-бастинг, чтобы точно не ловить старый файл
  const MODEL_PATH = 'assets/BrainStem.glb?cb=' + Date.now();

  const canvas = document.querySelector('#brainCanvas') || (() => {
    const c = document.createElement('canvas');
    c.id = 'brainCanvas';
    document.body.prepend(c);
    return c;
  })();

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1.2, 2.2);

  // Свет
  scene.add(new THREE.AmbientLight(0xffffff, 1));
  const dir = new THREE.DirectionalLight(0xffffff, 0.9);
  dir.position.set(2, 3, 2);
  scene.add(dir);

  let subject = null;

  // Загрузка GLB
  console.log('Loading GLB from:', MODEL_PATH);
  const loader = new THREE.GLTFLoader();
  loader.load(
    MODEL_PATH,
    (gltf) => {
      subject = gltf.scene;
      subject.rotation.y = Math.PI;
      subject.scale.set(1.2, 1.2, 1.2);
      scene.add(subject);
      console.log('GLB loaded OK');
      animate();
    },
    undefined,
    (err) => {
      console.error('GLB load error:', err);
      // Резерв: шар, чтобы страница была живой
      const geo = new THREE.SphereGeometry(0.8, 64, 64);
      const mat = new THREE.MeshStandardMaterial({
        metalness: 0.4,
        roughness: 0.25,
        color: 0x88aaff,
        emissive: 0x001133
      });
      subject = new THREE.Mesh(geo, mat);
      scene.add(subject);
      animate();
    }
  );

  function animate() {
    requestAnimationFrame(animate);
    if (subject) subject.rotation.y += 0.005;
    renderer.render(scene, camera);
  }

  // Ресайз
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
