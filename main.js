// Import Three.js and GLTFLoader
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";



// Define a Web Component
class ThreeDViewer extends HTMLElement {
  constructor() {
    super();

    // Attach a shadow DOM
    this.attachShadow({ mode: 'open' });

    // Create a container for the canvas
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.position = 'relative';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';

    this.shadowRoot.appendChild(container);

    this.container = container;
  }

  connectedCallback() {
    // Initialize Three.js scene after the component is added to the DOM
    this.initScene();
  }

  initScene() {
    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      0.5,
      this.container.offsetWidth / this.container.offsetHeight,
      0.1,
      2000
    );

    // Set the camera's position - high value for zoom out
    camera.position.z = 10;
    console.debug('Camera position set to z=10.');

    // Renderer setup with anti-aliasing
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio); // Ensure high-quality rendering on high-DPI screens
    renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    this.container.appendChild(renderer.domElement);
    console.debug('Renderer with anti-aliasing created and appended to container.');

    // Controls setup (OrbitControls for rotation, zoom, and pan)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smooth damping for better experience
    controls.dampingFactor = 0.05;
    console.debug('OrbitControls initialized.');

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040); // Soft light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Load the GLTF model
    const loader = new GLTFLoader();

    loader.load(
      'WWS_000.glb', // URL to the 3D model file
      (gltf) => {
        console.debug('GLTF model loaded successfully.');
          gltf.scene.rotation.x = Math.PI/2;
          console.debug('Model rotated 90° on Y-axis.');
          scene.add(gltf.scene); // Add the loaded model to the scene
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.error('An error occurred:', error);
      }
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
      camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    });
  }
}

// Register the Web Component
customElements.define('three-d-viewer', ThreeDViewer);

// Usage:
// Add <three-d-viewer></three-d-viewer> to your HTML file where you want to display the 3D model
