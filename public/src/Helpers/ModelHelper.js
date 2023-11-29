import * as THREE from 'three'
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';

const scenePath = 'public/models/scenezoom.gltf'

let mixer;

export const LoadGLTFByPath = (scene) => {
    return new Promise((resolve, reject) => {
      // Create a loader
      const loader = new GLTFLoader();
  
      // Load the GLTF file
      loader.load(scenePath, (gltf) => {

        const model = gltf.scene;
        scene.add(model);

        mixer = new THREE.AnimationMixer(model);
        const clips = gltf.animations;
        const clip = THREE.AnimationClip.findByName(clips, 'movingcamAction');
        const camera_pan = mixer.clipAction(clip);
        camera_pan.clampWhenFinished = true;

        const clip2 = THREE.AnimationClip.findByName(clips, 'headbob');
        const dog_move = mixer.clipAction(clip2);

        // const clip3 = THREE.AnimationClip.findByName(clips, 'movingcamAction.001');
        // const zoom_in = mixer.clipAction(clip3);

        camera_pan.play();
        dog_move.play();

        // zoom_in.play();
        // zoom_in.setLoop(THREE.LoopOnce);

        camera_pan.setLoop(THREE.LoopOnce);

        resolve(mixer);
      }, undefined, (error) => {
        reject(error);
      });
    });
};