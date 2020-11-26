import Application from '../../common/Application.js';

import Renderer from './Renderer.js';
import Physics from './Physics.js';
import Camera from './Camera.js';
import SceneLoader from './SceneLoader.js';
import SceneBuilder from './SceneBuilder.js';

const mat4 = glMatrix.mat4;
let past = false;
let sprem = 0;
//arrayi tarc


class App extends Application {

    start() {
        const gl = this.gl;


        this.renderer = new Renderer(gl);
        this.time = Date.now();
        this.startTime = this.time;
        this.aspect = 1;

        this.pointerlockchangeHandler = this.pointerlockchangeHandler.bind(this);
        document.addEventListener('pointerlockchange', this.pointerlockchangeHandler);

        this.load('scene.json');
    }

    async load(uri) {
        const scene = await new SceneLoader().loadScene('scene.json');
        const builder = new SceneBuilder(scene);
        this.scene = builder.build();
        this.physics = new Physics(this.scene);
        this.arrayDynamic = [];
        let a = this.arrayDynamic;

        // Find first camera.
        this.camera = null;

        this.scene.traverse(node => {
            if (node instanceof Camera) {
                this.camera = node;
            }
            if(node.name == "coin"){
                a.push(node);
            }
        });
        //console.log(this.arrayDynamic[0].translation);
        this.camera.aspect = this.aspect;
        this.camera.updateProjection();
        this.renderer.prepare(this.scene);
    }

    logika(){
        sprem += 0.01;
        let x = sprem;
        let m = this.arrayDynamic[0].translation;
        let d = this.arrayDynamic[0].transform;

        if(x >= 1.05){
            past = false;
            mat4.fromTranslation(d, [m[0], m[1], m[2]+x]);
            //m[2] = m[2] + x;
            return;
        }
        mat4.fromTranslation(d, [m[0], m[1], m[2]+x]);
    }

    enableCamera() {
        this.canvas.requestPointerLock();
    }

    pointerlockchangeHandler() {
        if (!this.camera) {
            return;
        }

        if (document.pointerLockElement === this.canvas) {
            this.camera.enable();
        } else {
            this.camera.disable();
        }
    }

    update() {
        const t = this.time = Date.now();
        const dt = (this.time - this.startTime) * 0.001;

        this.startTime = this.time;

        if (this.camera) {
            this.camera.update(dt);
        }

        if (this.physics) {
            this.physics.update(dt);
        }

        window.onkeypress=function(e){
            if(e.key == "1"){
                past = true;
            }
        };

        if(this.arrayDynamic){

            if(past == true){
                this.logika();
            }
        }

    }


    render() {
        if (this.scene) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    resize() {
        const w = this.canvas.clientWidth;
        const h = this.canvas.clientHeight;
        this.aspect = w / h;
        if (this.camera) {
            this.camera.aspect = this.aspect;
            this.camera.updateProjection();
        }
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('canvas');
    const app = new App(canvas);
    const gui = new dat.GUI();
    gui.add(app, 'enableCamera');
});
