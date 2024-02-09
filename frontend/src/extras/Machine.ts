import Renderer from "../lib/Renderer";
import Model from "../lib/model/Model";
import gsap from "gsap";
import {Vector3} from "math.gl";
import Material from "../lib/core/Material";
import GBufferGlowPantsProgress from "../shaders/GBufferGlowPantsProgress";
import Timer from "../lib/Timer";
import GameModel from "../GameModel";

export default class Machine
{
    private renderer: Renderer;
    private drop: Model;
    private dripTL: gsap.core.Timeline;
    private dropStartPos: Vector3;

    private dropPos =new Vector3();
    private dropScale: number=0;
    private dropScale2: number=0;
    private dropOffset =0;
    private pants: Model;
    private glowProgress: number = 0;
    private targetProgress: number = 0;
    private arrow: Model;
    constructor(renderer:Renderer) {
        this.renderer =renderer;
        this.drop =this.renderer.modelByLabel["drip"]
        this.drop.visible =false;
        this.dropStartPos = this.drop.getPosition().clone()

console.log(this.drop,this.dropStartPos)
        this.pants =this.renderer.modelByLabel["pantsGlow"]
       let m =new Material(renderer,"pantsglow",new GBufferGlowPantsProgress(renderer,"pantsGlowShader"))
        this.pants.material =m;
        this.pants.material.uniforms.setUniform("progress",0)

        this.arrow =this.renderer.modelByLabel["coffeeArrow"];
    }
    start(){
        this.drop.visible =true;
        if(this.dripTL)this.dripTL.clear()
        this.dripTL =gsap.timeline({repeat: -1, repeatDelay: 1,});
        this.dripTL.call(()=>{
            this.dropPos.from(this.dropStartPos)
            this.dropScale=0;
            this.dropScale2 =0;
        },[],0)
        this.dripTL.to(this,{dropScale:3,duration:1},0.1)
        this.dripTL.to(this,{dropScale2:3,duration:1},0.5)
        this.dripTL.to(this,{ dropOffset:-0.6,ease:"power2.in",duration:0.5},1.3)
        this.dripTL.call(()=>{
          this.targetProgress+=0.02;
          if(this.targetProgress>0.5)this.targetProgress=0.5;
        },[],1.8)
        this.dripTL.set(this,{ dropScale:0,dropScale2:0.0},1.8)
    }.1
    update(){
        if(this.drop.visible){
            this.dropPos.y =this.dropStartPos.y+this.dropOffset;
           this.drop.setPositionV(this.dropPos)
            this.drop.setScale(this.dropScale-this.dropScale2*0.2,this.dropScale+this.dropScale2,this.dropScale-this.dropScale2*0.2)
            this.glowProgress+=(this.targetProgress-this.glowProgress)*0.01;
           if(this.glowProgress>0) this.pants.material.uniforms.setUniform("progress",this.glowProgress+0.03)
            GameModel.pointLightsByLabel[ "glowPantsLight"].setStrength(Math.sin(Timer.time*0.66)*0.2+0.8);
        this.arrow.setEuler(0,0,Math.sin(Timer.time)*0.2+Math.sin(Timer.time*3.0)*0.2+2)
        }
    }
}