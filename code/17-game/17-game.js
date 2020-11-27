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
let spawns = [
    [-2,0,-7.3],
    [-1.2,0,-7.3],
    [-2,0,-6.5],
    [-1.2,0,-6.5],
    [1.2,0,-7.3],
    [2,0,-7.3],
    [1.2,0,-6.5],
    [2,0,-6.5]
]
let keyDelete = 0; //0 = preveri(), 1 = nepreveri
let met1 = 0;
let met2 = 0;

//odlocnilne spremenljivke
let rdecCilj = [0,0,0,0];
let modriCilj = [0,0,0,0];

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
        sprem += 0.05;
        let x = sprem;
        let d = this.arrayDynamic[index].transform;

        if(color == 0){
            if(fig[index] == 13){
                switch(index) {
                    case 0:
                        mat4.fromTranslation(d,[-4.48,0.05,-7.3]);
                        rdecCilj[0] = 1;
                        break;
                    case 1:
                        mat4.fromTranslation(d,[-3.66,0.05,-7.3]);
                        rdecCilj[1] = 1;
                        break;
                    case 2:
                        mat4.fromTranslation(d,[-4.48,0.05,-6.5]);
                        rdecCilj[2] = 1;
                        break;
                    case 3:
                        mat4.fromTranslation(d,[-3.66,0.05,-6.5]);
                        rdecCilj[3] = 1;
                        break;
                    default:
                        //nothing
                }
            }
            if(fig[index] == 12 && x <= 1.1){
                mat4.fromTranslation(d,[d[12], d[13], d[14]+0.05]);
            }
            else if(fig[index] == 11 && x <= 1.1){
                mat4.fromTranslation(d,[d[12]-0.05, d[13], d[14]]);
            }
            else if(fig[index] >= 4 && fig[index] < 11 && x <= 1.1){
                mat4.fromTranslation(d,[d[12], d[13], d[14]-0.05]);
            }
            else if(fig[index] == 3 && x <= 1.1){
                mat4.fromTranslation(d,[d[12]+0.05, d[13], d[14]]);
            }
            else if(x <= 1.1){
                mat4.fromTranslation(d,[d[12], d[13], d[14]+0.05]);
            }
            else{
                return;
            }
        }
        else if(color == 1){

            if(fig[index] == 13){
                switch(index) {
                    case 4:
                        mat4.fromTranslation(d,[3.5,0.05,-7.3]);
                        modriCilj[0] = 1;
                        break;
                    case 5:
                        mat4.fromTranslation(d,[4.35,0.05,-7.3]);
                        modriCilj[1] = 1;
                        break;
                    case 6:
                        mat4.fromTranslation(d,[3.5,0.05,-6.5]);
                        modriCilj[2] = 1;
                        break;
                    case 7:
                        mat4.fromTranslation(d,[4.35,0.05,-6.5]);
                        modriCilj[3] = 1;
                        break;
                    default:
                    //nothing
                }
            }
            if(fig[index] == 12 && x <= 1.1){
                mat4.fromTranslation(d,[d[12], d[13], d[14]+0.05]);
            }
            else if(fig[index] == 11 && x <= 1.1){
                mat4.fromTranslation(d,[d[12]+0.05, d[13], d[14]]);
            }
            else if(fig[index] >= 4 && fig[index] < 11 && x <= 1.1){
                mat4.fromTranslation(d,[d[12], d[13], d[14]-0.05]);
            }
            else if(fig[index] == 3 && x <= 1.1){
                mat4.fromTranslation(d,[d[12]-0.05, d[13], d[14]]);
            }
            else if(x <= 1.1){
                mat4.fromTranslation(d,[d[12], d[13], d[14]+0.05]);
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

        //kocka1
        document.getElementById("tb").addEventListener("click",function() {
            met1 = document.getElementById("tb").innerHTML;
            //console.log(met1);
        });
        //kocka2
        document.getElementById("tb").addEventListener("click",function() {
            met2 = document.getElementById("tb").innerHTML;
            //console.log(met2);
        });


        if(rdecCilj[0] == 1 && rdecCilj[1] == 1 && rdecCilj[2] == 1 && rdecCilj[3] == 1){
            alert("Zmagal je rdeči igralec!");
        }
        if(modriCilj[0] == 1 && modriCilj[1] == 1 && modriCilj[2] == 1 && modriCilj[3] == 1){
            alert("Zmagal je modri igralec!");
        }

        if(this.arrayDynamic){
            let that = this;
            //eliminiraj r1
            document.getElementById("elim_r1").addEventListener("click",function() {
                let d = that.arrayDynamic[0].transform;
                mat4.fromTranslation(d,spawns[0]);
                pastBoolean1 = false;
                fig[0] = -1;
            });
            document.getElementById("elim_r2").addEventListener("click",function() {
                let d = that.arrayDynamic[1].transform;
                mat4.fromTranslation(d,spawns[1]);
                pastBoolean2 = false;
                fig[1] = -1;
            });
            document.getElementById("elim_r3").addEventListener("click",function() {
                let d = that.arrayDynamic[2].transform;
                mat4.fromTranslation(d,spawns[2]);
                pastBoolean3 = false;
                fig[2] = -1;
            });
            document.getElementById("elim_r4").addEventListener("click",function() {
                let d = that.arrayDynamic[3].transform;
                mat4.fromTranslation(d,spawns[3]);
                pastBoolean4 = false;
                fig[3] = -1;
            });
            document.getElementById("elim_b1").addEventListener("click",function() {
                let d = that.arrayDynamic[4].transform;
                mat4.fromTranslation(d,spawns[4]);
                pastBoolean5 = false;
                fig[4] = -1;
            });
            document.getElementById("elim_b2").addEventListener("click",function() {
                let d = that.arrayDynamic[5].transform;
                mat4.fromTranslation(d,spawns[5]);
                pastBoolean6 = false;
                fig[5] = -1;
            });
            document.getElementById("elim_b3").addEventListener("click",function() {
                let d = that.arrayDynamic[6].transform;
                mat4.fromTranslation(d,spawns[6]);
                pastBoolean7 = false;
                fig[6] = -1;
            });
            document.getElementById("elim_b4").addEventListener("click",function() {
                let d = that.arrayDynamic[7].transform;
                mat4.fromTranslation(d,spawns[7]);
                pastBoolean8 = false;
                fig[7] = -1;
            });

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
            //console.log(predvPoz);

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
