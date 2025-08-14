(function () {
  const THREE_CDN = 'https://unpkg.com/three@0.158.0/build/three.min.js';
  const GLTF_CDN  = 'https://unpkg.com/three@0.158.0/examples/jsm/loaders/GLTFLoader.js';
  const MODEL_URL = 'assets/models/BrainStem.glb';

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function ensureGLTFLoader() {
    return new Promise((resolve, reject) => {
      if (window.GLTFLoader) return resolve();
      const s = document.createElement('script');
      s.type = 'module';
      s.textContent = `
        import { GLTFLoader } from '${GLTF_CDN}';
        window.GLTFLoader = GLTFLoader;
      `;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function boot() {
    if (!window.THREE) {
      await loadScript(THREE_CDN);
    }
    await ensureGLTFLoader();

    const canvas = document.querySelector('#brainCanvas');

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1.2, 2.2);

    scene.add(new THREE.AmbientLight(0xffffff, 1));
    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(2, 3, 2);
    scene.add(dir);

    const loader = new window.GLTFLoader();
    loader.load(
      MODEL_URL,
      (gltf) => {
        const model = gltf.scene;
        model.rotation.y = Math.PI;
        scene.add(model);
        animate();
        console.log('GLB loaded:', MODEL_URL);
      },
      undefined,
      (err) => {
        console.error('GLB load error:', err);
      }
    );

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  boot().catch((e) => console.error('Boot error:', e));
})();
