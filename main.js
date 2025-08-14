// main.js — полностью самодостаточный. Ничего не импортируем.
// Скрипт сам подключает three.js и GLTFLoader из CDN.

(function () {
  const THREE_CDN = 'https://unpkg.com/three@0.158.0/build/three.min.js';
  const GLTF_CDN  = 'https://unpkg.com/three@0.158.0/examples/jsm/loaders/GLTFLoader.js';

  // === ПУТЬ К МОДЕЛИ ===
  // Если файл лежит в assets/models/BrainStem.glb — оставь как есть.
  // Если модель у тебя лежит в assets/BrainStem.glb (без папки models),
  // поменяй строку ниже на 'assets/BrainStem.glb'.
  const MODEL_URL = 'assets/models/BrainStem.glb';

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = resolve;
      s.onerror = () => reject(new Error('Failed to load ' + src));
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
      s.onerror = () => reject(new Error('Failed to load GLTFLoader module'));
      document.head.appendChild(s);
    });
  }

  async function boot() {
    // 1) Загружаем THREE при необходимости
    if (!window.THREE) {
      await loadScript(THREE_CDN);
    }

    // 2) Грузим GLTFLoader
    await ensureGLTFLoader();

    // 3) Готовим canvas
    const canvas = document.querySelector('#brainCanvas') || (() => {
      const c = document.createElement('canvas');
      c.id = 'brainCanvas';
      c.style.position = 'fixed';
      c.style.inset = 0;
      document.body.prepend(c);
      return c;
    })();

    // 4) Рендерер / сцена / камера
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1.2, 2.2);

    // 5) Свет
    scene.add(new THREE.AmbientLight(0xffffff, 1));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(2, 3, 2);
    scene.add(dir);

    // 6) Грузим модель
    const loader = new window.GLTFLoader();
    loader.load(
      MODEL_URL,
      (gltf) => {
        const model = gltf.scene;
        model.rotation.y = Math.PI;
        model.scale.set(1.2, 1.2, 1.2);
        scene.add(model);

        function animate() {
          requestAnimationFrame(animate);
          model.rotation.y += 0.005; // лёгкое вращение
          renderer.render(scene, camera);
        }
        animate();
        console.log('GLB loaded:', MODEL_URL);
      },
      undefined,
      (err) => {
        console.error('GLB load error:', err);
        showError('Ошибка загрузки модели (проверь путь к файлу)');
      }
    );

    // 7) Ресайз
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  function showError(text) {
    const msg = document.createElement('div');
    msg.textContent = text;
    msg.style.cssText = 'position:fixed;left:10px;bottom:10px;color:#f66;background:#000a;padding:8px 10px;border-radius:6px;font:14px/1.2 sans-serif;z-index:9999';
    document.body.appendChild(msg);
  }

  boot().catch((e) => {
    console.error('Boot error:', e);
    showError('Критическая ошибка запуска скрипта');
  });
})();
