import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';
    import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/controls/OrbitControls.js';
    import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';

    // Scene setup
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 3, 5);

    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1); // Ambient light to illuminate everything softly
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Directional light for highlights and shadows
    directionalLight.position.set(5, 5, 5).normalize(); // Position it to cast light at the model
    scene.add(directionalLight);

    // Load 3D model
    const loader = new GLTFLoader();
    let movieCamera;
    let mixer;  // To control animations

    loader.load('cam2.glb', (gltf) => {
        console.log('Loaded GLB model:', gltf);  // Debugging output

        movieCamera = gltf.scene;
        movieCamera.scale.set(30, 30, 30);  // Adjust size
        movieCamera.position.set(0, 1, 0);  // Set position
        scene.add(movieCamera);

        // Check for animations
        if (gltf.animations && gltf.animations.length) {
            console.log('Animations found:', gltf.animations);
            mixer = new THREE.AnimationMixer(movieCamera);
            gltf.animations.forEach((clip) => {
                mixer.clipAction(clip).play();
            });
        } else {
            console.log('No animations found');
        }
    }, undefined, (error) => {
        console.error('Error loading GLB file:', error);
    });

    // Render loop
    function animate() {
        requestAnimationFrame(animate);

        // Update animation mixer if animations are present
        if (mixer) {
            mixer.update(0.01);  // Adjust the delta time (0.01 is the time step)
        }

        // Rotate the model manually if no animations are found
        if (movieCamera) {
            movieCamera.rotation.y += 0.01;  // Rotate model manually
        }

        controls.update();
        renderer.render(scene, camera);
    }
    animate();
