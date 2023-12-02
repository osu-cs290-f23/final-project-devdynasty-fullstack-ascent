var THREE = require("three")
var GLTFLoader = require("three/addons/loaders/GLTFLoader.js")
var OrbitControls = require("three/examples/jsm/controls/OrbitControls")


// Global variables
const FOV_deg = 75; // field of view in degrees
const aspect_ratio = window.innerWidth / window.innerHeight;
const near_clip = 0.1;
const far_clip = 1000;

// Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8b92ad);
const camera = new THREE.PerspectiveCamera(FOV_deg, aspect_ratio, near_clip, far_clip);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.prepend(renderer.domElement);  // this is a <canvas> element

/*
// Add cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
*/

// Add light
var alight = new THREE.AmbientLight(0x404040, 100);
scene.add(alight);

// Add computers
const loader = new GLTFLoader();
loader.load('scene.gltf', function (gltf) {
    var stuff = gltf.scene.children[0];
    stuff.scale.set(200, 200, 200);
    scene.add(gltf.scene);
}, undefined, function (error) {
    console.error(error);
})

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 20, 100);
controls.update();

function animate() {
    requestAnimationFrame(animate);
    controls.update();

    // animation here
    /*
    cube.rotation.x += 5;
    cube.rotation.y += 5;
    */

    renderer.render(scene, camera);
}

animate();

