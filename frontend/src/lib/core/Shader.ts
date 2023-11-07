import ObjectGPU from "./ObjectGPU";
import Renderer from "../Renderer";
import Attribute from "./Attribute";
import UniformGroup from "./UniformGroup";
import MathArray from "@math.gl/core/src/classes/base/math-array";
import Camera from "../Camera";
import Material from "./Material";
import Texture from "../textures/Texture";
import {TextureDimension} from "../WebGPUConstants";
import {ShaderType} from "./ShaderTypes";


export default class Shader extends ObjectGPU
{

    attributes: Array<Attribute> = [];
    shader: GPUShaderModule;


    tempMaterial: Material
    constructor(renderer:Renderer,label="") {
        super(renderer,label);

    }
    init(){}

    public addUniform(name:string, value:MathArray | number,usage:GPUShaderStageFlags =GPUShaderStage.FRAGMENT,format=ShaderType.auto,arraySize=1)
    {
        if(!this.tempMaterial.uniforms)     this.tempMaterial.uniforms =new UniformGroup(this.renderer,this.label,"uniforms")

        this.tempMaterial.uniforms.addUniform(name,value)

    }
    public addTexture(name:string, value:Texture,dimension:GPUTextureViewDimension=TextureDimension.TwoD,usage:GPUShaderStageFlags =GPUShaderStage.FRAGMENT)
    {
        if(!this.tempMaterial.uniforms)     this.tempMaterial.uniforms =new UniformGroup(this.renderer,this.label,"uniforms")
        this.tempMaterial.uniforms.addTexture(name,value,dimension,usage);

    }
    public addSampler(name:string)
    {
        if(!this.tempMaterial.uniforms)     this.tempMaterial.uniforms =new UniformGroup(this.renderer,this.label,"uniforms")
        this.tempMaterial.uniforms.addSampler(name);

    }
    public addVertexOutput(name:string,length: number){

    }
    public addAttribute(name: string, type:string,arrayLength=1) {
        let at = new Attribute(name, type,arrayLength);
        at.slot = this.attributes.length;
        this.attributes.push(at);
    }
    public getShaderUniforms()
    {
        let a =""
        if(this.tempMaterial.uniforms){
         a =this.tempMaterial.uniforms.getShaderText(2)
        }

        return a;

    }
    public getShaderAttributes() {
        let a = "";
        for (let atr of this.attributes) {
            a += atr.getShaderText();
        }
        return a;
    }

    public getShader() {
       if(this.shader) return this.shader
console.log(this.getShaderCode())
        this.shader = this.device.createShaderModule({
            label: "shader_" + this.label,
            code: this.getShaderCode(),
        });
       return this.shader
    }

    protected getShaderCode(): string {
        return ``;
    }

    getVertexBufferLayout() {
        let bufferLayout:Array<GPUVertexBufferLayout> = [];


        for (let atr of this.attributes) {

            let vertexAtr:GPUVertexAttribute={
                shaderLocation: atr.slot, offset: 0, format: atr.format

            }

            bufferLayout.push({
                arrayStride: atr.size * 4,
                attributes: [
                    vertexAtr,
                ],
            });
        }
        return bufferLayout;
    }
}
