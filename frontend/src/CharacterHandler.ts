import {Vector2, Vector3, Vector4} from "math.gl";
import Renderer from "./lib/Renderer";
import Camera from "./lib/Camera";
import AnimationMixer from "./lib/animation/AnimationMixer";
import Object3D from "./lib/core/Object3D";
import {FloorHitIndicator} from "./extras/FloorHitIndicator";

import gsap from "gsap";
import Timeline from "gsap";
import Main from "./Main";



export default class CharacterHandler {
    private renderer: Renderer;
    private camera: Camera;
    private animationMixer: AnimationMixer;
    private characterRoot: Object3D;
    private floorHit: boolean =false;
    private floorPos:Vector3 =new Vector3(0,-1.5,0);
    private up:Vector3 =new Vector3(0,1,0);
    private floorPlane:Vector3 =new Vector3(0,-1.5,0);
    public floorHitIndicator: FloorHitIndicator;

    private charPos:Vector3  =new Vector3(0,0,0);
    private root:Object3D
    private rootTarget=new Vector3(0,-1.5,0);

    // @ts-ignore
    private tl :Timeline;
    private characterRot: number =0;
    private targetOffset=0;
    private offset =0;
    private scene: number=0;
    private main: Main;
    constructor(renderer: Renderer, camera: Camera, characterRoot:Object3D, animationMixer: AnimationMixer,main:Main) {
        this.main =main;
        this.renderer = renderer;
        this.camera = camera;
        this.animationMixer = animationMixer;
        this.characterRoot =characterRoot;
        this.animationMixer.setAnimation("idle");
        this.characterRoot.setPosition(this.charPos.x,this.charPos.y,this.charPos.z)
        this.floorHitIndicator =new FloorHitIndicator(this.renderer)

    }
    setRoot(r:Object3D,scene:number){
        this.scene = scene;
        this.root =r;
        this.root.addChild(this.characterRoot)
        this.root.addChild(this.floorHitIndicator)


        if(scene==0){
            this.charPos.set(-this.renderer.ratio * 3 / 2+0.3, 0, -1.5)
            this.floorPos.set(0,0,-1.5)
            this.moveCharToFloorHit()

        }else{
            this.charPos.set(-1.512388, 0, -4.69928)
            this.floorPos.set(-2.5,0,-1.9)
            this.moveCharToFloorHit()
        }
        //this.moveCharToFloorHit()
    }
    update(mousePos: Vector2, down: boolean) {


        this.setMouseFloorPos(mousePos.clone());
        let screen =this.characterRoot.getWorldPos().x -this.root.getPosition().x;
        this.targetOffset =(-screen );
        if(this.scene==0){
            if(screen-0.2<-this.renderer.ratio * 3 / 2){
                this.main.setScene(1)
            }
        }
        if(this.scene==1){
           let distToDoor =(this.characterRoot.getWorldPos().subtract(this.root.getPosition()).distance(new Vector3(-1.305644, 0, -5.052313)))

        if(distToDoor<0.3)this.main.setScene(0);
        }
        this.offset+=(this.targetOffset-this.offset)/20;

        this.root.setPosition(this.offset,-1.5,0)

        if(this.floorHit){
          //  this.characterRoot.setPosition(this.floorPos.x,this.floorPos.y,this.floorPos.z)

            this.floorHitIndicator.setPosition(this.floorPos.x,this.floorPos.y+0.01,this.floorPos.z)
            if(down){

                this.moveCharToFloorHit()

            }
        }
        this.floorHitIndicator.visible =this.floorHit

        this.animationMixer.update();
        this.characterRoot.setPosition(this.charPos.x,this.charPos.y,this.charPos.z)
        this.characterRoot.setEuler(0,this.characterRot,0)

    }

    private setMouseFloorPos(mousePos: Vector2) {
        let posFloor=this.root.getPosition();
        this.floorPlane.set(posFloor.x,posFloor.y,posFloor.z);

        mousePos.scale(new Vector2(2 / (this.renderer.width / this.renderer.pixelRatio), 2 / (this.renderer.height / this.renderer.pixelRatio)))
        let pos = new Vector4(mousePos.x - 1, (mousePos.y - 1)*-1, 1, 1);
        if (this.camera.viewProjectionInv) {
            pos.transform(this.camera.viewProjectionInv);
            let rayStart = this.camera.cameraWorld.clone()
            let rayDir = new Vector3(pos.x-rayStart.x, pos.y-rayStart.y, pos.z-rayStart.z).normalize()


            let denom = this.up.dot(rayDir);
            if (Math.abs(denom) > 0.01) // your favorite epsilon
            {

                let t = (this.floorPlane.clone().subtract(rayStart)).dot(this.up) / denom;
                if (t < 0) {
                    this.floorHit =false;
                    return;
                } else {
                    rayDir.scale(t);
                    rayStart.add(rayDir);
                    if ( rayStart.z<-6){
                        this.floorHit =false;
                        return;
                    }
                    this.floorHit =true;
                    this.floorPos = rayStart.clone().subtract(posFloor)

                }


            } else {
                this.floorHit =false;
            }


        }
    }

    private moveCharToFloorHit() {
        let dist =this.charPos.distance(this.floorPos);

        let dir = this.floorPos.clone().subtract(this.charPos)

        let angle = Math.atan2(dir.x,dir.z);
        if(this.tl)this.tl.clear()
        this.tl = gsap.timeline({});
        let pos =0

       this.tl.call(()=>{ this.animationMixer.setAnimation("walking",0)    },[],pos)
        this.tl.to(this.animationMixer,{"mixValue":1,duration:0.5,ease: "none"},pos)
        this.tl.to(this,{"characterRot":angle,duration:0.5,ease: "none"},pos)

        pos+=0.3;
        let duration =dist*0.75;
      this.tl.to(this.charPos,{"x":this.floorPos.x,"y":this.floorPos.y,"z":this.floorPos.z,duration:duration ,ease: "none"},pos)

        pos+=duration;
      let nextAnime = "idle"
        if(Math.random()>0.7)nextAnime ="bored"
      this.tl.call(()=>{ this.animationMixer.setAnimation(nextAnime ,0);},[],pos)
        this.tl.to(this.animationMixer,{"mixValue":1,duration:0.5,ease: "none"},pos)
       this.tl.to(this,{"characterRot":0 ,duration:0.5,ease: "none"},pos)

    }
}
