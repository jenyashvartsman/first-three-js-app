import * as THREE from "three";

init();

function init() {
  // create scene, camera, renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 40;
  const renderer = new THREE.WebGLRenderer();

  // setup renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // create objects
  createStarField(scene);

  // start animation loop
  animate(camera, scene, renderer);

  // handle window resize
  window.addEventListener(
    "resize",
    () => onWindowResize(camera, renderer),
    false
  );
}

function onWindowResize(camera, renderer) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(camera, scene, renderer) {
  requestAnimationFrame(() => animate(camera, scene, renderer));
  renderer.render(scene, camera);
}

function createStarField(scene) {
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
