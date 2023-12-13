import * as THREE from 'three'
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';

const clock = new THREE.Clock();

// Renderer does the job of rendering the graphics
let renderer = new THREE.WebGLRenderer({

	// Defines the canvas component in the DOM that will be used
	canvas: document.querySelector('#background'),
  antialias: true,
});

let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);

// Refer to: https://youtu.be/r4bepZ2PEUw?si=Xo4HgSrk7DkqZpu_
window.addEventListener('resize', function(){
	var width = window.innerWidth;
	var height = window.innerHeight;
	renderer.setSize(width, height);
	camera.aspect = width/height;
	camera.updateProjectionMatrix();
})

renderer.setSize(window.innerWidth, window.innerHeight);

// Set up the renderer with the default settings for threejs.org/editor - revision r153
renderer.shadows = true;
renderer.shadowType = 1;
renderer.shadowMap.enabled = true;
renderer.setPixelRatio( window.devicePixelRatio );
renderer.toneMapping = 0;
renderer.toneMappingExposure = 1
renderer.useLegacyLights  = false; // This is needed despite being deprecated for accurate lighting
renderer.toneMapping = THREE.NoToneMapping;
renderer.setClearColor(0xffffff, 0);
// Make sure three/build/three.module.js is over r152 or this feature is not available
renderer.outputColorSpace = THREE.SRGBColorSpace 

const scene = new THREE.Scene();
let cameraList = [];
let mixer;

// Camera movement - https://youtu.be/bfqlPHI3TzE?si=3ufLoN5lCDsp5KVn
let mouseX = 0;
let mouseY = 0;
const minX = -1.25;
const maxX = 1;
const minY = 1.1;
const maxY = 1.25;
const originalLookAt = new THREE.Vector3(0, 0, -1);
const targetLookAt = new THREE.Vector3(0, 0, 0);

document.addEventListener('mousemove', function(e){
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;
  mouseX = (e.clientX - windowHalfX) / 100;
  mouseY = (e.clientY - windowHalfY) / 100; 

  // Update the target lookAt position based on mouse movement
  targetLookAt.x = mouseX;
  targetLookAt.y = -mouseY;
})

const scenePath = 'src/models/scene.gltf'
let model;
let clips;

const LoadGLTFByPath = (scene) => {
    return new Promise((resolve, reject) => {
      // Create a loader
      const loader = new GLTFLoader();
  
      // Load the GLTF file
      loader.load(scenePath, (gltf) => {
        model = gltf.scene;
        scene.add(model);

        mixer = new THREE.AnimationMixer(model);
        clips = gltf.animations;
  
        resolve(mixer);
      }, undefined, (error) => {
        reject(error);
      });
    });
};

// Play a given animation clip
function animateClip(name, animateOnce){
  const clip = THREE.AnimationClip.findByName(clips, name);

  if (clip) {
    const animation = mixer.clipAction(clip);

    animation.play();

    if (animateOnce) {
      animation.clampWhenFinished = true;
      animation.setLoop(THREE.LoopOnce);
    }
  } else {
    console.error(`Animation clip '${name}' not found.`);
  }
}

let onStart = true; 

// Load the GLTF model
LoadGLTFByPath(scene)
  .then((loadedMixer) => {
    mixer = loadedMixer;

    if(onStart){
      animateClip('movingcamAction', true);
    } else{
      animateClip('movingcamAction.002', true);
      console.log("not on start");
    }
    
    animateClip('headbob.003', false);

    retrieveListOfCameras(scene);
  })
  .catch((error) => {
    console.error('Error loading JSON scene:', error);
  });

// Get a list of all cameras in the scene
function retrieveListOfCameras(scene){
  scene.traverse(function (object) {
    if (object.isCamera) {
      cameraList.push(object);
    }
  });

  // Set the camera to one of the cameras from the list 
  if(onStart){
    camera = cameraList[0];
  } else{
    camera = cameraList[1];
  }
  
  updateCameraAspect(camera);

  // Start the animation loop after the model and cameras are loaded
  animate();
}

// When begin button is pressed
document.getElementById('begin-button').addEventListener('click', function(){
  onStart = false;

  mixer = new THREE.AnimationMixer(scene);
  animateClip('movingcamAction.001', true);

  // Remove welcome container 
  const welcomeContainer = document.querySelector('.welcome-container');
  welcomeContainer.parentNode.removeChild(welcomeContainer);

  // Probably going to want a less exposing way to get here
  setTimeout(function () {
    window.location.href = '/job-apps';
  }, 1500);

});

// Get the value of the 'nextScene' query parameter
const urlParams = new URLSearchParams(window.location.search);
const nextSceneParam = urlParams.get('nextScene');

if (nextSceneParam === 'true') {
  onStart = false;
  const welcomeContainer = document.querySelector('.welcome-container');
  welcomeContainer.parentNode.removeChild(welcomeContainer);
  // DYNAMICALLY ADD INTERVIEW CONTENT HERE

}

// Set the camera aspect ratio to match the browser window dimensions
function updateCameraAspect(camera) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

// A method to be run each time a frame is generated
function animate() {
  requestAnimationFrame(animate);

  if(mixer){
    mixer.update(clock.getDelta());
  }
  
  // Allows camera to follow mouse on the start page
  if(clock.elapsedTime >= 3.7 && onStart){
    // Update the camera position based on mouse movement
    camera.position.x += (mouseX - camera.position.x) * 0.001;
    camera.position.y += (-mouseY - camera.position.y) * 0.001;

    // Clamp the camera position
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, minX, maxX);
    camera.position.y = THREE.MathUtils.clamp(camera.position.y, minY, maxY);

    // Update the target position based on the camera's new position
    targetLookAt.x = camera.position.x;
    targetLookAt.y = camera.position.y;

    const blendedLookAt = originalLookAt.clone().lerp(targetLookAt.clone().normalize(), 0.1);
    camera.lookAt(blendedLookAt); 
  }

  renderer.render(scene, camera);
};