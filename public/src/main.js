import * as THREE from 'three'
// import { LoadGLTFByPath } from './Helpers/ModelHelper.js'

//Renderer does the job of rendering the graphics
let renderer = new THREE.WebGLRenderer({

	//Defines the canvas component in the DOM that will be used
	canvas: document.querySelector('#background'),
  antialias: true,
});

// const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000 );
// scene.add(camera);
// let camera;
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
// scene.add(camera); // Add the camera to the scene

// refer to: https://youtu.be/r4bepZ2PEUw?si=Xo4HgSrk7DkqZpu_
window.addEventListener('resize', function(){
	var width = window.innerWidth;
	var height = window.innerHeight;
	renderer.setSize(width, height);
	camera.aspect = width/height;
	camera.updateProjectionMatrix();
})

renderer.setSize(window.innerWidth, window.innerHeight);

//set up the renderer with the default settings for threejs.org/editor - revision r153
renderer.shadows = true;
renderer.shadowType = 1;
renderer.shadowMap.enabled = true;
renderer.setPixelRatio( window.devicePixelRatio );
renderer.toneMapping = 0;
renderer.toneMappingExposure = 1
renderer.useLegacyLights  = false;
renderer.toneMapping = THREE.NoToneMapping;
renderer.setClearColor(0xffffff, 0);
//make sure three/build/three.module.js is over r152 or this feature is not available. 
renderer.outputColorSpace = THREE.SRGBColorSpace 

const scene = new THREE.Scene();

let cameraList = [];

// let camera;

let mixer;

// camera movement - https://youtu.be/bfqlPHI3TzE?si=3ufLoN5lCDsp5KVn

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




// I'M GOING TO NEED TO MAKE THE MODEL LOADER LOCAL TO MAIN.JS TO CONTROL ANIMATIONS
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';

const scenePath = 'public/models/scene.gltf'
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


function animateClip(name, animateOnce){
  const clip = THREE.AnimationClip.findByName(clips, name);
  const animation = mixer.clipAction(clip);

  animation.play();

  if(animateOnce){
    animation.clampWhenFinished = true;
    animation.setLoop(THREE.LoopOnce);
  }
}


// Load the GLTF model
LoadGLTFByPath(scene)
  .then((loadedMixer) => {
    mixer = loadedMixer;

    animateClip('movingcamAction', true);
    animateClip('headbob.003', false);

    retrieveListOfCameras(scene);
  })
  .catch((error) => {
    console.error('Error loading JSON scene:', error);
  });

//retrieve list of all cameras
function retrieveListOfCameras(scene){
  // Get a list of all cameras in the scene
  scene.traverse(function (object) {
    if (object.isCamera) {
      cameraList.push(object);
    }
  });

  //Set the camera to the first value in the list of cameras
  camera = cameraList[0];

  updateCameraAspect(camera);

  // Start the animation loop after the model and cameras are loaded
  animate();
}
let onStart = true;


document.getElementById('begin-button').addEventListener('click', function(){
  onStart = false;

  mixer = new THREE.AnimationMixer(scene);

  animateClip('movingcamAction.001', true);

  // remove welcome container
  const welcomeContainer = document.querySelector('.welcome-container');
  welcomeContainer.parentNode.removeChild(welcomeContainer);

  console.log("Begin game");

  // Create a new button element
  const applyButton = document.createElement('button');
  applyButton.type = 'button';
  applyButton.id = 'begin-button';
  applyButton.textContent = 'Apply';

  // Create a new container div for the button
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('start-button-container');
  buttonContainer.appendChild(applyButton);

  // Append the container to the body or any desired parent
  document.body.appendChild(buttonContainer);

  // Add event listener to the new button if needed
  applyButton.addEventListener('click', function() {
    window.location.href = 'public/job-apps.html';
    // Your button click logic here
  });

  // // // Create a new button element
  // const applyButton = document.createElement('button');
  // applyButton.type = 'button';
  // applyButton.id = 'begin-button';
  // applyButton.textContent = 'Apply';

  // // Create a container div for the button
  // const buttonContainer = document.createElement('div');
  // buttonContainer.classList.add('start-button-container');
  // buttonContainer.appendChild(applyButton);

  // // Append the container to the parent of welcomeContainer
  // welcomeContainer.parentNode.appendChild(buttonContainer);

  // // Add event listener to the new button if needed
  // applyButton.addEventListener('click', function() {
  //   window.location.href = 'public/job-apps.html';
  //   // Your button click logic here
  // });

  // window.location.href = 'public/job-apps.html';
});





// Set the camera aspect ratio to match the browser window dimensions
function updateCameraAspect(camera) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

const clock = new THREE.Clock();

//A method to be run each time a frame is generated
function animate() {
  requestAnimationFrame(animate);

  if(mixer){
    mixer.update(clock.getDelta());
  }
  

  
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