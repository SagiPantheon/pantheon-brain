const canvas = document.querySelector('#brainCanvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.2, 2.2);

// Свет
scene.add(new THREE.AmbientLight(0xffffff, 1));
const dir = new THREE.DirectionalLight(0xffffff, 0.8);
dir.position.set(2, 3, 2);
scene.add(dir);

// Загрузка модели
const loader = new THREE.GLTFLoader();
loader.load(
  'assets/BrainStem.glb', // путь к твоей модели
  (gltf) => {
    const model = gltf.scene;
    model.rotation.y = Math.PI;
    model.scale.set(1.2, 1.2, 1.2);
    scene.add(model);

    // Анимация вращения
    function animate() {
      requestAnimationFrame(animate);
      model.rotation.y += 0.005;
      renderer.render(scene, camera);
    }
    animate();
  },
  undefined,
  (err) => console.error("Ошибка загрузки модели:", err)
);

// Адаптация под экран
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
