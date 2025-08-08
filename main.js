const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
resize();
window.addEventListener('resize', resize);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0e13);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / (window.innerHeight*0.7), 0.1, 100);
camera.position.set(2.2, 1.6, 3.0);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = true;
controls.enableZoom = true;
controls.target.set(0, 0.5, 0);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight.position.set(3, 5, 2);
scene.add(dirLight);
scene.add(new THREE.AmbientLight(0xffffff, 0.25));

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: 0x0f151c, metalness: 0.1, roughness: 0.9 })
);
ground.rotation.x = -Math.PI/2;
ground.position.y = 0;
scene.add(ground);

const geom = new THREE.BoxGeometry(1,1,1);
const mat = new THREE.MeshStandardMaterial({ color: 0xff6a00, metalness:0.35, roughness:0.4 });
const cube = new THREE.Mesh(geom, mat);
cube.position.y = 0.5;
scene.add(cube);

let last = 0;
function animate(t=0) {
  const dt = (t - last) / 1000;
  last = t;

  cube.rotation.y += dt * 0.8;
  cube.rotation.x += dt * 0.3;

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight * 0.7; // высота секции #stage
  renderer.setSize(w, h, false);
  if (camera) {
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
}
