import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.127/examples/jsm/loaders/GLTFLoader.js';
//import * as TWEEN from 'https://cdnjs.cloudflare.com/ajax/libs/tween.js/16.7.0/Tween.min.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.127/build/three.module.js';
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js';

export default class Target 
{
    constructor(x, y, scene)
    {
        this.x = x;
        this.y = y;

        this.loadModel('mesh/enemy1.gltf', x, y, scene)
    }

    loadModel(path, x, y, scene)
    {
        const loader = new GLTFLoader();

        loader.load(path, function ( gltf ) 
        {
            gltf.scene.rotation.y = -Math.PI / 2;
            gltf.scene.position.x = x;
            gltf.scene.position.y = y;
            
            //animation test
            var p = new THREE.Vector3(10, 0, 0); // create on init
            /*animateVector3(gltf.scene.position, p, {
    
                duration: 5000, 
                
                easing : TWEEN.Easing.Quadratic.InOut,
                
                update: function(d) {
                },
                
                callback : function(){
                }});*/
            
            scene.add( gltf.scene );
        }, undefined, function ( error ) 
        {
            console.error( error );
        } );
    } 
}

function animateVector3(vectorToAnimate, target, options)
    {    
        options = options || {};    // get targets from options or set to defaults
        var to = target || THREE.Vector3(),
            easing = options.easing || TWEEN.Easing.Quadratic.In,
            duration = options.duration || 2000;    // create the tween
        var tweenVector3 = new TWEEN.Tween(vectorToAnimate)
            .to({ x: to.x, y: to.y, z: to.z, }, duration)
            .easing(easing)
            .onUpdate(function(d) {
                if(options.update) options.update(d);
            })
            .onComplete(function(){
                if(options.callback) options.callback();
            });    // start the tween

        tweenVector3.start();    // return the tween in case we want to manipulate it later on

        return tweenVector3;
    }