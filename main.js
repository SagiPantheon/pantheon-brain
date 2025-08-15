import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const canvas = document.getElementById('c');

// Рендерер
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

// Сцена и камера
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0f1a);

const camera = new THREE.PerspectiveCamera(
  50, window.innerWidth / window.innerHeight, 0.1, 100
);
camera.position.set(0, 0, 4);

// Управление камерой
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Свет
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const dir = new THREE.DirectionalLight(0xffffff, 1);
dir.position.set(3, 2, 4);
scene.add(dir);

// Шар — аккуратно по центру и не гигантский
const geometry = new THREE.SphereGeometry(1, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: 0x3b6cff, roughness: 0.35, metalness: 0.1
});
const sphere = new THREE.Mesh(geometry, material);
sphere.position.set(0, 0, 0);
scene.add(sphere);

// Ресайз
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onResize);

// Анимация
function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.y += 0.003;   // плавное вращение
  controls.update();
  renderer.render(scene, camera);
}
animate();
