import * as THREE from "three";

let scene, camera, renderer;
let sun, sunDots;

init();

function init() {
  // create scene, camera, renderer
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 40;
  renderer = new THREE.WebGLRenderer();

  // setup renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // create objects
  createStarField();
  createSun();

  // start animation loop
  animate();

  // handle window resize
  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  sunDots.rotation.y += 0.01;
  sunDots.rotation.x += 0.005;

  renderer.render(scene, camera);
}

function createStarField() {
  for (let i = 0; i < 300; i++) {
    const starGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(starGeometry, starMaterial);

    star.position.x = (Math.random() - 0.5) * 250;
    star.position.y = (Math.random() - 0.5) * 150;
    star.position.z = (Math.random() - 0.5) * 200;

    scene.add(star);
  }
}

function createSun() {
  // sun core
  const sunGeometry = new THREE.SphereGeometry(4, 32, 32);
  const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  sun = new THREE.Mesh(sunGeometry, sunMaterial);
  scene.add(sun);

  // sun surface dots
  sunDots = new THREE.Group();
  for (let i = 0; i < 1500; i++) {
    const dotGeometry = new THREE.SphereGeometry(0.15, 6, 6);
    const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xffa500 });
    const dot = new THREE.Mesh(dotGeometry, dotMaterial);

    // Randomly position dots on the surface of the sun
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const radius = 3.9; // slightly above sun surface

    dot.position.x = radius * Math.sin(phi) * Math.cos(theta);
    dot.position.y = radius * Math.sin(phi) * Math.sin(theta);
    dot.position.z = radius * Math.cos(phi);

    sunDots.add(dot);
  }
  scene.add(sunDots);
}
