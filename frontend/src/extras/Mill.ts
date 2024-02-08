import gsap from "gsap"
import Model from "../lib/model/Model";
import GameModel, {MillState} from "../GameModel";
import Renderer from "../lib/Renderer";

import Material from "../lib/core/Material";
import MillSparkShader from "./MillSparkShader";
import Timer from "../lib/Timer";


export default class Mill{
    private millBed: Model;
    private millHead: Model;
    private millControle: Model;
    private headPos: number =0.1;
    private tl: gsap.core.Timeline;
    private bedZ: number =-0.2;
    public sparkModel: Model;
    private renderer: Renderer;


    constructor(mill: Model, renderer: Renderer) {
        this.renderer = renderer;
        this.millBed =mill.children[0]as Model;
        this.millHead =mill.children[2]as Model;
        this.millControle =mill.children[1]as Model;

       let sm= renderer.modelByLabel["spark"];
        sm.visible =false;

        this.sparkModel =new Model(renderer,"spark");
        this.sparkModel.mesh =sm.mesh;
        this.sparkModel.material =new Material(renderer,"sparkMaterial",new MillSparkShader(renderer,"MillSparkShader"))
        this.sparkModel.material.depthWrite =false
        this.sparkModel.numInstances=30;
        this.sparkModel.setPosition(0,0.16,0)
        this.sparkModel.setScale(0.5,0.5,0.5)
        this.makeSparkBuffer()
        this.sparkModel.visible =false

        //this.sparkModel.addBuffer("pos")
      mill.addChild(this.sparkModel);



        return;


    }
    private makeSparkBuffer() {
        let data =new Float32Array( this.sparkModel.numInstances*4)
        let index =0;
        for(let i=0;i<this.sparkModel.numInstances;i++ ){



            data[index++]=Math.pow(Math.random(),2.0)*0.3;
            data[index++]=Math.random()*Math.PI/2;
            data[index++]=Math.random()*Math.PI*2;
            data[index++]=Math.random()+0.5;

        }



        let buffer= this.renderer.device.createBuffer({
            size: data.byteLength,
            usage: GPUBufferUsage.VERTEX,
            mappedAtCreation: true,
        });
        const dst = new Float32Array(buffer.getMappedRange());
        dst.set(data);

        buffer.unmap();
        buffer.label = "instanceBuffer_" + "" ;
        this.sparkModel.addBuffer("instanceData",buffer)

    }

    update(){

        this.millHead.setPosition(0,this.headPos,0)
        this.millBed.setPosition(0,0,this.bedZ)
    }

    setState(state: MillState) {
        if(state==MillState.OFF){
            if(this.tl)this.tl.clear()
            this.headPos=0.1;
            this.bedZ =-0.2;
            GameModel.renderer.modelByLabel["keyStock"].visible =true;
            GameModel.renderer.modelByLabel["key"].visible =false
           GameModel.pointLightsByLabel[ "millLight"].setStrength(0)
            this.sparkModel.visible =false


        }else if(state==MillState.ON){
            GameModel.renderer.modelByLabel["keyStock"].visible =true;
            GameModel.renderer.modelByLabel["key"].visible =false
            if(this.tl) this.tl.clear()
            this.headPos=0.1;
            this.bedZ =-0.2;
            this.tl = gsap.timeline({repeat: -1, repeatDelay: 1,});
            this.tl.timeScale(3);

            this.tl.to(this,{"headPos":0.03,ease: "sine.inOut"})
            this.tl.to(this,{"bedZ":0.2,duration:4,ease: "sine.inOut",onUpdate:()=>{this.millCut()}},">")
            this.tl.to(this,{"headPos":0.1,ease: "sine.inOut"},">")
            this.tl.to(this,{"bedZ":-0.2,duration:2,ease: "sine.inOut"},"<")

        }
        else if(state==MillState.DONE){
            if(this.tl) this.tl.clear()
            this.headPos=0.3;
            this.bedZ =-0.0;
            GameModel.renderer.modelByLabel["keyStock"].visible =false;
            GameModel.renderer.modelByLabel["key"].visible =true;
            GameModel.pointLightsByLabel[ "millLight"].setStrength(0)
            this.sparkModel.visible =false
        }
    }
    public millCut(){
        if(this.bedZ<0.15 && this.bedZ>-0.17){
            if(Timer.frame%2==0){
                GameModel.pointLightsByLabel[ "millLight"].setStrength(0)
            }else{
                GameModel.pointLightsByLabel[ "millLight"].setStrength(Math.pow(Math.random(),2.0));
            }
           // GameModel.pointLightsByLabel[ "millLight"].setStrength(Math.pow(Math.random(),2.0));
            this.sparkModel.visible =true
            this.sparkModel.setEuler(0,Math.random()*100,0);
        }
        else{
            this.sparkModel.visible =false;
            GameModel.pointLightsByLabel[ "millLight"].setStrength(0)
        }

    }
}
