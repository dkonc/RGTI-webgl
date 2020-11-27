import Application from '../../common/Application.js';

import Renderer from './Renderer.js';
import Physics from './Physics.js';
import Camera from './Camera.js';
import SceneLoader from './SceneLoader.js';
import SceneBuilder from './SceneBuilder.js';

const mat4 = glMatrix.mat4;

let sprem = 0;
let past = false;
let index = 0; //index modela
let color = 0; //0 = RED, 1 = BLUE
let fig = [-1,-1,-1,-1,-1,-1,-1,-1];

//figura1red
let firstMove1 = true; //true, ce mora biti teleportiran na start
let pastBoolean1 = false; //kolikokrat moramo to pocet

//figura2red
let firstMove2 = true;
let pastBoolean2 = false;

//figura3red
let firstMove3 = true;
let pastBoolean3 = false;

//figura4red
let firstMove4 = true;
let pastBoolean4 = false;

//figura1blue
let firstMove5 = true;
let pastBoolean5 = false;

//figura2blue
let firstMove6 = true;
let pastBoolean6 = false;

//figura3blue
let firstMove7 = true;
let pastBoolean7 = false;

//figura4blue
let firstMove8 = true;
let pastBoolean8 = false;

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

    logika(index,color){
        sprem += 0.01;
        let x = sprem;
        let d = this.arrayDynamic[index].transform;

        if(color == 0){
            if(fig[index] == 12 && x <= 1.1){
                mat4.fromTranslation(d,[d[12], d[13], d[14]+0.01]);
            }
            else if(fig[index] == 11 && x <= 1.1){
                mat4.fromTranslation(d,[d[12]-0.01, d[13], d[14]]);
            }
            else if(fig[index] >= 4 && fig[index] < 11 && x <= 1.1){
                mat4.fromTranslation(d,[d[12], d[13], d[14]-0.01]);
            }
            else if(fig[index] == 3 && x <= 1.1){
                mat4.fromTranslation(d,[d[12]+0.01, d[13], d[14]]);
            }
            else if(x <= 1.1){
                mat4.fromTranslation(d,[d[12], d[13], d[14]+0.01]);
            }
            else{
                return;
            }
        }
        else if(color == 1){
            if(fig[index] == 12 && x <= 1.1){
                mat4.fromTranslation(d,[d[12], d[13], d[14]+0.01]);
            }
            else if(fig[index] == 11 && x <= 1.1){
                mat4.fromTranslation(d,[d[12]+0.01, d[13], d[14]]);
            }
            else if(fig[index] >= 4 && fig[index] < 11 && x <= 1.1){
                mat4.fromTranslation(d,[d[12], d[13], d[14]-0.01]);
            }
            else if(fig[index] == 3 && x <= 1.1){
                mat4.fromTranslation(d,[d[12]-0.01, d[13], d[14]]);
            }
            else if(x <= 1.1){
                mat4.fromTranslation(d,[d[12], d[13], d[14]+0.01]);
            }
            else{
                return;
            }
        }


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
    logika1(index,color){

        let d = this.arrayDynamic[index].transform;
        if(color == 0){
            mat4.fromTranslation(d,[-1.1, 0.2, -5.3]);
        }
        else{
            mat4.fromTranslation(d,[1.1, 0.2, -5.3]);
        }

        if(index == 0){
            firstMove1 = false;
            pastBoolean1 = true;
        }
        if(index == 1){
            firstMove2 = false;
            pastBoolean2 = true;
        }
        if(index == 2){
            firstMove3 = false;
            pastBoolean3 = true;
        }
        if(index == 3){
            firstMove4 = false;
            pastBoolean4 = true;
        }
        if(index == 4){
            firstMove5 = false;
            pastBoolean5 = true;
        }
        if(index == 5){
            firstMove6 = false;
            pastBoolean6 = true;
        }
        if(index == 6){
            firstMove7 = false;
            pastBoolean7 = true;
        }
        if(index == 7){
            firstMove8 = false;
            pastBoolean8 = true;
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

        if(this.arrayDynamic){
            let that = this;
            window.onkeypress=function(e){
                if(e.key == "1"){
                    index = 0;
                    color = 0;
                    if(pastBoolean1 == false){
                        that.logika1(index,color);
                    }
                    else{
                        fig[index]++;
                        sprem = 0;
                        past = true;
                    }
                }
                if(e.key == "2"){
                    index = 1;
                    color = 0;
                    if(pastBoolean2 == false){
                        that.logika1(index,color);
                    }
                    else{
                        fig[index]++;
                        sprem = 0;
                        past = true;
                    }
                }
                if(e.key == "3"){
                    index = 2;
                    color = 0;
                    if(pastBoolean3 == false){
                        that.logika1(index,color);
                    }
                    else{
                        fig[index]++;
                        sprem = 0;
                        past = true;
                    }
                }
                if(e.key == "4"){
                    index = 3;
                    color = 0;
                    if(pastBoolean4 == false){
                        that.logika1(index,color);
                    }
                    else{
                        fig[index]++;
                        sprem = 0;
                        past = true;
                    }
                }
                if(e.key == "5"){
                    index = 4;
                    color = 1;
                    if(pastBoolean5 == false){
                        that.logika1(index,color);
                    }
                    else{
                        fig[index]++;
                        sprem = 0;
                        past = true;
                    }
                }
                if(e.key == "6"){
                    index = 5;
                    color = 1;
                    if(pastBoolean6 == false){
                        that.logika1(index,color);
                    }
                    else{
                        fig[index]++;
                        sprem = 0;
                        past = true;
                    }
                }
                if(e.key == "7"){
                    index = 6;
                    color = 1;
                    if(pastBoolean7 == false){
                        that.logika1(index,color);
                    }
                    else{
                        fig[index]++;
                        sprem = 0;
                        past = true;
                    }
                }
                if(e.key == "8"){
                    index = 7;
                    color = 1;
                    if(pastBoolean8 == false){
                        that.logika1(index,color);
                    }
                    else{
                        fig[index]++;
                        sprem = 0;
                        past = true;
                    }
                }

            };

            //premik za prvi zeton
            if(past == true){
                this.logika(index,color);

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
