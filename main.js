import * as THREE from "three";

let scene, camera, renderer;

// objects
let sun, sunDots, stars;
let planets;

// mouse drag
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

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
  createPlanets();

  // start animation loop
  animate();

  // handle window resize
  window.addEventListener("resize", onWindowResize);

  // handle scroll for zoom
  window.addEventListener("wheel", onWheel);

  // handle mouse drag for rotation
  window.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mouseup", onMouseUp);
  window.addEventListener("mousemove", onMouseMove);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onWheel(event) {
  camera.position.z += event.deltaY * 0.05;
  camera.position.z = Math.max(10, Math.min(100, camera.position.z));
}

function onMouseDown(event) {
  isDragging = true;
  previousMousePosition = { x: event.clientX, y: event.clientY };
  document.body.style.cursor = "grabbing";
}

function onMouseUp() {
  isDragging = false;
  document.body.style.cursor = "grab";
}

function onMouseMove(event) {
  if (isDragging) {
    const deltaMove = {
      x: event.clientX - previousMousePosition.x,
      y: event.clientY - previousMousePosition.y,
    };
    const rotationSpeed = 0.005;
    scene.rotation.y += deltaMove.x * rotationSpeed;
    scene.rotation.x += deltaMove.y * rotationSpeed;
    previousMousePosition = { x: event.clientX, y: event.clientY };
  } else {
    previousMousePosition = { x: event.clientX, y: event.clientY };
  }
}

function animate() {
  requestAnimationFrame(animate);

  rotateSun();
  blinkStars();
  rotatePlanets();
  rotateCameraAuto();

  renderer.render(scene, camera);
}

function createStarField() {
  stars = Array(300)
    .fill()
    .map(() => {
      const starGeometry = new THREE.SphereGeometry(0.1, 8, 8);
      const starMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
      });
      const star = new THREE.Mesh(starGeometry, starMaterial);

      star.position.x = (Math.random() - 0.5) * 250;
      star.position.y = (Math.random() - 0.5) * 150;
      star.position.z = (Math.random() - 0.5) * 200;

      scene.add(star);
      return star;
    });
}

function blinkStars() {
  stars.forEach((star) => {
    star.material.opacity = 0.7 + Math.random() * 0.3;
  });
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

function rotateSun() {
  sunDots.rotation.y += 0.01;
  sunDots.rotation.x += 0.005;
}

function createPlanets() {
  // create planets
  planets = new THREE.Group();
  const planetData = [
    { color: 0x888888, size: 0.5, distance: 6, speed: 0.02 }, // Mercury
    { color: 0xffa500, size: 1.2, distance: 8, speed: 0.015 }, // Venus
    { color: 0x0000ff, size: 1.3, distance: 10, speed: 0.01 }, // Earth
    { color: 0xff0000, size: 0.7, distance: 12, speed: 0.008 }, // Mars
    { color: 0xffff00, size: 2.5, distance: 15, speed: 0.006 }, // Jupiter
    { color: 0xffd700, size: 2.0, distance: 18, speed: 0.005 }, // Saturn
    { color: 0x00ffff, size: 1.7, distance: 21, speed: 0.004 }, // Uranus
    { color: 0x0000ff, size: 1.6, distance: 24, speed: 0.003 }, // Neptune
  ];
  planetData.forEach((data) => {
    const geometry = new THREE.SphereGeometry(data.size, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: data.color });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.x = data.distance;
    planet.userData = { angle: 0, speed: data.speed, distance: data.distance };
    planets.add(planet);
  });
  scene.add(planets);

  // initialize planet angles
  planets.children.forEach((planet) => {
    planet.userData.angle = Math.random() * Math.PI * 2;
  });

  // add planets orbits
  planetData.forEach((data) => {
    const orbitGeometry = new THREE.RingGeometry(
      data.distance - 0.1,
      data.distance + 0.1,
      128
    );
    const orbitMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    orbit.position.y = 0.01; // Slightly above the sun's center
    scene.add(orbit);
  });
}

function rotatePlanets() {
  planets.children.forEach((planet) => {
    planet.userData.angle += planet.userData.speed;
    planet.position.x =
      planet.userData.distance * Math.cos(planet.userData.angle);
    planet.position.z =
      planet.userData.distance * Math.sin(planet.userData.angle);
  });
}

function rotateCameraAuto() {
  if (!isDragging) {
    let rotationSpeed = 0.005;
    scene.rotation.y += rotationSpeed;
    scene.rotation.x += rotationSpeed * 0.5;

    // change direction interval
    setInterval(() => {
      rotationSpeed = Math.random() * 0.01 - 0.005;
    }, 3_000);
  }
}
