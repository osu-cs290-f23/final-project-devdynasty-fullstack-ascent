import * as THREE from 'three';


const FOV_deg = 75; // field of view in degrees
const aspect_ratio = window.innerWidth / window.innerHeight;
const near_clip = 0.1;
const far_clip = 1000;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(FOV_deg, aspect_ratio, near_clip, far_clip);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.prepend(renderer.domElement);  // this is a <canvas> element

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);

    // animation here
    cube.rotation.x += 5;
    cube.rotation.y += 5;


    renderer.render(scene, camera);
}

animate();
