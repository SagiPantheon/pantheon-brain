<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <title>BrainStem — супер-простая версия</title>
  <style>
    html, body { margin:0; height:100%; background:#0b0f1a; }
    canvas { display:block; }
  </style>
</head>
<body>
<canvas id="c"></canvas>

<!-- Без модулей: просто подключаем готовые скрипты -->
<script src="https://unpkg.com/three@0.160.0/build/three.min.js"></script>
<script src="https://unpkg.com/three@0.160.0/examples/js/controls/OrbitControls.js"></script>
<script src="https://unpkg.com/three@0.160.0/examples/js/loaders/GLTFLoader.js"></script>

<script>
  const canvas = document.getElementById('c');

  // Рендер
  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // Сцена, камера, управление
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0f1a);

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 4);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Свет
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const dir1 = new THREE.DirectionalLight(0xffffff, 1.2);
  dir1.position.set(3, 2, 4);
  scene.add(dir1);
  const dir2 = new THREE.DirectionalLight(0xffffff, 0.5);
  dir2.position.set(-3, -2, -4);
  scene.add(dir2);

  // Группа для вращения модели
  const root = new THREE.Group();
  scene.add(root);

  // === ЗАГРУЗКА GLB ===
  // ВАЖНО: файл должен лежать в /assets/BrainStem.glb в твоём репозитории/деплое
  const MODEL_URL = 'assets/BrainStem.glb?v=2';

  const loader = new THREE.GLTFLoader();
  loader.load(
    MODEL_URL,
    (gltf) => {
      const obj = gltf.scene || gltf.scenes[0];
      root.add(obj);

      // Центровка и автоскейл под красивый кадр
      const box = new THREE.Box3().setFromObject(obj);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);

      // Сдвигаем объект так, чтобы его центр оказался в (0,0,0)
      obj.position.sub(center);

      // Масштабируем так, чтобы самая большая грань влезла в ~2 единицы
      const maxDim = Math.max(size.x, size.y, size.z);
      const targetSize = 2.0;
      const scale = targetSize / (maxDim || 1);
      obj.scale.setScalar(scale);
    },
    undefined,
    (err) => {
      console.error('GLB load error:', err);
      // На всякий случай — жёлтый куб, чтобы было видно, что рендер живой
      const fallback = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshStandardMaterial({ color: 0xffff00 })
      );
      root.add(fallback);
    }
  );

  // Ресайз
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Анимация (медленное вращение)
  function animate(){
    requestAnimationFrame(animate);
    root.rotation.y += 0.003;
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
</script>
</body>
</html>
