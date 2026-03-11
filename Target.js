import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.127/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.127/build/three.module.js';
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js';

const DOWN_ANGLE = -Math.PI / 2;
const UP_ANGLE = 0;
const FLIP_DURATION_MS = 350;
const HOLD_DURATION_MS = 2000;

export default class Target 
{
    constructor(x, y, scene)
    {
        this.x = x;
        this.y = y;
        this.pivot = null;
        this.model = null;

        this.ready = this.loadModel('mesh/enemy1.gltf', x, y, scene);
    }

    loadModel(path, x, y, scene)
    {
        const loader = new GLTFLoader();

        return new Promise((resolve, reject) => {
            loader.load(path, (gltf) => 
            {
                const model = gltf.scene;
                model.rotation.y = -Math.PI / 2;

                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                const min = box.min.clone();

                model.position.x -= center.x;
                model.position.y -= min.y;
                model.position.z -= center.z;

                const pivot = new THREE.Group();
                pivot.position.set(x, y, 0);
                pivot.rotation.x = DOWN_ANGLE;
                pivot.add(model);

                scene.add(pivot);

                this.pivot = pivot;
                this.model = model;

                resolve(this);
            }, undefined, (error) => 
            {
                console.error(error);
                reject(error);
            });
        });
    } 

    raise()
    {
        return this.animateTo(UP_ANGLE);
    }

    lower()
    {
        return this.animateTo(DOWN_ANGLE);
    }

    animateTo(rotationX)
    {
        return new Promise((resolve) => {
            new TWEEN.Tween(this.pivot.rotation)
                .to({ x: rotationX }, FLIP_DURATION_MS)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onComplete(resolve)
                .start();
        });
    }

    static wait(duration)
    {
        return new Promise((resolve) => {
            window.setTimeout(resolve, duration);
        });
    }

    static async runCycle(targets)
    {
        while (true)
        {
            for (const target of targets)
            {
                await target.raise();
                await Target.wait(HOLD_DURATION_MS);
                await target.lower();
                await Target.wait(250);
            }
        }
    }
}
