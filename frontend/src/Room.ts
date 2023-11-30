import Renderer from "./lib/Renderer";
import PreLoader from "./lib/PreLoader";
import TextureLoader from "./lib/loaders/TextureLoader";
import GLFTLoader from "./GLFTLoader";
import MainLight from "./MainLight";
import Object3D from "./lib/core/Object3D";
import {LaptopScreen} from "./extras/LaptopScreen";
import {FpsScreen} from "./extras/FpsScreen";
import ModelRenderer from "./lib/model/ModelRenderer";
import {render} from "react-dom";
import Mill from "./extras/Mill";

export default class Room{
    private renderer: Renderer;
    private glFTLoader: GLFTLoader;
    leftHolder: Object3D;
    rightHolder: Object3D;
    mainLight: MainLight;
    centerRightHolder: Object3D;
    modelRenderer: ModelRenderer;
    modelRendererTrans: ModelRenderer;
    private laptopScreen: LaptopScreen;
    private fpsScreen: FpsScreen;
    private mill: Mill;

    root:Object3D;


    constructor(renderer:Renderer,preloader:PreLoader) {

        this.renderer=renderer;
        new TextureLoader(this.renderer,preloader,"triangle.png",{});
        new TextureLoader(this.renderer,preloader,"text_s.png",{});
        new TextureLoader(this.renderer,preloader,"7dig.png",{});

        this.glFTLoader = new GLFTLoader(this.renderer, "roomFinal", preloader);

    }
    init(){
        this.modelRenderer =new ModelRenderer(this.renderer,"room");
        this.modelRendererTrans =new ModelRenderer(this.renderer,"roomTrans");

        this.root =this.glFTLoader.root
        this.glFTLoader.root.setPosition(0, -1.5, 0)

        this.mill =new Mill(this.glFTLoader.objectsByName["mill"])
        for (let m of this.glFTLoader.models) {
            this.modelRenderer.addModel(m)

        }



        this.leftHolder = this.glFTLoader.objectsByName["left"]
        this.rightHolder = this.glFTLoader.objectsByName["right"]
        this.centerRightHolder = this.glFTLoader.objectsByName["centerRight"]

        this.mainLight =new MainLight(this.renderer)
        this.glFTLoader.objectsByName["mainLight"].addChild(this.mainLight)
        this.glFTLoader.objectsByName["mainLight"].castShadow =false


        this.laptopScreen =new LaptopScreen(this.renderer, this.glFTLoader.objectsByName["labtop"]);
        this.modelRenderer.addModel(this.laptopScreen);
        this.fpsScreen =new FpsScreen(this.renderer, this.glFTLoader.objectsByName["powersup"]);
        this.modelRenderer.addModel(  this.fpsScreen);



    }
makeTransParent(){
    for (let m of this.glFTLoader.modelsGlass) {

        m.material.uniforms.setTexture("gDepth",this.renderer.texturesByLabel["GDepth"])
        m.material.uniforms.setTexture("reflectTexture",this.renderer.texturesByLabel["BlurLightPass"])
        this.modelRendererTrans.addModel(m)

    }
}
    addCharacter(charRoot:Object3D){
        this.glFTLoader.root.addChild(charRoot)
    }
    update() {
        this.leftHolder.setPosition(-this.renderer.ratio * 3 / 2, 0, 0)
        this.rightHolder.setPosition(this.renderer.ratio * 3 / 2, 0, 0)
        this.centerRightHolder.setPosition(-this.renderer.ratio * 3 / 4 + 2, 0, 0)

        this.glFTLoader.root.setPosition(0, -1.5, 0)
        this.mill.update();
    }
}